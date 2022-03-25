/*!
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
const {httpClient} = require('@digitalbazaar/http-client');
const {ZcapClient} = require('@digitalbazaar/ezcap');
const https = require('https');
const didKey = require('@digitalbazaar/did-method-key');
const {decodeSecretKeySeed} = require('bnid');
const {Ed25519Signature2020} = require('@digitalbazaar/ed25519-signature-2020');

const agent = new https.Agent({rejectUnauthorized: false});
const didKeyDriver = didKey.driver();

/**
 * Issues a VC from an endpoint.
 *
 * @param {object} options - Options to use.
 * @param {object} options.body - The body for the request.
 * @param {string} options.issuer - The issuer object.
 *
 * @returns {Promise<object>} Contains the result and error.
 */
const issue = async ({body, issuer}) => {
  if(issuer.zcap) {
    return _zcapClientRequest({
      ...issuer,
      json: body
    });
  }
  return _httpRequest({
    ...issuer,
    json: body,
  });
};

async function _httpRequest({endpoint, oauth2, json, headers = {}}) {
  let result;
  let error;
  try {
    result = await httpClient.post(
      endpoint,
      {
        json,
        agent,
        headers: {...headers}
      });
  } catch(e) {
    error = e;
  }
console.log({result, error});
  return {result, error};
}

const _getZcapClient = async ({secretKeySeed}) => {
  const seed = await decodeSecretKeySeed({secretKeySeed});
  const didKey = await didKeyDriver.generate({seed});
  const {didDocument: {capabilityInvocation}} = didKey;
  return new ZcapClient({
    SuiteClass: Ed25519Signature2020,
    invocationSigner: didKey.keyPairs.get(capabilityInvocation[0]).signer(),
    agent
  });
};

async function _zcapClientRequest({endpoint, zcap, json}) {
  let result;
  let error;
  let capability = zcap.capability;
  // we are storing the zcaps stringified right now
  if(typeof zcap.capability === 'string') {
    capability = JSON.parse(capability);
  }
  try {
    // assume that the clientSecret is set in the test environment
    const secretKeySeed = process.env[zcap.clientSecret];
    const zcapClient = await _getZcapClient({secretKeySeed});
    result = await zcapClient.write({
      url: endpoint,
      json,
      agent,
      capability
    });
  } catch(e) {
    error = e;
  }
console.log({result, error});
  return {result, error};
}

module.exports = {issue};
