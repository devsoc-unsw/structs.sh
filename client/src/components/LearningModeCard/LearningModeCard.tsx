import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './LearningModeCard.module.scss';

interface LearningModeCardItemProps {
	topic: string;
	url: string;
	quizUrl: any;
	subtopics: LearningModeCardItemProps[];
  }

const LearningModeCard: React.FC<LearningModeCardItemProps> = (item) => {
  const navigate = useNavigate();

  const handleQuizLinkClick = (quizUrl: string) => {
    if (quizUrl !== 'no quiz yet') {
      navigate('/learning' + quizUrl);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.card}>
        <div className={style.topic}>
          <h2>{item.topic}</h2>
        </div>
        <div className={style.subtopics}>
          {item.subtopics.map((subtopic, index) => (
            <div key={index} className={style.subtopicContainer}>
              <button 
                onClick={() => navigate('/learning' + subtopic.url)}
                className={style.subtopicButton}>
                {subtopic.topic}
              </button>
              {subtopic.quizUrl === 'no quiz yet' 
                ? <span className={style.noQuiz}>No quiz yet</span> 
                : <button 
                    onClick={() => handleQuizLinkClick(subtopic.quizUrl)}
                    className={style.quizButton}>
                    Go to Quiz
                  </button>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningModeCard;

