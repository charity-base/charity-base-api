const { isDescendantOfAny } = require('./query-helpers');

describe('isDescendantOfAny', () => {

  test('matches great grandparent', () => {
    const nestedField = 'a.b.c.d.e';
    const ancestorFields = ['aea.one', 'six', 'a.b'];
    const bool = isDescendantOfAny(nestedField, ancestorFields);
    expect(bool).toBe(true);
  });

  test('matches equal fields', () => {
    const field = 'a.bbb.c.de.e';
    const bool = isDescendantOfAny(field, [field]);
    expect(bool).toBe(true);
  });

  test('does not match non-descendant substrings', () => {
    const nestedField = 'a.bbb.c.d.e';
    const ancestorFields = ['a.b', 'a.bb'];
    const bool = isDescendantOfAny(nestedField, ancestorFields);
    expect(bool).toBe(false);
  });

  test('does not match child', () => {
    const nestedField = 'a.bbb.c.d.e';
    const ancestorFields = ['a.bbb.c.d.e.f', 'a.bbb.c.d.e.ase'];
    const bool = isDescendantOfAny(nestedField, ancestorFields);
    expect(bool).toBe(false);
  });

});
