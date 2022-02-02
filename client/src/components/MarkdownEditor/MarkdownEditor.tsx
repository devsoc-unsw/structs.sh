// Docs: https://www.npmjs.com/package/rich-markdown-editor
// Note: This is not a lightweight library. It seems to contribute about 0.25mb to the bundle size
//       One possibility of reducing the performance impact of this library is to use lazy loading:
//       https://blog.revathskumar.com/2019/11/reactjs-lazy-loading-large-libraries.html

import { Theme } from '@mui/material';
import { useTheme } from '@mui/styles';
import React from 'react';
import Editor from 'rich-markdown-editor';
import { Notification } from 'utils/Notification';
import { light } from './theme';

interface Props {
  markdownValue: string;
  setMarkdownValue?: (newMarkdown: string) => void;
  readOnly?: boolean;
  themeOverride?: any;
}

const MarkdownEditor: React.FC<Props> = ({
  markdownValue,
  setMarkdownValue,
  readOnly = false,
  themeOverride,
}) => {
  const theme: Theme = useTheme();
  const initialMarkdownValue = markdownValue;

  return (
    <Editor
      defaultValue={initialMarkdownValue}
      value={readOnly && markdownValue}
      readOnly={readOnly}
      theme={{
        ...light,
        background: theme.palette.background.default,
        text: theme.palette.text.primary,
        ...themeOverride,
      }}
      onChange={(getValue) => {
        setMarkdownValue(getValue());
      }}
      onSave={() => {
        Notification.info('Saving');
      }}
      placeholder="Start typing anything"
    />
  );
};

export default MarkdownEditor;
