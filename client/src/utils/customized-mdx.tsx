import React from "react";

export const customizedParagraph = ({ children }) => {

  const paragraphStyle = {
    display: 'block',
    color: '#212427',
    marginBlockStart: '1em',
    marginBlockEnd: '1em',
    marginInlineStart: '0',
    marginInlineEnd: '0',
    lineHeight: '1.8rem',
    letterSpacing: '-0.011rem',
    fontSize: '16px',
    fontWeight: 400,
    fontVariantNumeric: 'tabular-nums',
    fontFamily: 'Inter var, -apple-system, system-ui, sans-serif',
  };

  return <p style={paragraphStyle}>{children}</p>;

};

export const customizedListing = ({ children }) => {
  const listingStyle = {
    display: 'list-item',
    color: '#212427',
    lineHeight: '1.8rem',
    letterSpacing: '-0.011rem',
    fontSize: '16px',
    fontWeight: '400',
    fontVariantNumeric: 'tabular-nums',
    fontFamily: 'Inter var, -apple-system, system-ui, sans-serif',
  };

  return <li style={listingStyle}>{children}</li>
}

export const customizedCode = ({ children }) => {

  const codeStyle = {
    backgroundColor: '#ededed',
    padding: '1.6px 6px',
    borderRadius: '4px',
    color: '#304fce',
  }

  return <code style={codeStyle}>{children}</code>

}

export const customizedH1 = ({ children }) => {
  
  const codeStyle = {
    color: '#212427',
    fontFamily: 'Inter var, -apple-system, system-ui, sans-serif',
  }

  return <h1 style={codeStyle}>{children}</h1>
}

export const customizedH2 = ({ children }) => {
  
  const codeStyle = {
    color: '#212427',
    fontFamily: 'Inter var, -apple-system, system-ui, sans-serif',
  }

  return <h2 style={codeStyle}>{children}</h2>
}
