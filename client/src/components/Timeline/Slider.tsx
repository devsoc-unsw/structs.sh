import { Slider, styled } from '@mui/material';
import { useMemo } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import clsx from 'clsx';

const StyledSlider = styled(Slider)({
  height: '10px',
  marginBottom: '8px',
  marginLeft: '20px',
  '& .MuiSlider-track': {
    backgroundColor: 'var(--primary)',
    borderTopLeftRadius: '9999px',
    borderBottomLeftRadius: '9999px',
  },
  '& .MuiSlider-thumb': {
    width: '10px',
    height: '25px',
    backgroundColor: 'var(--primary)',
    borderRadius: '5px',
    '&:hover': {
      backgroundColor: 'var(--primary-hover)',
    },
    '&:active': {
      backgroundColor: 'var(--primary-active)',
    },
  },
  '& .MuiSlider-rail': {
    backgroundColor: 'var(--slate-7)',
    borderRadius: '9999px',
  },
  '& .MuiSlider-mark': {
    backgroundColor: 'var(--slate-7)',
    height: '10px',
    width: '2px',
  },
  '& .MuiSlider-markLabel': {
    color: 'var(--slate-11)',
    transform: 'translate(-5px, -9px)',
  },
  '&.loading': {
    '& .MuiSlider-track, & .MuiSlider-thumb': {
      filter: 'brightness(0.5)', // Darkens the color slightly
    },
    '& .MuiSlider-thumb:hover': {
      filter: 'brightness(0.5)', // Further darkens on hover
    },
    '& .MuiSlider-thumb:active': {
      filter: 'brightness(0.5)', // Even darker on active state
    },
    cursor: 'not-allowed',
  },
});

const SliderComponent = ({
  max,
  value,
  onChange,
  loading,
}: {
  max: number;
  value: number;
  onChange: (event: Event, value: number | number[], activeThumb: number) => void;
  loading: boolean;
}) => {
  const marks = useMemo(() => {
    if (max <= 25) {
      return [
        { value: 0, label: `0` },
        { value: 5, label: `5` },
        { value: 10, label: `10` },
        { value: 15, label: `15` },
        { value: 20, label: `20` },
      ];
    }

    const gap = Math.ceil(Math.ceil(max / 5) / 10) * 10;
    if (gap === 0) return [];

    const marksArray = [];
    for (let i = 0; i <= max; i += gap) {
      marksArray.push({ value: i, label: `${i}` });
    }

    return marksArray;
  }, [max]);

  return (
    <StyledSlider
      value={value}
      onChange={loading ? undefined : onChange}
      step={1}
      marks={marks}
      max={max}
      valueLabelDisplay="auto"
      className={clsx({ loading })}
    />
  );
};

export default SliderComponent;
