var chai = require('chai');
var app = require('../app');
// var expect = require('chai').expect;

describe('payment tests', () => {
  var page_ = chai.request.agent(app);
  it('/payment - Create Invoice', function (done) {
    var path = '/payment/create_invoice';
    this.timeout(0);
    page_
      .post(path)
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({})
      .end(function (err, res) {
        console.log(res);
        // expect(res.status).to.equal(200);
        done();
      });
  });
});