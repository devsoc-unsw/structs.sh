import { format, formatDistance } from 'date-fns';
import { TimeSeriesData } from 'src/model/dataVisualisation/TimeSeriesData';

/**
 * Creates the array of day intervals (called 'bins') from a given starting timestamp (inclusive of the day that falls under)
 * to an ending timestamp (inclusive of the day that falls under).
 * Eg. 
 *    fromTimestamp: 1629066600000 ms, equivalent to: 15/08/2021, 10:30:00 PM UTC
                                                  or: 16/08/2021,  8:30:00 AM AEST (GMT+10:00)
 *    toTimestamp:   1629633593000 ms, equivalent to: 22/08/2021, 11:59:53 AM UTC 
 *                                                or: 22/08/2021,  9:59:53 PM AEST       
 *    Would return:
 *        [
 *          { timestamp: 1628985600000, date: '15/8/2021', ... },    <--- Note that this is inclusive of fromTimestamp's current day
 *          { timestamp: 1629072000000, date: '16/8/2021', ... },
 *          { timestamp: 1629158400000, date: '17/8/2021', ... },
 *          { timestamp: 1629244800000, date: '18/8/2021', ... },
 *          { timestamp: 1629331200000, date: '19/8/2021', ... },
 *          { timestamp: 1629417600000, date: '20/8/2021', ... },
 *          { timestamp: 1629504000000, date: '21/8/2021', ... },
 *          { timestamp: 1629590400000, date: '22/8/2021', ... }     <--- Note that this is inclusive of toTimestamp's current day
 *        ]
 * 
 * --- Some Terminology Clarification ---
 *    UTC -  'universal time coordinated'
 *    GMT -  the same as UTC, except this was the original name prior to standardisation in 1972.
 *           UTC can be considered the successor of GMT
 *    AEST - Australian Easter Standard Time
 * 
 *    Offsets to UTC or GMT are specified in the format: UTC±00:00 GMT+±00:00
 *        AEST is UTC+10:00, or GMT+10:00 
 * 
 *    The UNIX epoch starts exactly from midnight on January 1, 1970. 
 *    The UNIX epoch value measures UTC time.
 */
export const formDayBins = (
  fromTimestamp: number,
  toTimestamp: number
): TimeSeriesData[] => {
  // Note: fromTimestamp and toTimestamp are UNIX timestamps in milliseconds
  // Splitting into intervals of 24 hours, ie. 86400 seconds, 86400000 milliseconds
  const interval: number = 24 * 60 * 60 * 1000;

  const midnightStart = Math.floor(fromTimestamp / interval) * interval;
  const midnightEnd = Math.floor(toTimestamp / interval) * interval;

  const bins: TimeSeriesData[] = [];

  for (
    let currTimestamp = midnightStart;
    currTimestamp <= midnightEnd;
    currTimestamp += interval
  ) {
    bins.push({
      timestamp: currTimestamp,
      date: format(currTimestamp, 'MM/dd/yyyy'),
      relativeTime: formatDistance(currTimestamp, Date.now(), {
        addSuffix: true,
      }),
      value: 0,
    });
  }
  return bins;
};

/**
 * Given an array of time intervals and a timestamp, locates the correct index where
 * the timestamp belongs to. Returns -1 if the given timestamp falls outside the
 * time range
 */
export const findBinIndex = (
  timeBins: TimeSeriesData[],
  timestamp: number
): number => {
  // The bins are in ascending order of timestamp. Could be optimised with binary search
  const binIndex = -1;

  // Falls below the range
  if (timestamp < timeBins[0].timestamp) return -1;

  // Lies above the range
  if (timestamp > timeBins[timeBins.length - 1].timestamp + 24 * 60 * 60 * 1000)
    return -1;

  for (let i = 1; i < timeBins.length; ++i) {
    if (timestamp < timeBins[i].timestamp) {
      // Overshot. The correct bin is the previous
      return i - 1;
    }
  }
  return timeBins.length - 1;
};
