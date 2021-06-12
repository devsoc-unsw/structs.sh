import React, { useState } from 'react';
import { getLessonContent } from 'content';
import styles from './Lesson.module.scss';
import { EmbeddedVideoPlayer } from 'components/Video';
import { Gist } from 'components/CodeSnippet';

const Lesson = ({ topic }) => {
    const [lessonContent, setLessonContent] = useState(null);
    getLessonContent(topic).then(setLessonContent).catch(console.log);
    return (
        <div>
            <div className={styles.lessonContainer}>
                {lessonContent ? (
                    <>
                        <h2>{lessonContent.title}</h2>
                        {lessonContent.description}
                        {lessonContent.videos.map((v) => (
                            <EmbeddedVideoPlayer videoID={v} />
                        ))}
                        <Gist />
                    </>
                ) : (
                    <div>Can't find anything for '{topic}'</div>
                )}
            </div>
        </div>
    );
};

export default Lesson;
