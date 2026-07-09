import React, { FC, MouseEvent } from 'react';
import { Box, Typography } from '@mui/material';
import { RedMenuButton } from './styled';

interface Props {
  options: any[];
  handleLoad: (e: MouseEvent<HTMLButtonElement>, data: number[]) => void;
  handleToggleExpansion: () => void;
}

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
        <RedMenuButton
          key={index}
          onClick={(e) => {
            handleLoad(e, option.data);
          }}
        >
          <Typography color="textPrimary" whiteSpace="nowrap">
            {option.name}
          </Typography>
        </RedMenuButton>
      ))}
      <RedMenuButton
        onClick={(e) => {
          handleClose(e);
        }}
      >
        <Typography color="textPrimary" whiteSpace="nowrap">
          Close
        </Typography>
      </RedMenuButton>
    </Box>
  );
};

export default LoadOptions;
