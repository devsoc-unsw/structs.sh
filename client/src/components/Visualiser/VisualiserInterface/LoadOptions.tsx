import React, { FC, useState, useContext } from 'react';
import { Box, Typography, useTheme, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

interface Props {
    options: any[];
    handleLoad: (data: number[]) => void;
    handleToggleExpansion: () => void;
}

const MenuButton = styled(Button)({
    backgroundColor: '#46B693',
    '&:hover': {
        backgroundColor: '#2b6e5a',
    },
});

/**
 * Lists the data that can be loaded
 */
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