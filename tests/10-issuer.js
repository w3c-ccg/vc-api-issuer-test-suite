/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import {
  createISOTimeStamp,
  createRequestBody,
  invalidContextTypes
} from './mock.data.js';
import {
  shouldBeIssuedVc,
  shouldReturnResult,
  shouldThrowInvalidInput
} from './assertions.js';
import chai from 'chai';
import {filterByTag} from 'vc-api-test-suite-implementations';

const should = chai.should();
const tag = 'vc-api';
const {match, nonMatch} = filterByTag({property: 'issuers', tags: [tag]});

describe('Issue Credential - Data Integrity', function() {
  const summaries = new Set();
  this.summary = summaries;
  const reportData = [];
  // this will tell the report
  // to make an interop matrix with this suite
  this.matrix = true;
  this.report = true;
  this.implemented = [...match.keys()];
  this.notImplemented = [...nonMatch.keys()];
  this.rowLabel = 'Test Name';
  this.columnLabel = 'Issuer';
  // the reportData will be displayed under the test title
  this.reportData = reportData;
  for(const [name, implementation] of match) {
    const issuer = implementation.issuers.find(
      issuer => issuer.tags.has(tag));
    describe(name, function() {
      it('MUST successfully issue a credential.', async function() {
        this.test.cell = {
          columnId: name,
          rowId: this.test.title
        };
        const body = createRequestBody({issuer});
        const {result, data: issuedVc, error} = await issuer.post({json: body});
        shouldReturnResult({result, error});
        should.exist(issuedVc, 'Expected result to have data.');
        result.status.should.equal(201, 'Expected statusCode 201.');
        shouldBeIssuedVc({issuedVc});
      });
      it('Request body MUST have property "credential".', async function() {
        this.test.cell = {
          columnId: name,
          rowId: this.test.title
        };
        const body = createRequestBody({issuer});
        body.verifiableCredential = {...body.credential};
        delete body.credential;
        const {result, error} = await issuer.post({json: body});
        shouldThrowInvalidInput({result, error});
      });
      it('credential MUST have property "@context".', async function() {
        this.test.cell = {
          columnId: name,
          rowId: this.test.title
        };
        const body = createRequestBody({issuer});
        delete body.credential['@context'];
        const {result, error} = await issuer.post({json: body});
        shouldThrowInvalidInput({result, error});
      });
      it('credential "@context" MUST be an array.', async function() {
        this.test.cell = {
          columnId: name,
          rowId: this.test.title
        };
        const body = createRequestBody({issuer});
        body.credential['@context'] = 4;
        const {result, error} = await issuer.post({json: body});
        shouldThrowInvalidInput({result, error});
      });
      it('credential "@context" first item MUST be credentials context URI.',
        async function() {
          this.test.cell = {
            columnId: name,
            rowId: this.test.title
          };
          const body = createRequestBody({issuer});
          body.credential['@context'] = [
            'https://www.w3.org/2018/credentials/examples/v1',
            'https://www.w3.org/2018/credentials/v1'
          ];
          const {result, error} = await issuer.post({json: body});
          shouldThrowInvalidInput({result, error});
        });
      it('credential "@context" subsequent items MAY be context objects.',
        async function() {
          this.test.cell = {
            columnId: name,
            rowId: this.test.title
          };
          const body = createRequestBody({issuer});
          body.credential['@context'] = [
            'https://www.w3.org/2018/credentials/v1',
            {
              '@context': {
                id: '@id',
                type: '@type',
                vcTestContext: 'https://w3id.org/vc-test-context#',
              }
            }
          ];
          const {
            result,
            data: issuedVc,
            error
          } = await issuer.post({json: body});
          shouldReturnResult({result, error});
          should.exist(issuedVc, 'Expected result to have data.');
          result.status.should.equal(201, 'Expected statusCode 201.');
          shouldBeIssuedVc({issuedVc});
        });
      for(const [title, invalidContext] of invalidContextTypes) {
        it(`credential "@context" items MUST NOT be ${title}.`,
          async function() {
            this.test.cell = {
              columnId: name,
              rowId: this.test.title
            };
            const body = createRequestBody({issuer});
            body.credential['@context'] = invalidContext;
            const {result, error} = await issuer.post({json: {...body}});
            shouldThrowInvalidInput({result, error});
          });
      }
      it('credential MUST have property "type"', async function() {
        this.test.cell = {
          columnId: name,
          rowId: this.test.title
        };
        const body = createRequestBody({issuer});
        delete body.credential.type;
        const {result, error} = await issuer.post({json: body});
        shouldThrowInvalidInput({result, error});
      });
      it('"credential.type" MUST be an array.', async function() {
        this.test.cell = {
          columnId: name,
          rowId: this.test.title
        };
        const body = createRequestBody({issuer});
        body.credential.type = 4;
        const {result, error} = await issuer.post({json: body});
        shouldThrowInvalidInput({result, error});
      });
      it('"credential.type" items MUST be strings', async function() {
        this.test.cell = {
          columnId: name,
          rowId: this.test.title
        };
        const body = createRequestBody({issuer});
        const invalidCredentialTypes = [null, true, 4, []];
        for(const invalidCredentialType of invalidCredentialTypes) {
          body.credential.type = invalidCredentialType;
          const {result, error} = await issuer.post({json: {...body}});
          shouldThrowInvalidInput({result, error});
        }
      });
      it('credential MUST have property "issuer"', async function() {
        this.test.cell = {
          columnId: name,
          rowId: this.test.title
        };
        const body = createRequestBody({issuer});
        delete body.credential.issuer;
        const {result, error} = await issuer.post({json: body});
        shouldThrowInvalidInput({result, error});
      });
      it('"credential.issuer" MUST be a string or an object', async function() {
        this.test.cell = {
          columnId: name,
          rowId: this.test.title
        };
        const body = createRequestBody({issuer});
        const invalidIssuerTypes = [null, true, 4, []];
        for(const invalidIssuerType of invalidIssuerTypes) {
          body.credential.issuer = invalidIssuerType;
          const {result, error} = await issuer.post({json: {...body}});
          shouldThrowInvalidInput({result, error});
        }
      });
      it('credential MUST have property "credentialSubject"', async function() {
        this.test.cell = {
          columnId: name,
          rowId: this.test.title
        };
        const body = createRequestBody({issuer});
        delete body.credential.credentialSubject;
        const {result, error} = await issuer.post({json: body});
        shouldThrowInvalidInput({result, error});
      });
      it('"credential.credentialSubject" MUST be an object', async function() {
        this.test.cell = {
          columnId: name,
          rowId: this.test.title
        };
        const body = createRequestBody({issuer});
        const invalidCredentialSubjectTypes =
          [null, true, 4, [], 'did:example:1234'];
        for(const invalidCredentialSubjectType of
          invalidCredentialSubjectTypes) {
          body.credential.credentialSubject = invalidCredentialSubjectType;
          const {result, error} = await issuer.post({json: {...body}});
          shouldThrowInvalidInput({result, error});
        }
      });
      // this test is probably redudant as the vc-data-model spec
      // requires issuanceDate
      it.skip('credential MAY have property "issuanceDate"', async function() {
        this.test.cell = {
          columnId: name,
          rowId: this.test.title
        };
        const body = createRequestBody({issuer});
        const {result, error} = await issuer.post({json: body});
        shouldReturnResult({result, error});
        result.status.should.equal(201, 'Expected statusCode 201.');
      });
      it('credential MAY have property "expirationDate"', async function() {
        this.test.cell = {
          columnId: name,
          rowId: this.test.title
        };
        const body = createRequestBody({issuer});
        // expires in a year
        const oneYearLater = Date.now() + 365 * 24 * 60 * 60 * 1000;
        body.credential.expirationDate = createISOTimeStamp(oneYearLater);
        const {result, error} = await issuer.post({json: body});
        shouldReturnResult({result, error});
        result.status.should.equal(201, 'Expected statusCode 201.');
      });
    });
  }
});
