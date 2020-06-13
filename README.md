# Link metadata parser

This parser based on [url-metadata](https://github.com/LevelNewsOrg/url-metadata) module. Also used [chardet](https://github.com/runk/node-chardet) and [iconv-lite](https://github.com/ashtuchkin/iconv-lite) for encoding characters, [sharp](https://github.com/lovell/sharp) for image conversion, [nodemon](https://github.com/remy/nodemon) for local development.

## Usage

Either through cloning with git or by using [npm](http://npmjs.org/) (the recommended way):

```bash
npm install --save link-metadata-parser
```

and use in code:

```javascript
var linkMetadata = require('link-metadata-parser');

/**
 * Also you can pass all options from 
 * https://github.com/LevelNewsOrg/url-metadata/#options
 */
var options = {
    encodeImage: false,
    maxImageWidth: 0
};

linkMetadata(link, options).then(
    (meta) => console.log(meta),
    (err) => console.log(err)
);
```

## Deploy

Repository already contains server example:

```bash
npm run server
```

and it can be running inside Docker:

```bash
docker build -t metadata:latest -f ./example/Dockerfile .
docker run -d -p 8080:8080 --name link-metadata-parser metadata:latest
```

## Development

```bash
npm run develop
```
