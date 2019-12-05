var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var expect = require('chai').expect;

chai.use(chaiHttp);
describe('order tests', () => {

  var page_ = chai.request.agent(app);
  it('/orders POST test: login page data validation', function (done) {
    var path = '/users/login';
    page_
      .post(path)
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ email: 'duf@duf.com', password: 'duf' })
      .end(function (err, response) {
        expect(response.accepted).to.be.equal(false);
        expect(response.serverError).to.be.equal(false);
        expect(response.clientError).to.be.equal(false);
        expect(response.error).to.be.equal(false);
        done();
      });
  });

  // it('/orders - Create Invoice', function (done) {
  //   var path = '/order/create_invoice';
  //   this.timeout(0);
  //   page_
  //     .post(path)
  //     .set('content-type', 'application/x-www-form-urlencoded')
  //     .send({})
  //     .end(function (err, res) {
  //       console.log(res);
  //       expect(res.status).to.equal(200);
  //       done();
  //     });
  // });
});