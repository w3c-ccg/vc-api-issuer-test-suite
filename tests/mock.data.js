/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import {createRequire} from 'node:module';
import {klona} from 'klona';
import {v4 as uuidv4} from 'uuid';
const require = createRequire(import.meta.url);
const validVc = require('./validVc.json');

// copies a validVc and adds an id.
export const createRequestBody = ({issuer, vc = validVc}) => {
  const {settings: {id, options}} = issuer;
  const credential = klona(vc);
  // convert from millisecond to seconds precision
  credential.issuanceDate = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
  credential.id = `urn:uuid:${uuidv4()}`;
  credential.issuer = id;
  return {
    credential,
    options
  };
};
