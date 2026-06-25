import { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import { useTheme } from '@mui/material/styles';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { FLOATING_WINDOW_BOTTOM, FLOATING_WINDOW_MAX_HEIGHT, FLOATING_WINDOW_PADDING, FLOATING_WINDOW_MIN_WIDTH, FLOATING_WINDOW_MAX_WIDTH } from '@/constants/ui';

interface FloatingWindowProps {
  children: ReactNode;
  isExpanded: boolean;
  handleToggleExpansion: () => void;
  minHeight?: string;
  maxHeight?: string;
  flexDirection?: 'row' | 'row-reverse';
}

/**
 * A collapsible floating window component
 *
 * Used for the GUI for performing operations and the code snippets
 */
const FloatingWindow = ({
  children,
  isExpanded,
  handleToggleExpansion,
  minHeight = undefined,
  maxHeight = FLOATING_WINDOW_MAX_HEIGHT,
  flexDirection = 'row',
}: FloatingWindowProps) => {
  const theme = useTheme();

  return (
    <Box
      bgcolor={theme.palette.background.default}
      color={theme.palette.text.primary}
      position="absolute"
      bottom={FLOATING_WINDOW_BOTTOM}
      minHeight={minHeight}
      maxHeight={maxHeight}
      display="flex"
      flexDirection={flexDirection}
      {...(flexDirection === 'row' ? { left: 0 } : { right: 0 })}
    >
      <Box
        onClick={handleToggleExpansion}
        display="flex"
        alignItems="center"
        bgcolor={theme.palette.primary.main}
      >
        {isExpanded ? (
          flexDirection === 'row' ? (
            <ChevronRight />
          ) : (
            <ChevronLeft />
          )
        ) : flexDirection === 'row' ? (
          <ChevronLeft />
        ) : (
          <ChevronRight />
        )}
      </Box>
      <Collapse in={isExpanded} orientation="horizontal">
        <Box
          boxSizing="border-box"
          paddingLeft={FLOATING_WINDOW_PADDING}
          paddingTop={FLOATING_WINDOW_PADDING}
          paddingBottom={FLOATING_WINDOW_PADDING}
          height="100%"
          minWidth={FLOATING_WINDOW_MIN_WIDTH}
          maxWidth={FLOATING_WINDOW_MAX_WIDTH}
          overflow="auto"
        >
          {children}
        </Box>
      </Collapse>
    </Box>
  );
};

export default FloatingWindow;
