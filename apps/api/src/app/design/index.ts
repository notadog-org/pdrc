export const validate_doc_update = function (newDoc, oldDoc, userCtx) {
  // fields
  const ORDER_CATEGORY_FIELD = 'category';
  const ORDER_DATE_FIELD = 'date';
  const ORDER_ITEMS_FIELD = 'items';

  const ORDER_CAR_MODEL_FIELD = 'carModel';
  const ORDER_CAR_PRODUCER_FIELD = 'carProducer';
  const ORDER_CLIENT_NAME_FIELD = 'clientName';
  const ORDER_CLIENT_PHONE_FIELD = 'clientPhone';

  const ORDER_ITEM_CAR_CLASS_FIELD = 'carClass';
  const ORDER_ITEM_COUNT_FIELD = 'count';
  const ORDER_ITEM_PART_FIELD = 'part';
  const ORDER_ITEM_SIZE_FIELD = 'size';
  const ORDER_ITEM_TABLE_FIELD = 'table';
  const ORDER_ITEM_PRICE_FIELD = 'price';

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
    [ORDER_CATEGORY_FIELD, ORDER_DATE_FIELD, ORDER_ITEMS_FIELD].forEach(
      function (field) {
        isRequired(newDoc, field, undefined);
      }
    );

    [ORDER_DATE_FIELD].forEach(function (field) {
      isDate(newDoc, field, undefined);
    });
    [ORDER_ITEMS_FIELD].forEach(function (field) {
      isArray(newDoc, field, undefined);
    });
    [
      ORDER_CAR_MODEL_FIELD,
      ORDER_CAR_PRODUCER_FIELD,
      ORDER_CLIENT_NAME_FIELD,
      ORDER_CLIENT_PHONE_FIELD,
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
