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
        height: '40vh',
        paddingLeft: 2,
        paddingTop: 2,
        paddingBottom: 2,
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
            height: '100%',
            width: '400px',
            overflowY: 'auto',
          }}
        >
          <Box id="code-container">
            <svg id="code-canvas" style={{ maxWidth: '80%' }} />
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default CodeSnippet;
