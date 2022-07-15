import React, { FC, useState } from 'react';
import { Box, Collapse, useTheme } from '@mui/material';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';

interface Props {
  children: React.ReactNode;
  minHeight?: string;
  maxHeight?: string;
  flexDirection?: 'row' | 'row-reverse';
  isExpanded: boolean;
  handleToggleExpansion: () => void;
}

const FloatingWindow: FC<Props> = ({
  children,
  minHeight = undefined,
  maxHeight = '80vh',
  flexDirection = 'row',
  isExpanded,
  handleToggleExpansion,
}) => {
  const theme = useTheme();

  return (
    <Box
      bgcolor={theme.palette.background.default}
      position="absolute"
      bottom="54px"
      minHeight={minHeight}
      maxHeight={maxHeight}
      display="flex"
      flexDirection={flexDirection}
      left={flexDirection === 'row' && '0'}
      right={flexDirection === 'row-reverse' && '0'}
    >
      <Box
        onClick={handleToggleExpansion}
        sx={{ background: theme.palette.background.paper, display: 'flex', alignItems: 'center' }}
      >
        {isExpanded ? (
          flexDirection === 'row' ? (
            <ChevronRight sx={{ fill: theme.palette.text.primary }} />
          ) : (
            <ChevronLeft sx={{ fill: theme.palette.text.primary }} />
          )
        ) : flexDirection === 'row' ? (
          <ChevronLeft sx={{ fill: theme.palette.text.primary }} />
        ) : (
          <ChevronRight sx={{ fill: theme.palette.text.primary }} />
        )}
      </Box>
      <Collapse in={isExpanded} orientation="horizontal">
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
