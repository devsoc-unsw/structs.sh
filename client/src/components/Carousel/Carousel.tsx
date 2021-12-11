import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import bst from 'assets/img/bst.png';
import linkedList from 'assets/img/linked-list.png';
import structs from 'assets/img/structs.png';
import play from 'assets/img/play.png';
import replay from 'assets/img/replay.png';
import pause from 'assets/img/pause.png';
import NextArrow from '@mui/icons-material/ArrowForward';
import PrevArrow from '@mui/icons-material/ArrowBack';
import images from 'assets/img';
import { Typography } from '@mui/material';
import TopicCard from './TopicCard';
import { getTopics, Topic } from 'utils/apiRequests';
import { Notification } from 'utils/Notification';
import { LineLoader } from 'components/Loader';
import './Carousel.scss';
import { Link, useNavigate } from 'react-router-dom';
import { titleToUrl } from 'utils/url';

interface Props {}

const Carousel: React.FC<Props> = () => {
    const [currImageIndex, setImageIndex] = useState<number>(0);
    const [topics, setTopics] = useState<Topic[]>([]);

    const [mouseMoved, setMouseMoved] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        getTopics().then(setTopics).catch(Notification.error);
    }, []);

    const handleClick = (topic: Topic) => {
        if (!mouseMoved) {
            navigate(`/visualiser/${titleToUrl(topic.title)}`);
        }
    };

    return topics && topics.length > 0 ? (
        <Slider
            variableWidth
            infinite
            speed={500}
            slidesToShow={1}
            centerMode
            centerPadding="0"
            beforeChange={(oldIndex, newIndex) => setImageIndex(newIndex)}
        >
            {topics.map((topic, i) => (
                <div
                    onMouseMove={() => setMouseMoved(true)}
                    onMouseDown={() => setMouseMoved(false)}
                    onMouseUp={() => handleClick(topic)}
                    key={i}
                    className={`slide ${i === currImageIndex && 'activeSlide'} ${
                        (Math.abs(i - currImageIndex) === 1 ||
                            (i === 0 && currImageIndex === topics.length - 1) ||
                            (i === topics.length - 1 && currImageIndex === 0)) &&
                        'adjacentSlide'
                    }`}
                >
                    <TopicCard topic={topic} isActive={i === currImageIndex} />
                </div>
            ))}
        </Slider>
    ) : (
        <LineLoader />
    );
};

export default Carousel;
