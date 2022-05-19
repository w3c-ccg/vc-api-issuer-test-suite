/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {v4: uuidv4} = require('uuid');
const {klona} = require('klona');
const validVc = require('./validVc.json');

// copies a validVc and adds an id.
const createRequestBody = ({issuer, vc = validVc}) => {
  const {issuer: {id, options}} = issuer;
  const credential = klona(vc);
  credential.id = `urn:uuid:${uuidv4()}`;
  credential.issuer = id;
  return {
    credential,
    options
  };
};

module.exports = {createRequestBody};
