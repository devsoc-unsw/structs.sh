import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './LearningModeCard.module.scss';

interface LearningModeCardItemProps {
	topic: string;
	url: string;
	subtopics: LearningModeCardItemProps[];
}

const LearningModeCard: React.FC<LearningModeCardItemProps> = (item) => {
	const navigate = useNavigate();

	const handleArticleLinkClick = (url: string) => {
		navigate(`/learning${url}`);
	}

	return (
		<div className={style.container}>
			<div className={`${style.card}`}>
        {/* <div className={`${style.card} ${style.card_third}`}></div>
			  <div className={`${style.card} ${style.card_first}`}></div> */}
				<div className={style.topic}>
					<h2>{item.topic}</h2>
				</div>
				<div className={style.subtopics}>
					{item.subtopics.map((subtopic, index) => (
						<p 
							key={index}
							onClick={() => handleArticleLinkClick(subtopic.url)}
						>
							{subtopic.topic}
						</p>
					))}
				</div>
        {/* <div className={`${style.card} ${style.card_second}`}></div> */}
			</div>
		</div>
	);
};

export default LearningModeCard;
