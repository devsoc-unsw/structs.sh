// Docs: https://www.npmjs.com/package/rich-markdown-editor
// Note: This is not a lightweight library. It seems to contribute about 0.25mb to the bundle size
//       One possibility of reducing the performance impact of this library is to use lazy loading:
//       https://blog.revathskumar.com/2019/11/reactjs-lazy-loading-large-libraries.html

import React, { Dispatch, SetStateAction } from 'react';
import Editor from 'rich-markdown-editor';
import { Notification } from 'utils/Notification';

interface Props {
    markdownValue: string;
    setMarkdownValue?: Dispatch<SetStateAction<string>>;
    readOnly?: boolean;
}

const MarkdownEditor: React.FC<Props> = ({ markdownValue, setMarkdownValue, readOnly = false }) => {
    return (
        <Editor
            defaultValue={markdownValue}
            readOnly={readOnly}
            onChange={(getValue) => {
                setMarkdownValue(getValue());
            }}
            onSave={() => {
                Notification.info('Saving');
            }}
            placeholder={'Start typing anything'}
        />
    );
};

export default MarkdownEditor;
