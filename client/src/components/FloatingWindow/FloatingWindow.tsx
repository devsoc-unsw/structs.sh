import { ReactNode } from 'react';
import { Box, Collapse, useTheme } from '@mui/material';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';

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
  maxHeight = '80vh',
  flexDirection = 'row',
}: FloatingWindowProps) => {
  const theme = useTheme();

  return (
    <Box
      bgcolor={theme.palette.background.default}
      color={theme.palette.text.primary}
      position="absolute"
      bottom="54px"
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
