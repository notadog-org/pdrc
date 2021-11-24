import { fail } from 'assert';
import { validate_doc_update, params } from './index';

// fields
const SETTINGS_PRICES_FIELD = 'prices';

const ORDER_CAR_CLASS_FIELD = 'carClass';
const ORDER_DATE_FIELD = 'date';
const ORDER_ITEMS_FIELD = 'items';

const ORDER_CAR_MODEL_FIELD = 'carModel';
const ORDER_CAR_PRODUCER_FIELD = 'carProducer';
const ORDER_CLIENT_NAME_FIELD = 'clientName';
const ORDER_CLIENT_PHONE_FIELD = 'clientPhone';

const ORDER_ITEM_COMPLEXITY_FIELD = 'complexity';
const ORDER_ITEM_COUNT_FIELD = 'count';
const ORDER_ITEM_PART_FIELD = 'part';
const ORDER_ITEM_SQUARE_FIELD = 'square';
const ORDER_ITEM_PRICE_FIELD = 'price';

describe('Base validation', () => {
  describe('order', () => {
    const NEW_DOC = {
      type: 'order',
      carClass: 'C',
      carModel: 'A5',
      carProducer: 'Audi',
      clientName: 'Ivan',
      clientPhone: '89998887766',
      date: new Date(),
      items: [
        {
          complexity: 'light',
          count: 1,
          part: 'doorFrontLeft',
          square: '1-3',
          price: 200,
        },
        {
          complexity: 'complicated',
          count: 1,
          part: 'trunk',
          square: '5-10',
          price: 200,
        },
      ],
    };

    let newDoc;

    beforeEach(() => {
      newDoc = {
        ...NEW_DOC,
        items: [{ ...NEW_DOC.items[0] }, { ...NEW_DOC.items[0] }],
      };
    });

    test('is valid', () => {
      expect(validate_doc_update(newDoc, {}, {})).toBeTruthy();
    });

    test.each([ORDER_CAR_CLASS_FIELD, ORDER_DATE_FIELD, ORDER_ITEMS_FIELD])(
      'error if %s field is not defined',
      async (key) => {
        delete newDoc[key];

        try {
          validate_doc_update(newDoc, {}, {});
          fail();
        } catch (error) {
          expect(error).toEqual({
            forbidden: `document must have a ${key}`,
          });
        }
      }
    );

    test.each([ORDER_DATE_FIELD])(
      'error if %s field is not a date',
      async (key) => {
        newDoc[key] = 1;

        try {
          validate_doc_update(newDoc, {}, {});
          fail();
        } catch (error) {
          expect(error).toEqual({
            forbidden: `${key} should be a date`,
          });
        }
      }
    );

    test.each([ORDER_ITEMS_FIELD])(
      'error if %s field is not an array',
      async (key) => {
        newDoc[key] = 1;

        try {
          validate_doc_update(newDoc, {}, {});
          fail();
        } catch (error) {
          expect(error).toEqual({
            forbidden: `${key} should be an array`,
          });
        }
      }
    );

    test.each([
      ORDER_CAR_MODEL_FIELD,
      ORDER_CAR_PRODUCER_FIELD,
      ORDER_CLIENT_NAME_FIELD,
      ORDER_CLIENT_PHONE_FIELD,
    ])('error if %s field is defined, but is empty', async (key) => {
      newDoc[key] = '';

      try {
        validate_doc_update(newDoc, {}, {});
        fail();
      } catch (error) {
        expect(error).toEqual({
          forbidden: `${key} cannot be empty`,
        });
      }
    });

    test.each([
      ORDER_ITEM_COMPLEXITY_FIELD,
      ORDER_ITEM_COUNT_FIELD,
      ORDER_ITEM_PART_FIELD,
      ORDER_ITEM_SQUARE_FIELD,
      ORDER_ITEM_PRICE_FIELD,
    ])('error if %s item field is not defined', async (key) => {
      delete newDoc.items[0][key];

      try {
        validate_doc_update(newDoc, {}, {});
        fail();
      } catch (error) {
        expect(error).toEqual({
          forbidden: `item field ${key} should be defined`,
        });
      }
    });

    test.each([ORDER_ITEM_COUNT_FIELD, ORDER_ITEM_PRICE_FIELD])(
      'error if %s item field is not a number',
      async (key) => {
        newDoc.items[0][key] = '1';

        try {
          validate_doc_update(newDoc, {}, {});
          fail();
        } catch (error) {
          expect(error).toEqual({
            forbidden: `item field ${key} should be a number`,
          });
        }
      }
    );

    test.each([
      ORDER_ITEM_COMPLEXITY_FIELD,
      ORDER_ITEM_PART_FIELD,
      ORDER_ITEM_SQUARE_FIELD,
    ])('error if %s item field is invalid', async (key) => {
      newDoc.items[0][key] = 'invalid value';

      try {
        validate_doc_update(newDoc, {}, {});
        fail();
      } catch (error) {
        expect(error.forbidden).toContain(`${key} should be in`);
      }
    });
  });

  describe('settings', () => {
    let newDoc;

    beforeEach(() => {
      newDoc = {
        type: 'settings',
        [SETTINGS_PRICES_FIELD]: [
          [
            [1, 2, 3, 4, 5, 6],
            [1, 2, 3, 4, 5, 6],
            [1, 2, 3, 4, 5, 6],
            [1, 2, 3, 4, 5, 6],
            [1, 2, 3, 4, 5, 6],
            [1, 2, 3, 4, 5, 6],
          ],
          [
            [1, 2, 3, 4, 5, 6],
            [1, 2, 3, 4, 5, 6],
            [1, 2, 3, 4, 5, 6],
            [1, 2, 3, 4, 5, 6],
            [1, 2, 3, 4, 5, 6],
            [1, 2, 3, 4, 5, 6],
          ],
          [
            [1, 2, 3, 4, 5, 6],
            [1, 2, 3, 4, 5, 6],
            [1, 2, 3, 4, 5, 6],
            [1, 2, 3, 4, 5, 6],
            [1, 2, 3, 4, 5, 6],
            [1, 2, 3, 4, 5, 6],
          ],
        ],
      };
    });

    test('are valid', () => {
      expect(validate_doc_update(newDoc, {}, {})).toBeTruthy();
    });

    test('error if invalid complexity number', () => {
      newDoc[SETTINGS_PRICES_FIELD].length = 2;

      try {
        validate_doc_update(newDoc, {}, {});
        fail();
      } catch (error) {
        expect(error).toEqual({
          forbidden: `${newDoc[SETTINGS_PRICES_FIELD].length} should be equal ${params.complexity.length}`,
        });
      }
    });

    test('error if invalid class number', () => {
      newDoc[SETTINGS_PRICES_FIELD][0].length = 5;

      try {
        validate_doc_update(newDoc, {}, {});
        fail();
      } catch (error) {
        expect(error).toEqual({
          forbidden: `${newDoc[SETTINGS_PRICES_FIELD][0].length} should be equal ${params.squares.length}`,
        });
      }
    });

    test('error if invalid square number', () => {
      newDoc[SETTINGS_PRICES_FIELD][0][1].length = 5;

      try {
        validate_doc_update(newDoc, {}, {});
        fail();
      } catch (error) {
        expect(error).toEqual({
          forbidden: `${newDoc[SETTINGS_PRICES_FIELD][0][1].length} should be equal ${params.classes.length}`,
        });
      }
    });

    test('error if price value is not a number', () => {
      newDoc[SETTINGS_PRICES_FIELD][0][1][2] = '1';

      try {
        validate_doc_update(newDoc, {}, {});
        fail();
      } catch (error) {
        expect(error).toEqual({
          forbidden: `${newDoc[SETTINGS_PRICES_FIELD][0][1][2]} should be a number`,
        });
      }
    });
  });
});
