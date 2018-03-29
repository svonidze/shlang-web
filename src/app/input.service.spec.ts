import { ParsingResult } from './model/parsing-result';
import { TestBed, async } from '@angular/core/testing';
import { InputService } from './services/input.service';
import { ParsingOption } from './model/parsing-option';
import {} from 'jasmine';

describe('InputService', () => {
    let service: InputService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [InputService]
        });
    }));

    function initAndParse(input: string) {
        service = TestBed.get(InputService);

        const result = service.parse(input, {
            ignoreOneLetterWords: true
        });

        console.log(result);
        return result;
    }

    it('should group values separated by whitespaces', () => {
        const result = initAndParse('one   two one   one two');

        expect(result).toEqual([
            new ParsingResult('one', 3),
            new ParsingResult('two', 2)
        ]);
    });

    it('should group values separated by tabs as well', () => {
        const result = initAndParse('one \t two \t one\t  one  two');

        expect(result).toEqual([
            new ParsingResult('one', 3),
            new ParsingResult('two', 2)
        ]);
    });

    it('should group values separated by new lines as well', () => {
        const result = initAndParse(`
        one
        two one
          one two`);

        expect(result).toEqual([
            new ParsingResult('one', 3),
            new ParsingResult('two', 2)
        ]);
    });

    it('should group values whihc contains only words, its part or numbers nothing else', () => {
        const result = initAndParse('sergey`s, one, two! one.. two & one? non-sense doesn\'t');

        expect(result).toEqual([
            new ParsingResult('sergey`s', 1),
            new ParsingResult('one', 3),
            new ParsingResult('two', 2),
            new ParsingResult('non-sense', 1),
            new ParsingResult('doesn\'t', 1),
        ]);
    });

    it('should ignore only digits', () => {
        const result = initAndParse('edited Feb 26 \'16 at 5:36');
        expect(result).toEqual([
            new ParsingResult('edited', 1),
            new ParsingResult('Feb', 1),
            new ParsingResult('at', 1),
        ]);
    });

});
