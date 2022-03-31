const chai = require('chai');

const should = chai.should();

function shouldThrowInvalidInput({result, error}) {
  should.not.exist(result, 'Expected no result from issuer.');
  should.exist(error, 'Expected issuer to Error.');
  should.exist(error.status, 'Expected an HTTP error response code.');
  error.status.should.not.equal(401,
    'Should not get an Authorization Error.');
  error.status.should.equal(400,
    'Expected status code 400 invalid input!');
}

module.exports = {
  shouldThrowInvalidInput
}
