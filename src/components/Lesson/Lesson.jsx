import React, { useState } from 'react';
import { getLessonContent } from 'content';

const Lesson = ({ lesson }) => {
    const [lessonContent, setLessonContent] = useState(null);
    getLessonContent(lesson).then(setLessonContent).catch(console.log);
    return <div>Lesson here!!!</div>;
};

export default Lesson;
