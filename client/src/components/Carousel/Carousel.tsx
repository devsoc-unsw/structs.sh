import { LineLoader } from 'components/Loader';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { getTopics, Topic } from 'utils/apiRequests';
import Notification from 'utils/Notification';
import { titleToUrl } from 'utils/url';
import './Carousel.scss';
import TopicCard from './TopicCard';

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
      variableWidth={topics.length > 2}
      infinite
      speed={500}
      slidesToShow={1}
      centerMode
      centerPadding="0"
      beforeChange={(oldIndex, newIndex) => setImageIndex(newIndex)}
    >
      {topics.map((topic, idx) => (
        <div
          role="presentation"
          onMouseMove={() => setMouseMoved(true)}
          onMouseDown={() => setMouseMoved(false)}
          onMouseUp={() => handleClick(topic)}
          key={idx}
          className={`slide ${idx === currImageIndex && 'activeSlide'} ${
            topics.length > 2
            && (Math.abs(idx - currImageIndex) === 1
            || (idx === 0 && currImageIndex === topics.length - 1)
            || (idx === topics.length - 1 && currImageIndex === 0))
            && 'adjacentSlide'
          }`}
        >
          <TopicCard topic={topic} isActive={idx === currImageIndex} />
        </div>
      ))}
    </Slider>
  ) : (
    <LineLoader />
  );
};

export default Carousel;
