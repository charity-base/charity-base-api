const { filterObject } = require('./utils');


describe('filterObject', () => {

  test('returns original object when filter is trivial', () => {
    const trivialFilter = (key, value) => true;
    const unfiltered = {a: 0, b: 1, c: 3.5, d: 3, e: 1000, f: 14};
    const filtered = filterObject(unfiltered, trivialFilter);
    expect(filtered).toEqual(unfiltered);
  });

  test('returns empty object when filter is impermeable', () => {
    const impermeableFilter = (key, value) => false;
    const unfiltered = {a: 0, b: 1, c: 3.5, d: 3, e: 1000, f: 14};
    const filtered = filterObject(unfiltered, impermeableFilter);
    expect(filtered).toEqual({});
  });

  test('keeps values above 3', () => {
    const valueGreaterThanThree = (key, value) => (value > 3);
    const unfiltered = {a: 0, b: 1, c: 3.5, d: 3, e: 1000, f: 14};
    const filtered = filterObject(unfiltered, valueGreaterThanThree);
    const expected = {c: 3.5, e: 1000, f: 14};
    expect(filtered).toEqual(expected);
  });

  test('keeps keys beginning with a', () => {
    const keyBeginsWithA = (key, value) => (key.substr(0,1) === 'a');
    const unfiltered = {a: 0, b: 1, ahhh: 3.5, vsaelk: 3, 'a_z' : 1000};
    const filtered = filterObject(unfiltered, keyBeginsWithA);
    const expected = {a: 0, ahhh: 3.5, 'a_z' : 1000};
    expect(filtered).toEqual(expected);
  });

  test('filters keys and values together', () => {
    const dualFilter = (key, value) => ((Number(key) > 29) && (value.length < 31));
    const unfiltered = [...Array(100).keys()].reduce((agg, x) => Object.assign(agg, {[x]: 'a'.repeat(x)}), {})
    // unfiltered looks like { '0': '', '1': 'a', '2': 'aa', '3': 'aaa', ..., '99': 'aaaa...aaaa' }
    const filtered = filterObject(unfiltered, dualFilter);
    const expected = { '30': 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'};
    expect(filtered).toEqual(expected);
  });

  test('does not mutate original object', () => {
    const keyBeginsWithA = (key, value) => (key.substr(0,1) === 'a');
    const unfiltered = {a: 0, b: 1, ahhh: 3.5, vsaelk: 3, 'a_z' : 1000};
    const unfilteredCopy = {a: 0, b: 1, ahhh: 3.5, vsaelk: 3, 'a_z' : 1000};
    filterObject(unfiltered, keyBeginsWithA);
    expect(unfiltered).toEqual(unfilteredCopy);
  });

});
