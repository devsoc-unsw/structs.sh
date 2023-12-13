import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CodeBlock from "components/CodeBlock";
import { TopNavbar } from "components/Navbars";
import LearningModeCard from "components/LearningModeCard";
import style from './LearningMode.module.scss';

const eduPages = import.meta.glob('../edu-pages/*.mdx');
const eduQuiz = import.meta.glob('../edu-quiz-pages/*.mdx');


// Extract filenames for eduPages and eduQuiz
const eduPagesFilenames = Object.keys(eduPages).map(path => path.split('/').pop().split('.')[0]);
const eduQuizFilenames = Object.keys(eduQuiz).map(path => path.split('/').pop().split('.')[0]);

// Create a mapping for eduQuiz pages
const eduQuizMapping = eduQuizFilenames.reduce((acc, filename) => {
  acc[filename.replace('Quiz', '')] = `/${filename}`;
  return acc;
}, {});

// Extract filenames and split into main and sub-categories
const categories = Object.keys(eduPages).map(path => {
  const fileName = path.split('/').pop().split('.')[0]; // Remove path and extension
  const [mainCategory, subCategory] = fileName.split('-');
  return { mainCategory, subCategory };
});

// Create arrays for main categories, sub categories, and URLs
const mainCategories = [];
const subCategories = [];
const urls = [];
categories.forEach(({ mainCategory, subCategory }) => {
  if (!mainCategories.includes(mainCategory)) {
      mainCategories.push(mainCategory);
  }
  if (!subCategories.includes(subCategory)) {
      subCategories.push(subCategory);
  }
  urls.push(`/${mainCategory}-${subCategory}`);
});

// Helper function to convert camelCase to spaced words
const formatName = (name) => {
  return name
    // insert space before all caps
    .replace(/([A-Z])/g, ' $1')
    // uppercase the first character
    .replace(/^./, str => str.toUpperCase());
}

// Transform mainCategories to match EduCategory structure
const formattedEduCategories = mainCategories.map(category => ({
  name: formatName(category),
  url: `/${category}`,
  level: 1,
  children: []  // don't need any children. (this is only used for index)
}));


// Transform categories into EduCategory-like structure with quizzes
const dynamicEduCategories = mainCategories.map(mainCategory => {
  const children = categories.filter(cat => cat.mainCategory === mainCategory)
    .map(cat => {
      const eduPageName = `${cat.mainCategory}-${cat.subCategory}`;
      const quizPageUrl = eduQuizMapping[eduPageName] || 'no quiz yet';
      return {
        name: formatName(cat.subCategory),
        url: `/${eduPageName}`,
        quizUrl: quizPageUrl, // Add quiz URL here
        level: 2,
        children: []
      };
    });

  return {
    name: formatName(mainCategory),
    url: `/${mainCategory}`,
    level: 1,
    children
  };
});

const LearningMode = () => {
  const [activeLink, setActiveLink] = useState('Array');
  const navigate = useNavigate();

  const handleLinkClick = (name: string) => {
    setActiveLink(name);
    window.location.hash = `#${name}`;
  }

  return (
    <div className={style.learning}>
      <TopNavbar position="fixed" />
      <div className={style.learningLayout}>
        <div className={style.learningLeft}>
          <div className={style.learningLeftTitle}>
            <h2>Topics</h2>
          </div>
          <div className={style.learningLeftTopic}>
            {formattedEduCategories.map((item, index) => (
              <button
                key={index} 
                onClick={() => handleLinkClick(item.name)}
                className={activeLink === item.name ? style.activeLink : style.inactiveLink}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
        <div className={style.learningRight}>
        {dynamicEduCategories.map((item, index) => (
          <section id={item.name} key={index}>
            <LearningModeCard 
              topic={item.name} 
              url={item.url} 
              quizUrl={item.children.map(node => node.quizUrl)}
              subtopics={item.children.map(node => ({ 
                topic: node.name, 
                url: node.url,
                quizUrl: node.quizUrl,
                subtopics: [],
              }))} 
            />
          </section>
        ))}
        </div>
      </div>
    </div>
  );
};

export default LearningMode;
