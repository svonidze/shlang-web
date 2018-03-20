# Intro

Web tool to parse and group texts of any languages by words. That might help to get known unknown yet words before consuming any kind of foreign/learning language content either articles, movie subtitles or just text.
Basic functional is extended with Chrome Extention fetaures such as
- passing selected on a page text to the parser,
- (not done) passing a whole web page to be parsed.

## Requirements

* [Node.js](http://nodejs.org/)

## Build the chrome extentnion

`ng build && cp src/manifest.json dist/manifest.json && cp src/app/chrome/background.js dist/background.js`

## License

The MIT License (MIT)

Copyright (c) 2018 svonidze

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
