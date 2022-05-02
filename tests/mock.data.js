/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
const validVc = require('./validVc.json');
const {v4: uuidv4} = require('uuid');

// copies a validVc and adds an id.
const createValidVc = () => ({
  ...validVc,
  id: `urn:uuid:${uuidv4()}`
});

module.exports = {
  createValidVc
};
