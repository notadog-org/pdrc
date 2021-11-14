const validate_doc_update = function (newDoc, oldDoc, userCtx) {
  function require(field, message) {
    message = message || 'Document must have a ' + field;
    if (!newDoc[field]) throw { forbidden: message };
  }

  function notEmpty(field, message) {
    require(field, message);

    message = message || field + 'cannot be empty';
    if (!newDoc[field].length) throw { forbidden: message };
  }

  if (newDoc._id === '_design/base') {
    throw { forbidden: 'You cannot update or delete a filter' };
  }

  if (newDoc.type === 'order') {
    notEmpty('title');
  }
};

export const validation = {
  _id: '_design/base',
  validate_doc_update: validate_doc_update.toString(),
  language: 'javascript',
};
