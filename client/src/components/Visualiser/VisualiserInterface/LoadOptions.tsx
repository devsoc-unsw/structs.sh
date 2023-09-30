import React, { FC, useState, useContext } from 'react';
import { Box, Typography, useTheme, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

interface Props {
<<<<<<< HEAD
    options: any[];
    handleLoad: (data: number[]) => void;
    handleToggleExpansion: () => void;
}

const MenuButton = styled(Button)({
    backgroundColor: '#C81437',
    '&:hover': {
        backgroundColor: '#F05C79',
    },
=======
  options: any[];
  handleLoad: (data: number[]) => void;
  handleToggleExpansion: () => void;
}

const MenuButton = styled(Button)({
  backgroundColor: '#C81437',
  '&:hover': {
    backgroundColor: '#F05C79',
  },
>>>>>>> 9664a69cb9210b8ac89d475b837fc4b5aac3b250
});

/**
 * Lists the data that can be loaded
 */
<<<<<<< HEAD
const LoadOptions: FC<Props> = (
    { options, handleLoad, handleToggleExpansion }
) => {
    return (
        <>
            {options.map((option, index) => (
                <MenuButton key={index} onClick={() => {
                    handleLoad(options[index]['data']);
                }}>
                    <Typography color="textPrimary" whiteSpace="nowrap">
                        {options[index]['type']}:
                        {index}
                    </Typography>
                </MenuButton>
            ))}
            <MenuButton onClick={handleToggleExpansion}>
                <Typography color="textPrimary" whiteSpace="nowrap">
                    Close
                </Typography>
            </MenuButton>
        </>
    );
};

export default LoadOptions;
=======
const LoadOptions: FC<Props> = ({ options, handleLoad, handleToggleExpansion }) => {
  return (
    <>
      {options.map((option, index) => (
        <MenuButton
          key={index}
          onClick={() => {
            handleLoad(options[index].data);
          }}
        >
          <Typography color="textPrimary" whiteSpace="nowrap">
            {options[index].type}:{index}
          </Typography>
        </MenuButton>
      ))}
      <MenuButton onClick={handleToggleExpansion}>
        <Typography color="textPrimary" whiteSpace="nowrap">
          Close
        </Typography>
      </MenuButton>
    </>
  );
};

export default LoadOptions;
>>>>>>> 9664a69cb9210b8ac89d475b837fc4b5aac3b250
