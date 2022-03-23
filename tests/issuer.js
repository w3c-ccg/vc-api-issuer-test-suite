const {httpClient} = require('@digitalbazaar/http-client');
const https = require('https');

const agent = new https.Agent({rejectUnauthorized: false});

/**
 * Issues a VC from an endpoint.
 *
 * @param {object} options - Options to use.
 * @param {object} options.body - The body for the request.
 * @param {object} [options.headers={}] - Headers for the request.
 * @param {string} options.endpoint - The issuer endpoint.
 *
 * @returns {Promise<object>} Contains the result and error.
 */
const issue = async ({body, headers = {}, endpoint}) => {
  let result;
  let error;
  try {
    result = await httpClient.post(
      endpoint,
      {
        json: body,
        agent,
        headers: {...headers}
      });
  } catch(e) {
    error = e;
  }
console.log({result, error});
  return {result, error};
}

module.exports = {issue};
