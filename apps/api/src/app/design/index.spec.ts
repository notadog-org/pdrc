import { validate_doc_update } from './index';

describe('Base validation', () => {
  describe('order', () => {
    test('error if empty title', () => {
      const newDoc = { title: '', type: 'order' };
      try {
        validate_doc_update(newDoc, {}, {});
      } catch (error) {
        expect(error).toEqual({ forbidden: 'title cannot be empty' });
      }
    });
  });
});
