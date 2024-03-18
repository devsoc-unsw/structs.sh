import React, { FC } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

interface Props {
  options: any[];
  handleLoad: (e, data: number[]) => void;
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
  const handleClose = (e) => {
    e.stopPropagation();
    handleToggleExpansion();
  };

  return (
    <Box display="flex" flexDirection="column" gap="10px" marginTop="10px" marginBottom="10px">
      {options.map((option, index) => (
        <MenuButton
          key={index}
          onClick={(e) => {
            handleLoad(e, options[index].data);
          }}
        >
          <Typography color="textPrimary" whiteSpace="nowrap">
            {options[index].name}
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
