/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import chai from 'chai';

const should = chai.should();

export function shouldThrowInvalidInput({result, error}) {
  should.not.exist(result, 'Expected no result from issuer.');
  should.exist(error, 'Expected issuer to Error.');
  should.exist(error.status, 'Expected an HTTP error response code.');
  error.status.should.not.equal(401,
    'Should not get an Authorization Error.');
  error.status.should.equal(400,
    'Expected status code 400 invalid input!');
}

export function shouldReturnResult({result, error}) {
  should.not.exist(error, `Expected no error, got ${error?.message}`);
  should.exist(result, 'Expected a result');
}

export function shouldBeIssuedVc({issuedVc}) {
  issuedVc.should.be.an(
    'object',
    'Expected the issued Verifiable Credential to be an object.'
  );
  issuedVc.should.have.property('@context');
  issuedVc.should.have.property('type');
  issuedVc.type.should.contain(
    'VerifiableCredential',
    'Expected `type` to contain "VerifiableCredential".'
  );
  issuedVc.should.have.property('id');
  issuedVc.id.should.be.a(
    'string',
    'Expected Vc id to be a string.'
  );
  issuedVc.should.have.property('credentialSubject');
  issuedVc.credentialSubject.should.be.an(
    'object',
    'Expected credentialSubject to be an object.'
  );
  issuedVc.should.have.property('issuer');
  const issuerType = typeof(issuedVc.issuer);
  issuerType.should.be.oneOf(
    ['string', 'object'],
    'Expected issuer to be a string or an object.'
  );
  issuedVc.should.have.property('proof');
  issuedVc.proof.should.be.an(
    'object',
    'Expected Vc proof to be an object.'
  );
  if(issuerType === 'object') {
    should.exist(issuedVc.issuer.id,
      'Expected issuer object to have property id');
  }
}
