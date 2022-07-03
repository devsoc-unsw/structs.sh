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
        position: 'absolute',
        right: '0',
        height: '44vh',
        bottom: '7vh',
        display: 'flex',
        flexDirection: 'row-reverse',
        // justifyContent: 'stretch',
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
      <Collapse in={shouldDisplay} orientation="horizontal">
        <Box
          sx={{
            boxSizing: 'border-box',
            paddingLeft: 2,
            paddingTop: 2,
            paddingBottom: 2,
            height: '100%',
            width: '30vw',
            overflowY: 'auto',
          }}
        >
          <Box id="code-container">
            <svg id="code-canvas" />
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default CodeSnippet;
