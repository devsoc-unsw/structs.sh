import React, { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Button } from 'reactstrap';

const initialMarkdownText = `
## Linked Lists Introduction!
This is an intro to linked lists.

The user can click submit to save a new lesson to the linked visualiser dashboard.
`;

const MarkdownEditor = () => {
    const [markdownText, setMarkdownText] = useState(initialMarkdownText);
    return (
        <>
            <MDEditor
                textareaProps={{
                    placeholder: 'Please enter Markdown text',
                }}
                height={500}
                value={markdownText}
                onChange={setMarkdownText}
            />
            <Button color="primary">Create</Button>
            <Button color="secondary">Cancel</Button>
        </>
    );
};

export default MarkdownEditor;
