export const validate_doc_update = function (newDoc, oldDoc, userCtx) {
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

  // validators
  function isRequired(doc, field, message?) {
    message = message || 'document must have a ' + field;
    if (doc[field] === undefined) throw { forbidden: message };
  }

  function notEmpty(doc, field, message?) {
    message = message || field + ' cannot be empty';
    if (doc[field] !== undefined && !doc[field].length) {
      throw { forbidden: message };
    }
  }

  function isNumber(doc, field, message?) {
    message = message || field + ' should be a number';
    if (typeof doc[field] !== 'number') throw { forbidden: message };
  }

  function isString(doc, field, message?) {
    message = message || field + ' should be a string';
    if (typeof doc[field] !== 'string') throw { forbidden: message };
  }

  function isArray(doc, field, message?) {
    message = message || field + ' should be an array';
    if (!Array.isArray(doc[field])) throw { forbidden: message };
  }

  function isDate(doc, field, message?) {
    message = message || field + ' should be a date';
    if (!(doc[field] instanceof Date)) throw { forbidden: message };
  }

  // process

  if (newDoc._id === '_design/base') {
    throw { forbidden: 'You cannot update or delete the filter' };
  }

  if (newDoc.type === 'order') {
    [CATEGORY_FIELD, DATE_FIELD, ITEMS_FIELD].forEach(function (field) {
      isRequired(newDoc, field, undefined);
    });

    [DATE_FIELD].forEach(function (field) {
      isDate(newDoc, field, undefined);
    });
    [ITEMS_FIELD].forEach(function (field) {
      isArray(newDoc, field, undefined);
    });
    [
      CAR_MODEL_FIELD,
      CAR_PRODUCER_FIELD,
      CLIENT_NAME_FIELD,
      CLIENT_PHONE_FIELD,
    ].forEach(function (field) {
      notEmpty(newDoc, field, undefined);
    });

    newDoc.items.forEach(function (item) {
      [
        ORDER_ITEM_CAR_CLASS_FIELD,
        ORDER_ITEM_COUNT_FIELD,
        ORDER_ITEM_PART_FIELD,
        ORDER_ITEM_SIZE_FIELD,
        ORDER_ITEM_TABLE_FIELD,
        ORDER_ITEM_PRICE_FIELD,
      ].forEach(function (field) {
        isRequired(item, field, 'item field ' + field + ' should be defined');
      });

      [ORDER_ITEM_COUNT_FIELD, ORDER_ITEM_PRICE_FIELD].forEach(function (
        field
      ) {
        isNumber(item, field, 'item field ' + field + ' should be a number');
      });
    });

    return true;
  }

  throw { forbidden: 'Unknown data' };
};

export const validation = {
  _id: '_design/base',
  validate_doc_update: validate_doc_update.toString(),
  language: 'javascript',
};
