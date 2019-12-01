var chai = require('chai');
var app = require('../app');
var expect = require('chai').expect;

describe('dashboard tests', () => {
  it('homepage view', function(done) {
    this.timeout(0);
    chai.request(app)
      .get('/')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
  });
});