import React from 'react';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIosRounded';
import { Carousel } from 'antd';
import 'antd/dist/antd.css';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
    Card,
    Typography,
    IconButton,
    CardActionArea,
    CardContent,
    CardMedia,
} from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: '700px',
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        margin: theme.spacing(4, 'auto', 0),
        position: 'relative',
    },
    btn: {
        color: 'rgba(255,255,255,0.5) !important',
        '&:hover': {
            color: `${theme.palette.secondary.main} !important`,
            opacity: 1,
        },
    },
    card: {
        background: 'transparent',
        position: 'relative',
    },
    media: {
        maxWidth: '100%',
        maxHeight: '280px',
    },
    overlay: {
        position: 'absolute',
        top: theme.spacing(4),
        width: '100%',
    },
    title: {
        color: 'white',
        fontFamily: "'Ubuntu Mono', monospace !important",
    },
}));

const PrevArrow = ({ className, fontSize, customClassName, ...restProps }) => {
    return (
        <IconButton className={clsx(className, customClassName)} {...restProps}>
            <ArrowBackIosRoundedIcon fontSize={fontSize} />
        </IconButton>
    );
};

const NextArrow = ({ className, fontSize, customClassName, ...restProps }) => (
    <IconButton className={clsx(className, customClassName)} {...restProps}>
        <ArrowForwardIosRoundedIcon fontSize={fontSize} />
    </IconButton>
);

const LinkCard = ({ item }) => {
    const classes = useStyles();
    return (
        <Card className={classes.card} elevation={0}>
            <CardActionArea component={Link} to={item.route}>
                <CardMedia
                    className={classes.media}
                    component="img"
                    src={item.image}
                    title={item.title}
                />
            </CardActionArea>
            <CardContent className={classes.overlay}>
                <Typography className={classes.title} gutterBottom component="h2" variant="h4">
                    {item.title}
                </Typography>
            </CardContent>
        </Card>
    );
};

/**
 * A customised slide show used to display a collection of items
 */
const CustomCarousel = ({ items }) => {
    const classes = useStyles();
    const settings = {
        // autoplay: true,
        autoplaySpeed: 4000,
        lazyLoad: true,
        accessibility: true,
        // draggable: true,
        focusOnSelect: true,
        pauseOnDotsHover: true,
        pauseOnHover: true,
        pauseOnFocus: true,
        infinite: true,
        speed: 400,
        arrows: true,
        nextArrow: <NextArrow fontSize="large" disableRipple customClassName={classes.btn} />,
        prevArrow: <PrevArrow fontSize="large" disableRipple customClassName={classes.btn} />,
    };

    return (
        <div className={classes.root}>
            <Carousel {...settings}>
                {items.map((item) => (
                    <LinkCard key={item.title} item={item} />
                ))}
            </Carousel>
        </div>
    );
};

export default CustomCarousel;
