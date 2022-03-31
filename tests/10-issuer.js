/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */

const chai = require('chai');
const implementations = require('../implementations');
const validVC = require('./validVC.json');
const {Issuer} = require('./issuer');
const {shouldThrowInvalidInput} = require('./assertions');

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
    const issuer = new Issuer(implementation);
    describe(implementation.name, function() {
      it('Request body MUST have property "credential".', async function() {
        this.test.cell = {
          columnId: implementation.name,
          rowId: this.test.title
        };
        const body = {verifiableCredential: {...validVC}};
        const {result, error} = await issuer.issue({body});
        shouldThrowInvalidInput({result, error});
      });
      it('credential MUST have property "@context".', async function() {
        this.test.cell = {
          columnId: implementation.name,
          rowId: this.test.title
        };
        const credential = {...validVC};
        delete credential['@context'];
        const body = {credential};
        const {result, error} = await issuer.issue({body});
        shouldThrowInvalidInput({result, error});
      });
      it('credential "@context" MUST be an array.', async function() {
        this.test.cell = {
          columnId: implementation.name,
          rowId: this.test.title
        };
        const credential = {...validVC};
        credential['@context'] = 4;
        const body = {credential};
        const {result, error} = await issuer.issue({body});
        shouldThrowInvalidInput({result, error});
      });
      it('credential "@context" items MUST be strings.', async function() {
        this.test.cell = {
          columnId: implementation.name,
          rowId: this.test.title
        };
        const credential = {...validVC};
        credential['@context'] = [{foo: true}, 4, false, null];
        const body = {credential};
        const {result, error} = await issuer.issue({body});
        shouldThrowInvalidInput({result, error});
      });
      it('"credential.type" MUST be an array.', async function() {
        this.test.cell = {
          columnId: implementation.name,
          rowId: this.test.title
        };
        const credential = {...validVC};
        credential.type = 4;
        const body = {credential};
        const {result, error} = await issuer.issue({body});
        shouldThrowInvalidInput({result, error});
      });
      it('credential MUST have property "type"', async function() {
        this.test.cell = {
          columnId: implementation.name,
          rowId: this.test.title
        };
        const credential = {...validVC};
        delete credential.type;
        const body = {credential};
        const {result, error} = await issuer.issue({body});
        shouldThrowInvalidInput({result, error});
      });
      it('"credential.type" items MUST be strings', async function() {
        this.test.cell = {
          columnId: implementation.name,
          rowId: this.test.title
        };
        const credential = {...validVC};
        credential.type = [2, null, {foo: true}, false];
        const body = {credential};
        const {result, error} = await issuer.issue({body});
        shouldThrowInvalidInput({result, error});
      });
      it('credential MUST have property "issuer"', async function() {
        this.test.cell = {
          columnId: implementation.name,
          rowId: this.test.title
        };
        const credential = {...validVC};
        delete credential.issuer;
        const body = {credential};
        const {result, error} = await issuer.issue({body});
        should.exist(result, 'Expected result from issuer.');
        should.not.exist(error, 'Expected issuer to not Error.');
        should.exist(result.status, 'Ezxpected an HTTP status code.');
        result.status.should.equal(201, 'Expected response 201.');
        should.exist(result.data, 'Expected result to have data.');
        result.data.should.be.an('object');
        should.exist(result.data.verifiableCredential,
          'Expected verifiableCredential in response.');
        result.data.verifiableCredential.should.be.an(
          'object', 'Expected verifiableCredential to be an object.');
        should.exist(
          result.data.verifiableCredential.issuer,
          'Expected verifiableCredential to have property issuer.');
        const issuerType = typeof result.data.verifiableCredential.issuer;
        issuerType.should.be.oneOf(
          ['string', 'object'],
          'Expected issuer to be either a string or an object.');
        if(issuerType === 'object') {
          should.exist(
            result.data.verifiableCredential.issuer.id,
            'Expected issuer object to have property id');
        }
      });
      it('credential MUST have property "credentialSubject"', async function() {
        this.test.cell = {
          columnId: implementation.name,
          rowId: this.test.title
        };
        const credential = {...validVC};
        delete credential.credentialSubject;
        const body = {credential};
        const {result, error} = await issuer.issue({body});
        shouldThrowInvalidInput({result, error});
      });
      it('"credential.credentialSubject" MUST be an object', async function() {
        this.test.cell = {
          columnId: implementation.name,
          rowId: this.test.title
        };
        const credential = {...validVC};
        credential.credentialSubject = [null, true, 4];
        const body = {credential};
        const {result, error} = await issuer.issue({body});
        shouldThrowInvalidInput({result, error});
      });
      it('credential MAY have property "issuanceDate"', async function() {
        this.test.cell = {
          columnId: implementation.name,
          rowId: this.test.title
        };
        const credential = {...validVC};
        credential.issuanceDate = new Date().toISOString()
          .replace('.000Z', 'Z');
        const body = {credential};
        const {result, error} = await issuer.issue({body});
        should.exist(result, 'Expected result from issuer.');
        should.not.exist(error, 'Expected issuer to Error.');
        result.status.should.equal(201, 'Expected statusCode 201.');
      });
      it('credential MAY have property "expirationDate"', async function() {
        this.test.cell = {
          columnId: implementation.name,
          rowId: this.test.title
        };
        const credential = {...validVC};
        // expires in a year
        const oneYear = Date.now() + 365 * 24 * 60 * 60 * 1000;
        credential.expirationDate = new Date(oneYear).toISOString()
          .replace('.000Z', 'Z');
        const body = {credential};
        const {result, error} = await issuer.issue({body});
        should.exist(result, 'Expected result from issuer.');
        should.not.exist(error, 'Expected issuer to not Error.');
        result.status.should.equal(201, 'Expected statusCode 201.');
      });
    });
  }
});
