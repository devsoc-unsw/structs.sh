import React, { useState } from 'react';
import { CopyBlock, dracula } from 'react-code-blocks';
import { sample, TopBar } from 'components/CodeSnippet/components';

const CodeSnippet = () => {
    const [language, changeLanguage] = useState('python');
    const [languageDemo, changeDemo] = useState(sample['python']);
    const [lineNumbers, toggleLineNumbers] = useState(true);

    const [highlighted, setHighlighted] = useState('1');

    const step = () => {
        const nextLine = parseInt(highlighted) + 1;
        if (nextLine > 30) {
            setHighlighted('1');
        } else {
            setHighlighted(nextLine.toString());
        }
    };

    return (
        <div className="container mx-auto p-4">
            <TopBar
                language={{
                    value: language,
                    onChange: (e) => {
                        changeDemo(sample[e.target.value]);
                        return changeLanguage(e.target.value);
                    },
                    options: Object.keys(sample).map((lang) => (
                        <option key={lang} value={lang}>
                            {lang}
                        </option>
                    )),
                }}
                toggle={{
                    checked: lineNumbers,
                    onChange: (e) => toggleLineNumbers(!lineNumbers),
                }}
            />
            <div className="demo">
                <CopyBlock
                    language={language}
                    text={languageDemo}
                    showLineNumbers={lineNumbers}
                    theme={dracula}
                    wrapLines={true}
                    highlight={highlighted}
                    codeBlock
                />
                <br />
                <button onClick={step}>Highlight Next Line</button>
                {/* <CopyBlock
          language="go"
          text={`v := Vertex{X: 1, Y: 2}`}
          codeBlock
          theme={dracula}
          showLineNumbers={false}
        /> */}
            </div>
        </div>
    );
};

export default CodeSnippet;
