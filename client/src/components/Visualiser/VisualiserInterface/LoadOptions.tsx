import React, { FC, MouseEvent } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

interface Props {
  options: any[];
  handleLoad: (e: MouseEvent<HTMLButtonElement>, data: number[]) => void;
  handleToggleExpansion: () => void;
}

const MenuButton = styled(Button)({
  backgroundColor: '#C81437',
  '&:hover': {
    backgroundColor: '#F05C79',
  },
  maxWidth: '100%',
  borderRadius: '0',
});

/**
 * Lists the data that can be loaded
 */
const LoadOptions: FC<Props> = ({ options, handleLoad, handleToggleExpansion }) => {
  const handleClose = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleToggleExpansion();
  };

  return (
    <Box display="flex" flexDirection="column" gap="10px" marginTop="10px" marginBottom="10px">
      {options.map((option, index) => (
        <MenuButton
          key={index}
          onClick={(e) => {
            handleLoad(e, option.data);
          }}
        >
          <Typography color="textPrimary" whiteSpace="nowrap">
            {option.name}
          </Typography>
        </MenuButton>
      ))}
      <MenuButton
        onClick={(e) => {
          handleClose(e);
        }}
      >
        <Typography color="textPrimary" whiteSpace="nowrap">
          Close
        </Typography>
      </MenuButton>
    </Box>
  );
};

export default LoadOptions;
