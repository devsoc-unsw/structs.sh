import React, { useState } from 'react';
import { getLessonContent } from 'content';
import styles from './Lesson.module.scss';
import { Typography } from '@material-ui/core';
import { EmbeddedVideoPlayer } from 'components/Video';
import { Gist } from 'components/CodeSnippet';
import renderMarkdown from './markdown-util';
// import sampleMD from './sample.md';

const Lesson = ({ topic }) => {
    const [lessonContent, setLessonContent] = useState(null);
    getLessonContent(topic).then(setLessonContent).catch(console.log);
    return (
        <div>
            <div className={styles.lessonContainer}>
                {lessonContent ? (
                    <>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: renderMarkdown(`# Linear data structures

If we really want to understand the basics of linked lists, it’s important that we talk about what type of data structure they are.

One characteristic of linked lists is that they are linear data structures, which means that there is a sequence and an order to how they are constructed and traversed. We can think of a linear data structure like a game of hopscotch: in order to get to the end of the list, we have to go through all of the items in the list in order, or sequentially. Linear structures, however, are the opposite of non-linear structures. In non-linear data structures, items don’t have to be arranged in order, which means that we could traverse the data structure non-sequentially.
`),
                            }}
                        />
                        {/* <Typography variant="h3" component="h3" style={{ color: 'black' }}>
                            {lessonContent.title}
                        </Typography>
                        <Typography variant="p" component="p" style={{ color: 'black' }}>
                            {lessonContent.description}
                        </Typography> */}
                        {/* {lessonContent.videos.map((v) => (
                            <EmbeddedVideoPlayer videoID={v} />
                        ))}
                        <Gist /> */}
                    </>
                ) : (
                    <div>Can't find anything for '{topic}'</div>
                )}
            </div>
        </div>
    );
};

export default Lesson;
