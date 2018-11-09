import { LocalStorageWrapper } from "./LocalStorageWrapper";

const wrapper = new LocalStorageWrapper('prefix');

it('The wrapper uses specific prefix for keeping keys in localStorage', () => {
    wrapper.clear();

    wrapper.setItem('key', 'wrapper value');
    localStorage.setItem('key', 'localStorage value');
    
    expect(localStorage.getItem('key'))
        .toEqual('localStorage value');
    expect(wrapper.getItem('key'))
        .toEqual('wrapper value');
    expect(localStorage.getItem(wrapper.addPrefixToKey('key')))
        .toEqual('wrapper value');
    
        console.log(Object.keys(localStorage));
});

it('keys() returns only specifc keys', () => {
    wrapper.clear();

    wrapper.setItem('key1', 'wrapper value');
    localStorage.setItem('key2', 'localStorage value');

    expect(wrapper.keys()).toEqual(['key1']);

    console.log(Object.keys(localStorage));
});
