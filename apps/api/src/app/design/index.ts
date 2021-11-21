export const validate_doc_update = function (newDoc, oldDoc, userCtx) {
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

  const COMPLEXITY_VALID_VALUES = ['light', 'complicated', 'hailstorm'];
  const CAR_CLASSES_VALID_VALUES = ['A', 'B', 'C', 'D', 'E', 'F'];
  const SQUARES_VALID_VALUES = [
    '1-3',
    '3-5',
    '5-10',
    '10-20',
    '20-40',
    '40-70',
  ];
  const PARTS_VALID_VALUES = [
    'doorFrontLeft',
    'doorFrontRight',
    'doorBackRight',
    'wingFrontLeft',
    'wingFrontRight',
    'wingBackLeft',
    'wingBackRight',
    'rackLeftRack',
    'rackRightRack',
    'hood',
    'trunk',
    'roof',
  ];

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

  function isValidValue(doc, field, values, message?) {
    message = message || field + ' should be in ' + values;
    if (!values.includes(doc[field])) throw { forbidden: message };
  }

  // process

  if (newDoc._id === '_design/base') {
    throw { forbidden: 'You cannot update or delete the filter' };
  }

  if (newDoc.type === 'order') {
    [ORDER_CAR_CLASS_FIELD, ORDER_DATE_FIELD, ORDER_ITEMS_FIELD].forEach(
      function (field) {
        isRequired(newDoc, field);
      }
    );

    [ORDER_DATE_FIELD].forEach(function (field) {
      isDate(newDoc, field);
    });
    [ORDER_ITEMS_FIELD].forEach(function (field) {
      isArray(newDoc, field);
    });
    [
      ORDER_CAR_MODEL_FIELD,
      ORDER_CAR_PRODUCER_FIELD,
      ORDER_CLIENT_NAME_FIELD,
      ORDER_CLIENT_PHONE_FIELD,
    ].forEach(function (field) {
      notEmpty(newDoc, field);
    });

    [[ORDER_CAR_CLASS_FIELD, CAR_CLASSES_VALID_VALUES]].forEach(function ([
      field,
      values,
    ]) {
      isValidValue(newDoc, field, values);
    });

    newDoc.items.forEach(function (item) {
      [
        ORDER_ITEM_COMPLEXITY_FIELD,
        ORDER_ITEM_COUNT_FIELD,
        ORDER_ITEM_PART_FIELD,
        ORDER_ITEM_SQUARE_FIELD,
        ORDER_ITEM_PRICE_FIELD,
      ].forEach(function (field) {
        isRequired(item, field, 'item field ' + field + ' should be defined');
      });

      [
        [ORDER_ITEM_COMPLEXITY_FIELD, COMPLEXITY_VALID_VALUES],
        [ORDER_ITEM_SQUARE_FIELD, SQUARES_VALID_VALUES],
        [ORDER_ITEM_PART_FIELD, PARTS_VALID_VALUES],
      ].forEach(function ([field, values]) {
        isValidValue(item, field, values);
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
  params: {
    categories: ['light', 'complicated', 'hailstorm'],
    classes: [
      {
        title: 'A',
        length: { from: 0, till: 3.8 },
        width: { from: 0, till: 1.6 },
      },
      {
        title: 'B',
        length: { from: 3.8, till: 4.4 },
        width: { from: 1.5, till: 1.7 },
      },
      {
        title: 'C',
        length: { from: 4.2, till: 4.6 },
        width: { from: 1.6, till: 1.75 },
      },
      {
        title: 'D',
        length: { from: 4.6, till: 4.8 },
        width: { from: 1.7, till: 1.8 },
      },
      {
        title: 'E',
        length: { from: 4.8, till: 5 },
        width: { from: 1.8 },
      },
      {
        title: 'F',
        length: { from: 5 },
        width: { from: 1.8 },
      },
    ],
    squares: [
      { value: '1-3' },
      { value: '3-5' },
      { value: '5-10' },
      { value: '10-20' },
      { value: '20-40' },
      { value: '40-70' },
    ],
    parts: [
      { value: 'doorFrontLeft' },
      { value: 'doorFrontRight' },
      { value: 'doorBackLeft' },
      { value: 'doorBackRight' },
      { value: 'wingFrontLeft' },
      { value: 'wingFrontRight' },
      { value: 'wingBackLeft' },
      { value: 'wingBackRight' },
      { value: 'rackLeftRack' },
      { value: 'rackRightRack' },
      { value: 'hood' },
      { value: 'trunk' },
      { value: 'roof' },
    ],
  },
};
