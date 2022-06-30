import React, { FC, useState } from 'react';
import { Box, Collapse, useTheme } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import ExpandMore from '@mui/icons-material/ExpandMore';

interface Props {}

const CodeSnippet: FC<Props> = () => {
  const [shouldDisplay, setShouldDisplay] = useState<boolean>(true);
  const theme = useTheme();

  const handleToggleDisplay = () => {
    setShouldDisplay(!shouldDisplay);
  };

  return (
    <Box
      sx={{
        background: '#14113C',

        // overflowY : 'auto',
        paddingLeft: 2,
        paddingTop: 2,
        paddingBottom: 2,
        position: 'absolute',
        right: '0',
        minHeight: '40vh',
        bottom: '7vh',
        display: 'flex',
        flexDirection: 'row-reverse',
        // alignItems: 'stretch',
      }}
    >
      <Box
        onClick={handleToggleDisplay}
        sx={{ background: theme.palette.background.paper, display: 'flex', alignItems: 'center' }}
      >
        {shouldDisplay ? (
          <ChevronLeftIcon sx={{ fill: theme.palette.text.primary }} />
        ) : (
          <ExpandMore sx={{ fill: theme.palette.text.primary }} />
        )}
      </Box>
      <Collapse in={shouldDisplay} unmountOnExit orientation="horizontal">
        <Box
          sx={{
            minWidth: '30vw',
          }}
        >
          <svg id="code-canvas" />
        </Box>
      </Collapse>
    </Box>
  );
};

export default CodeSnippet;
