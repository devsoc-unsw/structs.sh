import React from 'react';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIosRounded';
import { Carousel } from 'antd';
import 'antd/dist/antd.css';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {Card, Typography, IconButton, CardActionArea, CardContent, CardMedia} from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        margin: '0 auto',
        '& .ant-carousel': {
            '& .slick-list': {
                minHeight: '300px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            },
            '& .slick-list .slick-slide': {
                zIndex: 998,
                pointerEvents: 'auto',
            },
            '& .slick-active.slick-current': {
                zIndex: 999,
            },
            '& .slick-dots li': {
                // margin: '0 4px',
            },
            '& .slick-dots li.slick-active': {
                width: '18px',
            },
            '& .slick-dots li button': {
                background: '#000',
                opacity: '0.2',
            },
            '& .slick-dots li.slick-active button': {
                opacity: '1',
                background: theme.palette.secondary.main,
            },
            '& .slick-arrow': {
                color: '#000',
                opacity: 0.5,
                width: 'unset',
                height: 'unset',
                padding: theme.spacing(1),
                '&:hover': {
                    opacity: 0.7,
                    background: 'rgba(0,0,0,0.2)',
                },
            },
        },
    },
    btn: {
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
        height: '300px',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
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
            <CardMedia className={classes.media} component="img" src={item.image} title={item.title} />
          </CardActionArea>
          <CardContent className={classes.overlay}>
            <Typography gutterBottom component="h2" variant="h4">
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
        autoplay: true,
        autoplaySpeed: 4000,
        lazyLoad: true,
        accessibility: true,
        draggable: true,
        focusOnSelect: true,
        pauseOnDotsHover: true,
        pauseOnHover: true,
        pauseOnFocus: true,
        infinite: true,
        speed: 400,
        arrows: true,
        nextArrow: <NextArrow fontSize="large" customClassName={classes.btn} />,
        prevArrow: <PrevArrow fontSize="large" customClassName={classes.btn} />,
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
