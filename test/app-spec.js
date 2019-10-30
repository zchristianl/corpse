var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var expect = require('chai').expect;

chai.use(chaiHttp);

describe('test', () => {
  it('should return a string', () => {
    chai.expect('ci with travis').to.equal('ci with travis');
  });


});