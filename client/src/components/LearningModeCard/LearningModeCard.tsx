import { useEffect } from 'react';
import style from './LearningModeCard.module.scss';

interface LearningModeCardItemProps {
	topic: string;
	url: string;
	subtopics: LearningModeCardItemProps[];
}

const LearningModeCard: React.FC<LearningModeCardItemProps> = (item) => {
	return (
		<div>
			
			<div className={`${style.card} ${style.card_parent}`}>
        {/* <div className={`${style.card} ${style.card_third}`}></div>
			  <div className={`${style.card} ${style.card_first}`}></div> */}
				<div className='topic'>
					<h2>{item.topic}</h2>
				</div>
				<div className={style.subtopics}>
					{item.subtopics.map((subtopic, index) => (
						<p key={index}><a href={`/learning${subtopic.url}`}>{subtopic.topic}</a></p>
					))}
				</div>
        {/* <div className={`${style.card} ${style.card_second}`}></div> */}
			</div>
		</div>
	);
};

export default LearningModeCard;
