import { getLessonContent } from 'content';
import React, { useState } from 'react';
import styles from './Lesson.module.scss';
import renderMarkdown from './markdown-util';
import { Link } from 'react-router-dom';
import { EditButton, NewContentButton } from 'components/Buttons';
import { Typography } from '@mui/material';
// import sampleMD from './sample.md';

const Lesson = ({ topic }) => {
    const [lessonContent, setLessonContent] = useState(null);
    getLessonContent(topic).then(setLessonContent).catch(console.log);

    return (
        <div>
            <div className={styles.lessonContainer}>
                {lessonContent ? (
                    <>
                        <Typography color="textPrimary">
                            <div
                                style={{ fontFamily: 'AtlassianText' }}
                                dangerouslySetInnerHTML={{
                                    __html: renderMarkdown(`# Linked Lists Demystified

If we really want to understand the basics of linked lists, it’s important that we talk about what type of data structure they are.

One characteristic of linked lists is that they are linear data structures, which means that there is a sequence and an order to how they are constructed and traversed. We can think of a linear data structure like a game of hopscotch: in order to get to the end of the list, we have to go through all of the items in the list in order, or sequentially. Linear structures, however, are the opposite of non-linear structures. In non-linear data structures, items don’t have to be arranged in order, which means that we could traverse the data structure non-sequentially.

![image](https://www.101computing.net/wp/wp-content/uploads/linked-list.png)

We might not always realize it, but we all work with linear and non-linear data structures everyday! When we organize our data into hashes (sometimes called dictionaries), we’re implementing a non-linear data structure. Trees and graphs are also non-linear data structures that we traverse in different ways, but we’ll talk more about them in more depth later in the year.
Similarly, when we use arrays in our code, we’re implementing a linear data structure! It can be helpful to think of arrays and linked lists as being similar in the way that we sequence data. In both of these structures, order matters. But what makes arrays and linked lists different?

### Memory management

The biggest differentiator between arrays and linked lists is the way that they use memory in our machines. Those of us who work with dynamically typed languages like Ruby, JavaScript, or Python don’t have to think about how much memory an array uses when we write our code on a day to day basis because there are several layers of abstraction that end up with us not having to worry about memory allocation at all.

But that doesn’t mean that memory allocation isn’t happening! Abstraction isn’t magic, it’s just the simplicity of hiding away things that you don’t need to see or deal with all of the time. Even if we don’t have to think about memory allocation when we write code, if we want to truly understand what’s going on in a linked list and what makes it powerful, we have to get down to the rudimentary level.

We’ve already learned about binary and how data can be broken up into bits and bytes. Just as characters, numbers, words, sentences require bytes of memory to represent them, so do data structures.

When an array is created, it needs a certain amount of memory. If we had 7 letters that we needed to store in an array, we would need 7 bytes of memory to represent that array. But, we’d need all of that memory in one contiguous block. That is to say, our computer would need to locate 7 bytes of memory that was free, one byte next to the another, all together, in one place.

On the other hand, when a linked list is born, it doesn’t need 7 bytes of memory all in one place. One byte could live somewhere, while the next byte could be stored in another place in memory altogether! Linked lists don’t need to take up a single block of memory; instead, the memory that they use can be scattered throughout.

![memalloc](https://miro.medium.com/max/875/1*G43FVT5xJ1n1QDKVNZUxXQ.jpeg)

The fundamental difference between arrays and linked lists is that arrays are static data structures, while linked lists are dynamic data structures. A static data structure needs all of its resources to be allocated when the structure is created; this means that even if the structure was to grow or shrink in size and elements were to be added or removed, it still always needs a given size and amount of memory. If more elements needed to be added to a static data structure and it didn’t have enough memory, you’d need to copy the data of that array, for example, and recreate it with more memory, so that you could add elements to it.

On the other hand, a dynamic data structure can shrink and grow in memory. It doesn’t need a set amount of memory to be allocated in order to exist, and its size and shape can change, and the amount of memory it needs can change as well.

By now, we can already begin to see some major differences between arrays and linked lists. But this begs the question: what allows a linked list to have its memory scattered everywhere? To answer this question, we need to look at the way that a linked list is structured.


`),
                                }}
                            />
                        </Typography>
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
