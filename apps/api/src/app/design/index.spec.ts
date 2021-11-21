import { fail } from 'assert';
import { validate_doc_update } from './index';

// fields
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
    const newDoc = {
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

    test('is valid', () => {
      expect(validate_doc_update(newDoc, {}, {})).toBeTruthy();
    });

    test.each([ORDER_CAR_CLASS_FIELD, ORDER_DATE_FIELD, ORDER_ITEMS_FIELD])(
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

    test.each([ORDER_DATE_FIELD])(
      'error if %s field is not a date',
      async (key) => {
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
      }
    );

    test.each([ORDER_ITEMS_FIELD])(
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
      ORDER_CAR_MODEL_FIELD,
      ORDER_CAR_PRODUCER_FIELD,
      ORDER_CLIENT_NAME_FIELD,
      ORDER_CLIENT_PHONE_FIELD,
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
      ORDER_ITEM_COMPLEXITY_FIELD,
      ORDER_ITEM_COUNT_FIELD,
      ORDER_ITEM_PART_FIELD,
      ORDER_ITEM_SQUARE_FIELD,
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

    test.each([
      ORDER_ITEM_COMPLEXITY_FIELD,
      ORDER_ITEM_PART_FIELD,
      ORDER_ITEM_SQUARE_FIELD,
    ])('error if %s item field is invalid', async (key) => {
      const doc = {
        ...newDoc,
        items: [{ ...newDoc.items[0] }, { ...newDoc.items[0] }],
      };
      doc.items[0][key] = 'invalid value';

      try {
        validate_doc_update(doc, {}, {});
        fail();
      } catch (error) {
        expect(error.forbidden).toContain(`${key} should be in`);
      }
    });
  });
});
