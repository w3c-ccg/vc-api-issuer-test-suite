const implementations = require('../implementations');
const validVC = require('./validVC.json');
const {issue} = require('issuer');

for(const implementation of implementations) {
  describe(implementation.name, function() {
    it('Request body MUST have property "credential".', async function() {
      const body = {verifiableCredential: {...validVC}};
      const {result, error} = await implementation.issue({body});
      should.not.exist(result);
      should.exist(error);
    });
    it('credential MUST have property "@context"".', async function() {
      const credential = {...validVC};
      delete credential['@context'];
      const body = {credential}
    });
    it('credential "@context" MUST be an array.', async function() {
      const credential = {...validVC};
      credential['@context'] = 4;
      const body = {credential}
    });
    it('credential "@context" items MUST be strings.', async function() {
      const credential = {...validVC};
      credential['@context'] = [{foo: true}, 4, false, null];
      const body = {credential}
    });
    it('"credential.type" MUST be an array.', async function() {
      const credential = {...validVC};
      credential.type = 4;
      const body = {credential};
    });
    it('credential MUST have property "type"', async function() {
      const credential = {...validVC};
      delete credential.type;
      const body = {credential};
    });
    it('"credential.type" items MUST be strings', async function() {
      const credential = {...validVC};
      credential.type = [2, null, {foo: true}, false];
      const body = {credential};
    });
    it('credential MUST have property "issuer"', async function() {
      const credential = {...validVC};
      delete credential.issuer;
      const body = {credential};
    });
    //FIXME this test might need an issuer that implementation specific
    it('"credential.issuer" MAY be an object with property id', async function() {
      const credential = {...validVC};
      credential.issuer = {id: 'foo'};
      const body = {credential};
    });
    //FIXME this test might need an issuer that implementation specific
    it('"credential.issuer" MAY be a string', async function() {
      const credential = {...validVC};
      credential.issuer = 'foo';
      const body = {credential};
    });
    it('"credential.issuer" MUST be either an object or a string', async function() {
      const credential = {...validVC};
      credential.issuer = 4;
      const body = {credential};
    });
    it('credential MUST have property "credentialSubject"', async function() {
      const credential = {...validVC};
      delete credential.credentialSubject;
      const body = {credential};
    });
    it('"credential.credentialSubject" MUST be an object', async function() {
      const credential = {...validVC};
      credential.credentialSubject = [null, true, 4];
      const body = {credential};
    });
    it('credential MAY have property "issuanceDate"', async function() {
      const credential = {...validVC};
      credential.issuanceDate = new Date().toISOString().replace('.000Z', 'Z');
      const body = {credential};
    });
    it('credential MAY have property "expirationDate"', async function() {
      const credential = {...validVC};
      // expires in a year
      credential.expirationDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      const body = {credential};
    });
  })
}


