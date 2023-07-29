import { FC } from 'react';
import { Box } from '@mui/material';
import { LineLoader } from 'components/Loader';
import { getTopics } from '../../visualiser-src/common/helpers';
import TopicCard from './TopicCard';

interface Props {}

/**
 * A box containing cards for each topic
 */
const Topics: FC<Props> = () => {
  const topics = getTopics();
  return topics && topics.length > 0 ? (
    <Box
      display="flex"
      flexWrap="wrap"
      flexDirection="row"
      justifyContent="center"
      marginTop={10}
      gap="20px 50px"
    >
      {topics.map((topic, idx) => (
        <TopicCard topic={topic} index={idx} key={idx} />
      ))}
    </Box>
  ) : (
    <LineLoader />
  );
};

export default Topics;
