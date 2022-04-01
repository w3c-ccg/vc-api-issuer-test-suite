/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
const validVC = require('./validVC.json');
const {v4: uuidv4} = require('uuid');

// copies a validVC and adds an id.
const createValidVC = () => ({
  ...validVC,
  id: `urn:uuid:${uuidv4()}`
});

module.exports = {
  createValidVC
};
