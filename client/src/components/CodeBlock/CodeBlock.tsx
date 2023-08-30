import React, { useRef } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import style from './CodeBlock.module.scss';

interface Props {
	children: string;
}

const CodeBlock = ({ children }: Props): JSX.Element => {

	const copyCode = () => {
		navigator.clipboard.writeText(children)
			.then(() => {
				console.log('Code snippet copied to clipboard!');
			})
			.catch((error) => {
				console.error('Failed to copy code snippet to clipboard:', error);
			});
	}

	return (
		<div className={style.codeBlock}>
			<button className={style.copy} onClick={copyCode}>
        <span>
          <svg 
            xmlSpace="preserve" 
            viewBox="0 0 6.35 6.35" 
            y="0" 
            x="0" 
            height="20" 
            width="20" 
            xmlnsXlink="http://www.w3.org/1999/xlink" 
            version="1.1" 
            xmlns="http://www.w3.org/2000/svg" 
            className={style.clipboard}
          >
            <g>
              <path fill="currentColor" d="M2.43.265c-.3 0-.548.236-.573.53h-.328a.74.74 0 0 0-.735.734v3.822a.74.74 0 0 0 .735.734H4.82a.74.74 0 0 0 .735-.734V1.529a.74.74 0 0 0-.735-.735h-.328a.58.58 0 0 0-.573-.53zm0 .529h1.49c.032 0 .049.017.049.049v.431c0 .032-.017.049-.049.049H2.43c-.032 0-.05-.017-.05-.049V.843c0-.032.018-.05.05-.05zm-.901.53h.328c.026.292.274.528.573.528h1.49a.58.58 0 0 0 .573-.529h.328a.2.2 0 0 1 .206.206v3.822a.2.2 0 0 1-.206.205H1.53a.2.2 0 0 1-.206-.205V1.529a.2.2 0 0 1 .206-.206z"></path>
            </g>
          </svg>
          <svg 
            xmlSpace="preserve" 
            viewBox="0 0 24 24" 
            y="0" 
            x="0" 
            height="18" 
            width="18" 
            xmlnsXlink="http://www.w3.org/1999/xlink" 
            version="1.1" 
            xmlns="http://www.w3.org/2000/svg" 
            className={style.checkmark}
          >
            <g>
              <path data-original="#000000" fill="currentColor" d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"></path>
            </g>
          </svg>
        </span>
      </button>
			<SyntaxHighlighter language='c' style={dracula}>
        {children}
      </SyntaxHighlighter>
		</div>
	)
}

export default CodeBlock;
