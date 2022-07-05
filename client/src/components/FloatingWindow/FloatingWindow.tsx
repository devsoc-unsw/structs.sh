import React, { FC, useState } from 'react';
import { Box, Collapse, useTheme } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface Props {
  children: React.ReactNode;
  height?: string;
  flexDirection: 'row' | 'row-reverse';
}

const FloatingWindow: FC<Props> = ({ children, height = undefined, flexDirection }) => {
  const [shouldDisplay, setShouldDisplay] = useState<boolean>(true);
  const theme = useTheme();

  const handleToggleDisplay = () => {
    setShouldDisplay(!shouldDisplay);
  };

  return (
    <Box
      bgcolor={theme.palette.background.default}
      position="absolute"
      bottom="7vh"
      height={height}
      maxHeight="40vh"
      display="flex"
      flexDirection={flexDirection}
      left={flexDirection === 'row' ? '0' : undefined}
      right={flexDirection === 'row-reverse' ? '0' : undefined}
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
          minWidth="30vw"
          maxWidth="50vw"
          overflow="auto"
        >
          {children}
        </Box>
      </Collapse>
    </Box>
  );
};

export default FloatingWindow;
