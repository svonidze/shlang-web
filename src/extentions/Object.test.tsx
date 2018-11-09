import { isObjectEmpty } from "./Object";

it('null can be handled by isObjectEmpty', () => {
    expect(isObjectEmpty(null)).toBeTruthy();
})

it('undefined can be handled by isObjectEmpty', () => {
    expect(isObjectEmpty(undefined)).toBeTruthy();
})

it('empty object can be handled by isObjectEmpty', () => {
    expect(isObjectEmpty({})).toBeTruthy();
})

it('number can be handled by isObjectEmpty', () => {
    expect(isObjectEmpty(1)).toBe(false);
})

it('non-empty pbject can be handled by isObjectEmpty', () => {
    expect(isObjectEmpty({foo: 'bar'})).toBe(false);
})
