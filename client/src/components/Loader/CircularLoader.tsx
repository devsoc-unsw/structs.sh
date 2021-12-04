import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

interface Props {}

const CircularLoader: React.FC<Props> = () => {
    return (
        <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
            <CircularProgress
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            />
        </Box>
    );
};

export default CircularLoader;
