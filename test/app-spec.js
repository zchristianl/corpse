var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var expect = require('chai').expect;

chai.use(chaiHttp);

describe('test', () => {
  it('should return a string', () => {
    chai.expect('ci with travis').to.equal('ci with travis');
  });
  
  it('/user/login GET', function(done) {
    this.timeout(0);
    chai.request(app)
      .get('/users/login')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
  });
});