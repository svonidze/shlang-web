import { HtmlParser } from './components/html-parser';
import { TestBed, async } from '@angular/core/testing';
import { } from 'jasmine';

describe('HtmlParser', () => {
    let htmlParser: HtmlParser;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [HtmlParser]
        });
    }));

    it('should extract only text, no scripts, no styles, no extra whitespaces', async(() => {
        htmlParser = TestBed.get(HtmlParser);

        const result = htmlParser.extractText(`
<html>
<head>
 <script type="text/javascript" src="myscripts.js">some js code</script>
 <style>
 #dummy {
  min-width: 200px;
  min-height: 200px;
  max-width: 200px;
  max-height: 200px;
  background-color: #fff000;
 }
 </style>
</head>
<body>
 <div id="dummy"></div>
 <p>P text
    
    New line  text  with  many  whitespaces
   one    two three
 </p>
 <form>
  <input type="submit" value="Remove DUMMY" onclick="removeDummy(); "/>
 </form>
</body>
`);

        expect(
`
P text
New line text with many whitespaces
one two three
`)
        .toEqual(result);
    }));
});
