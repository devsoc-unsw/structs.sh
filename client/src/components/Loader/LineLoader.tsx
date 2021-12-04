import React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

interface Props {}

const LineLoader: React.FC<Props> = () => {
    return (
        <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
            <LinearProgress
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '50%',
                    margin: '0 auto',
                }}
            />
        </Box>
    );
};

export default LineLoader;
