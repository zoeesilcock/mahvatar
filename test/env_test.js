var expect = require('chai').expect;
require('dotenv').load({ path: '.env.test' });

describe('env', function() {
  it('agrees that tests are awesome', function() {
    expect(process.env.TESTS).to.equal('awesome');
  });
});
