import React, { FC, useState } from 'react';
import { Box, Collapse, useTheme } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface Props {
  children: React.ReactNode;
  minHeight?: string;
  maxHeight?: string;
  flexDirection?: 'row' | 'row-reverse';
}

const FloatingWindow: FC<Props> = ({
  children,
  minHeight = undefined,
  maxHeight = undefined,
  flexDirection = 'row',
}) => {
  const [shouldDisplay, setShouldDisplay] = useState<boolean>(true);
  const theme = useTheme();

  const handleToggleDisplay = () => {
    setShouldDisplay(!shouldDisplay);
  };

  return (
    <Box
      bgcolor={theme.palette.background.default}
      position="absolute"
      bottom="54px"
      // height={height}
      // maxHeight="80vh"
      minHeight={minHeight}
      maxHeight={maxHeight}
      display="flex"
      flexDirection={flexDirection}
      left={flexDirection === 'row' && '0'}
      right={flexDirection === 'row-reverse' && '0'}
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
