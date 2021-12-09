import React from 'react';
import Typography from '@mui/material/Typography';
import {
    IconButton,
    ImageList,
    ImageListItem,
    ImageListItemBar,
    ListSubheader,
    Theme,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/styles';

type GalleryItem = {
    name: string;
    tagline: string;
    imageSrc: string;
};

interface Props {
    items: GalleryItem[];
}

const Gallery: React.FC<Props> = ({ items }) => {
    const theme: Theme = useTheme();
    const belowSmall = useMediaQuery(theme.breakpoints.up(550));

    return (
        <ImageList>
            {items &&
                items.map((item) => (
                    <ImageListItem key={item.imageSrc} cols={belowSmall ? 1 : 2}>
                        <img src={item.imageSrc} alt={item.name} loading="lazy" />
                        <ImageListItemBar title={item.name} subtitle={item.tagline} id="Ass" />
                    </ImageListItem>
                ))}
        </ImageList>
    );
};

export default Gallery;
