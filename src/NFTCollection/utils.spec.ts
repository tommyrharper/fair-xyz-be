import { getShouldUpdateCollection } from './utils';

describe('getShouldUpdateCollection', () => {
  describe('it should return false if', () => {
    test('no new values are added', () => {
      const result = getShouldUpdateCollection({
        oldName: 'fair.xyz',
        oldLaunchDate: new Date(),
        newName: undefined,
        newLaunchDate: undefined,
      });
      expect(result).toBe(false);
    });

    test('new name is the same', () => {
      const result = getShouldUpdateCollection({
        oldName: 'fair.xyz',
        oldLaunchDate: new Date(),
        newName: 'fair.xyz',
        newLaunchDate: undefined,
      });
      expect(result).toBe(false);
    });

    test('new date is the same', () => {
      const result = getShouldUpdateCollection({
        oldName: 'fair.xyz',
        oldLaunchDate: new Date('2020-01-01'),
        newName: undefined,
        newLaunchDate: new Date('2020-01-01'),
      });
      expect(result).toBe(false);

      const result2 = getShouldUpdateCollection({
        oldName: 'fair.xyz',
        oldLaunchDate: null,
        newName: undefined,
        newLaunchDate: null,
      });
      expect(result2).toBe(false);
    });

    test('new name and date are the same', () => {
      const result = getShouldUpdateCollection({
        oldName: 'fair.xyz',
        oldLaunchDate: new Date('2020-01-01'),
        newName: 'fair.xyz',
        newLaunchDate: new Date('2020-01-01'),
      });
      expect(result).toBe(false);
    });
  });

  describe('it should return true if', () => {
    test('new date and name are added', () => {
      const result = getShouldUpdateCollection({
        oldName: 'fair.xyz',
        oldLaunchDate: new Date(),
        newName: 'fairy.nfts.xyz',
        newLaunchDate: null,
      });
      expect(result).toBe(true);

      const result2 = getShouldUpdateCollection({
        oldName: 'fair.xyz',
        oldLaunchDate: new Date('2020-01-01'),
        newName: 'fairy.nfts.xyz',
        newLaunchDate: new Date('2020-01-02'),
      });
      expect(result2).toBe(true);

      const result3 = getShouldUpdateCollection({
        oldName: 'fair.xyz',
        oldLaunchDate: null,
        newName: 'fairy.nfts.xyz',
        newLaunchDate: new Date(),
      });
      expect(result3).toBe(true);
    });

    test('new name is added', () => {
      const result = getShouldUpdateCollection({
        oldName: 'fair.xyz',
        oldLaunchDate: new Date(),
        newName: 'fairy.nfts.xyz',
        newLaunchDate: undefined,
      });
      expect(result).toBe(true);

      const result2 = getShouldUpdateCollection({
        oldName: 'fair.xyz',
        oldLaunchDate: new Date('2020-01-01'),
        newName: 'fairy.nfts.xyz',
        newLaunchDate: new Date('2020-01-01'),
      });
      expect(result2).toBe(true);

      const result3 = getShouldUpdateCollection({
        oldName: 'fair.xyz',
        oldLaunchDate: null,
        newName: 'fairy.nfts.xyz',
        newLaunchDate: null,
      });
      expect(result3).toBe(true);
    });

    test('new date is added', () => {
      const result = getShouldUpdateCollection({
        oldName: 'fair.xyz',
        oldLaunchDate: new Date(),
        newName: 'fair.xyz',
        newLaunchDate: null,
      });
      expect(result).toBe(true);

      const result2 = getShouldUpdateCollection({
        oldName: 'fair.xyz',
        oldLaunchDate: new Date('2020-01-01'),
        newName: 'fair.xyz',
        newLaunchDate: new Date('2020-01-02'),
      });
      expect(result2).toBe(true);
    });
  });
});
