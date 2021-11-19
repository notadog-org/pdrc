import { fail } from 'assert';
import { validate_doc_update } from './index';

// fields
const CATEGORY_FIELD = 'category';
const DATE_FIELD = 'date';
const ITEMS_FIELD = 'items';

const CAR_MODEL_FIELD = 'carModel';
const CAR_PRODUCER_FIELD = 'carProducer';
const CLIENT_NAME_FIELD = 'clientName';
const CLIENT_PHONE_FIELD = 'clientPhone';

const ORDER_ITEM_CAR_CLASS_FIELD = 'carClass';
const ORDER_ITEM_COUNT_FIELD = 'count';
const ORDER_ITEM_PART_FIELD = 'part';
const ORDER_ITEM_SIZE_FIELD = 'size';
const ORDER_ITEM_TABLE_FIELD = 'table';
const ORDER_ITEM_PRICE_FIELD = 'price';

// values
const CATEGORY_VALID_VALUES = [];
const CAR_CLASS_VALID_VALUES = [];
const PART_VALID_VALUES = [];
const SIZE_VALID_VALUES = [];

describe('Base validation', () => {
  describe('order', () => {
    const newDoc = {
      type: 'order',
      carModel: 'A5',
      carProducer: 'Audi',
      category: 1,
      clientName: 'Ivan',
      clientPhone: '89998887766',
      date: new Date(),
      items: [
        {
          carClass: 'A',
          count: 1,
          part: 'right door',
          size: '1-2',
          table: 'Complicated',
          price: 200,
        },
        {
          carClass: 'A',
          count: 1,
          part: 'right door',
          size: '1-2',
          table: 'Simple',
          price: 200,
        },
      ],
    };

    test('is valid', () => {
      expect(validate_doc_update(newDoc, {}, {})).toBeTruthy();
    });

    test.each([CATEGORY_FIELD, DATE_FIELD, ITEMS_FIELD])(
      'error if %s field is not defined',
      async (key) => {
        const doc = { ...newDoc };
        delete doc[key];

        try {
          validate_doc_update(doc, {}, {});
          fail();
        } catch (error) {
          expect(error).toEqual({
            forbidden: `document must have a ${key}`,
          });
        }
      }
    );

    test.each([DATE_FIELD])('error if %s field is not a date', async (key) => {
      const doc = { ...newDoc };
      doc[key] = 1;

      try {
        validate_doc_update(doc, {}, {});
        fail();
      } catch (error) {
        expect(error).toEqual({
          forbidden: `${key} should be a date`,
        });
      }
    });

    test.each([ITEMS_FIELD])(
      'error if %s field is not an array',
      async (key) => {
        const doc = { ...newDoc };
        doc[key] = 1;

        try {
          validate_doc_update(doc, {}, {});
          fail();
        } catch (error) {
          expect(error).toEqual({
            forbidden: `${key} should be an array`,
          });
        }
      }
    );

    test.each([
      CAR_MODEL_FIELD,
      CAR_PRODUCER_FIELD,
      CLIENT_NAME_FIELD,
      CLIENT_PHONE_FIELD,
    ])('error if %s field is defined, but is empty', async (key) => {
      const doc = { ...newDoc };
      doc[key] = '';

      try {
        validate_doc_update(doc, {}, {});
        fail();
      } catch (error) {
        expect(error).toEqual({
          forbidden: `${key} cannot be empty`,
        });
      }
    });

    test.each([
      ORDER_ITEM_CAR_CLASS_FIELD,
      ORDER_ITEM_COUNT_FIELD,
      ORDER_ITEM_PART_FIELD,
      ORDER_ITEM_SIZE_FIELD,
      ORDER_ITEM_TABLE_FIELD,
      ORDER_ITEM_PRICE_FIELD,
    ])('error if %s item field is not defined', async (key) => {
      const doc = {
        ...newDoc,
        items: [{ ...newDoc.items[0] }, { ...newDoc.items[0] }],
      };
      delete doc.items[0][key];

      try {
        validate_doc_update(doc, {}, {});
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
        const doc = {
          ...newDoc,
          items: [{ ...newDoc.items[0] }, { ...newDoc.items[0] }],
        };
        doc.items[0][key] = '1';

        try {
          validate_doc_update(doc, {}, {});
          fail();
        } catch (error) {
          expect(error).toEqual({
            forbidden: `item field ${key} should be a number`,
          });
        }
      }
    );
  });
});
