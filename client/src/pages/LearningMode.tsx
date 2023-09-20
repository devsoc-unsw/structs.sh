import React, { useState } from "react";
import CodeBlock from "components/CodeBlock";
import { TopNavbar } from "components/Navbars";
import LearningModeCard from "components/LearningModeCard";
import { EduCategory } from "assets/edu/EduCategory";
import style from './LearningMode.module.scss';



const LearningMode = () => {
  const [activeLink, setActiveLink] = useState('Array');

  const handleLinkClick = (name: string) => {
    setActiveLink(name);
  }

	return (
		<div className={style.learning}>
			<div className={style.learningLayout}>
				<div className={style.learningLeft}>
					<div className={style.learningLeftTitle}>
						<h2>Topics</h2>
					</div>
					<div className={style.learningLeftTopic}>
						{EduCategory.map((item, index) => (
							<p key={index}>
								<a 
                  href={`#${item.name}`} 
                  onClick={() => handleLinkClick(item.name)}
                  className={activeLink === item.name ? style.activeLink : ''}
                >{item.name}</a>
							</p>
						))}
					</div>
				</div>
				<div className={style.learningRight}>
					{EduCategory.map((item, index) => (
						<section id={item.name}>
							<LearningModeCard 
								key={index}
								topic={item.name} 
								url={item.url} 
								subtopics={item.children.map(node => ({ 
									topic: node.name, 
									url: node.url,
									subtopics: [],
							}))} />
						</section>
					))}
				</div>
			</div>
		</div>
	);
};

export default LearningMode;
