const chai = require('chai');
const implementations = require('../implementations');
const validVC = require('./validVC.json');
const {issue} = require('./issuer');

const should = chai.should();

describe('Verifiable Credentials Issuer API', function() {
  const summaries = new Set();
  this.summary = summaries;
  // column names for the matrix go here
  const columnNames = [];
  const reportData = [];
  // this will tell the report
  // to make an interop matrix with this suite
  this.matrix = true;
  this.report = true;
  this.columns = columnNames;
  this.rowLabel = 'Test Name';
  this.columnLabel = 'Issuer';
  // the reportData will be displayed under the test title
  this.reportData = reportData;
  for(const implementation of implementations) {
    columnNames.push(implementation.name);
    describe(implementation.name, function() {
      const {issuer} = implementation;
      it('Request body MUST have property "credential".', async function() {
        this.test.cell = {columnId: implementation.name, rowId: this.test.title};
        const body = {verifiableCredential: {...validVC}};
        const {result, error} = await issue({body, issuer});
        should.not.exist(result, 'Expected no result from issuer.');
        should.exist(error, 'Expected issuer to Error');
      });
      it('credential MUST have property "@context"".', async function() {
        this.test.cell = {columnId: implementation.name, rowId: this.test.title};
        const credential = {...validVC};
        delete credential['@context'];
        const body = {credential};
        const {result, error} = await issue({body, issuer});
        should.not.exist(result, 'Expected no result from issuer.');
        should.exist(error, 'Expected issuer to Error.');
      });
      it('credential "@context" MUST be an array.', async function() {
        this.test.cell = {columnId: implementation.name, rowId: this.test.title};
        const credential = {...validVC};
        credential['@context'] = 4;
        const body = {credential}
        const {result, error} = await issue({body, issuer});
        should.not.exist(result, 'Expected no result from issuer.');
        should.exist(error, 'Expected issuer to Error.');
      });
      it('credential "@context" items MUST be strings.', async function() {
        this.test.cell = {columnId: implementation.name, rowId: this.test.title};
        const credential = {...validVC};
        credential['@context'] = [{foo: true}, 4, false, null];
        const body = {credential};
        const {result, error} = await issue({body, issuer});
        should.not.exist(result, 'Expected no result from issuer.');
        should.exist(error, 'Expected issuer to Error.');
      });
      it('"credential.type" MUST be an array.', async function() {
        this.test.cell = {columnId: implementation.name, rowId: this.test.title};
        const credential = {...validVC};
        credential.type = 4;
        const body = {credential};
        const {result, error} = await issue({body, issuer});
        should.not.exist(result, 'Expected no result from issuer.');
        should.exist(error, 'Expected issuer to Error.');
      });
      it('credential MUST have property "type"', async function() {
        this.test.cell = {columnId: implementation.name, rowId: this.test.title};
        const credential = {...validVC};
        delete credential.type;
        const body = {credential};
        const {result, error} = await issue({body, issuer});
        should.not.exist(result, 'Expected no result from issuer.');
        should.exist(error, 'Expected issuer to Error.');
      });
      it('"credential.type" items MUST be strings', async function() {
        this.test.cell = {columnId: implementation.name, rowId: this.test.title};
        const credential = {...validVC};
        credential.type = [2, null, {foo: true}, false];
        const body = {credential};
        const {result, error} = await issue({body, issuer});
        should.not.exist(result, 'Expected no result from issuer.');
        should.exist(error, 'Expected issuer to Error.');
      });
      //FIXME this might be added by the issuer
      it('credential MUST have property "issuer"', async function() {
        this.test.cell = {columnId: implementation.name, rowId: this.test.title};
        const credential = {...validVC};
        delete credential.issuer;
        const body = {credential};
        const {result, error} = await issue({body, issuer});
        should.not.exist(result, 'Expected no result from issuer.');
        should.exist(error, 'Expected issuer to Error.');
      });
      //FIXME this test might need an issuer that is implementation specific
      it('"credential.issuer" MAY be an object with property id', async function() {
        this.test.cell = {columnId: implementation.name, rowId: this.test.title};
        const credential = {...validVC};
        credential.issuer = {id: 'foo'};
        const body = {credential};
        const {result, error} = await issue({body, issuer});
        should.exist(result, 'Expected result from issuer.');
        should.not.exist(error, 'Expected issuer to not Error.');

      });
      //FIXME this test might need an issuer that is implementation specific
      it('"credential.issuer" MAY be a string', async function() {
        this.test.cell = {columnId: implementation.name, rowId: this.test.title};
        const credential = {...validVC};
        credential.issuer = 'foo';
        const body = {credential};
        const {result, error} = await issue({body, issuer});
        should.exist(result, 'Expected result from issuer.');
        should.not.exist(error, 'Expected issuer to not Error.');
      });
      it('"credential.issuer" MUST be either an object or a string', async function() {
        this.test.cell = {columnId: implementation.name, rowId: this.test.title};
        const credential = {...validVC};
        credential.issuer = 4;
        const body = {credential};
        const {result, error} = await issue({body, issuer});
        should.not.exist(result, 'Expected no result from issuer.');
        should.exist(error, 'Expected issuer to Error.');
      });
      it('credential MUST have property "credentialSubject"', async function() {
        this.test.cell = {columnId: implementation.name, rowId: this.test.title};
        const credential = {...validVC};
        delete credential.credentialSubject;
        const body = {credential};
        const {result, error} = await issue({body, issuer});
        should.not.exist(result, 'Expected no result from issuer.');
        should.exist(error, 'Expected issuer to Error.');
      });
      it('"credential.credentialSubject" MUST be an object', async function() {
        this.test.cell = {columnId: implementation.name, rowId: this.test.title};
        const credential = {...validVC};
        credential.credentialSubject = [null, true, 4];
        const body = {credential};
        const {result, error} = await issue({body, issuer});
        should.not.exist(result, 'Expected no result from issuer.');
        should.exist(error, 'Expected issuer to Error.');
      });
      it('credential MAY have property "issuanceDate"', async function() {
        this.test.cell = {columnId: implementation.name, rowId: this.test.title};
        const credential = {...validVC};
        credential.issuanceDate = new Date().toISOString().replace('.000Z', 'Z');
        const body = {credential};
        const {result, error} = await issue({body, issuer});
        should.exist(result, 'Expected result from issuer.');
        should.not.exist(error, 'Expected issuer to Error.');
      });
      it('credential MAY have property "expirationDate"', async function() {
        this.test.cell = {columnId: implementation.name, rowId: this.test.title};
        const credential = {...validVC};
        // expires in a year
        credential.expirationDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        const body = {credential};
        const {result, error} = await issue({body, issuer});
        should.exist(result, 'Expected result from issuer.');
        should.not.exist(error, 'Expected issuer to not Error.');
      });
    })
  }
})


