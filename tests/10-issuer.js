const implementations = require('../implementations');
const validVC = require('./validVC.json');

for(const implementation of implementations) {
  describe(implementation.name, function() {
    it('Request body MUST have property "credential".', async function() {

    });
    it('credential MUST have property "@context"".', async function() {
      const credential = {...validVC};
      delete credential['@context'];
    });
    it('credential "@context" MUST be an array.', async function() {
      const credential = {...validVC};
    });
    it('credential "@context" items MUST be strings.', async function() {
      const credential = {...validVC};
    });
    it('credential MUST have property "@context"', async function() {
      const credential = {...validVC};
    });
    it('"credential.type" MUST be an array.', async function() {
      const credential = {...validVC};
    });
    it('credential MUST have property "type"', async function() {
      const credential = {...validVC};
    });
    it('"credential.type" items MUST be strings', async function() {
      const credential = {...validVC};
    });
    it('credential MUST have property "issuer"', async function() {
      const credential = {...validVC};
    });
    it('"credential.issuer" MAY be an object with property id', async function() {
      const credential = {...validVC};
    });
    it('"credential.issuer" MAY be a string', async function() {
      const credential = {...validVC};
    });
    it('"credential.issuer" MUST be either an object or a string', async function() {
      const credential = {...validVC};
    });
    it('credential MUST have property "credentialSubject"', async function() {
      const credential = {...validVC};
    });
    it('"credential.credentialSubject" MUST be an object', async function() {
      const credential = {...validVC};
    });
    it('credential MAY have property "issuanceDate"', async function() {
      const credential = {...validVC};
    });
    it('credential MAY have property "expirationDate"', async function() {
      const credential = {...validVC};
    });
  })
}


