import React from 'react';
import Typography from '@mui/material/Typography';

interface Props {}

const Gallery: React.FC<Props> = () => {
    return (
        <div>
            <Typography color="textPrimary">(Gallery Here: short bio, role in project)</Typography>
        </div>
    );
};

export default Gallery;
