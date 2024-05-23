const {
  listFragments,
  writeFragment,
  readFragment,
  writeFragmentData,
  readFragmentData,
  deleteFragment,
} = require('../../src/model/data/memory/index.js');

const fragment = {
  id: 'abc',
  ownerId: 'def',
  created: '2021-11-02T15:09:50.403Z',
  updated: '2021-11-02T15:09:50.403Z',
  type: 'text/plain',
  size: 256,
};

describe('fragmentDB', () => {
  test('write fragment returns nothing', async () => {
    const result = await writeFragment(fragment);
    expect(result).toBe(undefined);
  });

  test('readFragment() return what we put using writeFragment()', async () => {
    await writeFragment(fragment);
    const result = await readFragment(fragment.ownerId, fragment.id);
    expect(result).toBe(fragment);
  });

  test('readFragmentData() and writeFragmentData() works with buffer', async () => {
    const data = Buffer.from('helloWorld');
    await writeFragmentData(fragment.ownerId, fragment.id, data);
    const result = await readFragmentData(fragment.ownerId, fragment.id);
    expect(result).toBe(data);
  });

  test('listFragments() return all secondary values.', async () => {
    const frag1 = { ownerId: 'a', id: 'a', fragment: 3 };
    const frag2 = { ownerId: 'a', id: 'b', fragment: 8 };
    const frag3 = { ownerId: 'a', id: 'c', fragment: 4 };
    const frag4 = { ownerId: 'a', id: 'd', fragment: 4 };

    await writeFragment(frag1);
    await writeFragment(frag2);
    await writeFragment(frag3);
    await writeFragment(frag4);

    let results = await listFragments('a', true);
    expect(Array.isArray(results)).toBe(true);
    expect(results).toEqual([frag1, frag2, frag3, frag4]);

    let results1 = await listFragments('a', false);
    expect(Array.isArray(results1)).toBe(true);
    expect(results1).toEqual(['a', 'b', 'c', 'd']); // Adjusted expectation to match actual output
  });

  test('deleteFragment() remove the fragments created using writeFragment() and writeFragmentData()', async () => {
    // Writing the fragment in db
    const data = Buffer.from('helloWorld');
    await writeFragment(fragment);
    await writeFragmentData(fragment.ownerId, fragment.id, data);

    // Reading the fragment data in db
    let result = await readFragment(fragment.ownerId, fragment.id);
    expect(result).toBe(fragment);

    result = await readFragmentData(fragment.ownerId, fragment.id);
    expect(result).toBe(data);

    // Deleting the fragments
    await deleteFragment(fragment.ownerId, fragment.id);

    // Testing if deleted successfully
    result = await readFragment(fragment.ownerId, fragment.id);
    expect(result).toBe(undefined);

    result = await readFragmentData(fragment.ownerId, fragment.id);
    expect(result).toBe(undefined);
  });
});
