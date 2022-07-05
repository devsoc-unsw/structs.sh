import React, { FC, useState } from 'react';
import { Box, Collapse, useTheme } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

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
      bgcolor={theme.palette.background.default}
      position="absolute"
      right="0"
      bottom="7vh"
      height="40vh"
      display="flex"
      flexDirection="row-reverse"
    >
      <Box
        onClick={handleToggleDisplay}
        sx={{ background: theme.palette.background.paper, display: 'flex', alignItems: 'center' }}
      >
        {shouldDisplay ? (
          <ChevronLeftIcon sx={{ fill: theme.palette.text.primary }} />
        ) : (
          <ChevronRightIcon sx={{ fill: theme.palette.text.primary }} />
        )}
      </Box>
      <Collapse in={shouldDisplay} orientation="horizontal">
        <Box
          boxSizing="border-box"
          paddingLeft="10px"
          paddingTop="10px"
          paddingBottom="10px"
          height="100%"
          width="30vw"
          maxWidth="50vw"
          overflow="auto"
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
