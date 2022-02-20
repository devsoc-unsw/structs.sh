import React, { FC } from 'react';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { CommandDocumentation } from 'components/Visualiser/commandsInputRules';
import styles from './Terminal.module.scss';

interface Props {
  manual: CommandDocumentation;
}

const ManualText: FC<Props> = ({ manual }) => {
  const createMarkup = (html) => ({ __html: html });

  return (
    <Box sx={{ padding: 2 }}>
      <Typography className={styles.command} sx={{ fontFamily: 'CodeText' }}>
        {manual.command}
      </Typography>
      <Typography className={styles.usage} sx={{ fontFamily: 'CodeText' }}>
        Usage:
        {' '}
        {manual.usage}
      </Typography>
      <Typography
        variant="body2"
        sx={{ fontFamily: 'CodeText' }}
        dangerouslySetInnerHTML={createMarkup(`${manual.description}`)}
      />
    </Box>
  );
};

export default ManualText;
