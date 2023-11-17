# split-text

> Split a text into an array of chunks. Their length is determined by the `limit` argument. It will no cut off words unless there is no spaces in the text. Returns an array with the chunks.


## Install

```
$ npm install --save split-text
```


## Usage

```js
var splitText = require('split-text');

splitText('unicorns are awesome', 15);
//=> ['unicorns are', 'awesome']
```


## API

### splitText(text, limit)

#### text

*Required*  
Type: `string`

A string of text.

#### limit

*Required*
Type: `number`  

The max size of the chunks.

## License

MIT © [Kahlil Lechelt](http://kahlil.info)
