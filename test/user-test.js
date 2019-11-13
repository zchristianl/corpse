var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var expect = require('chai').expect;
// var userController = require('../controllers/userController.js');
// const http = require('http');
// var assert = require('assert');

chai.use(chaiHttp);

describe('user tests', () => {
  it('/user/login GET', function (done) {
    this.timeout(0);
    chai.request(app)
      .get('/users/login')
      .end(function (err, res) {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('/user/login View Test', function (done) {
    this.timeout(0);
    chai.request(app)
      .get('/users/login')
      .end(function (err, res) {
        expect(res.text).to.have.string('Login');
        expect(res.text).to.have.string('name=\"password\"');
        expect(res.text).to.have.string('type=\"password\"');
        expect(res.text).to.have.string('type="submit" value="Login"');
        done();
      });
  });

  it('/user/register GET', function (done) {
    this.timeout(0);
    chai.request(app)
      .get('/users/register')
      .end(function (err, res) {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('/user/register View Test', function (done) {
    this.timeout(0);
    chai.request(app)
      .get('/users/register')
      .end(function (err, res) {
        expect(res.text).to.have.string('<h1>Client Registration</h1>');
        expect(res.text).to.have.string('<input class="form-control" name="first_name" type="text" required="required" maxlength="25"');
        expect(res.text).to.have.string('<input class="form-control" name="email" type="email" required="required" maxlength="50"');
        expect(res.text).to.have.string('<input class="form-control" name="password" id="password" type="password" required="required"');
        done();
      });
  });

  it('/path POST test: login page connection', function (done) {
    var path = '/users/login';
    chai
      .request(app)
      .post(path)
      // .field('myparam' , 'test')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ email: 'test_email@mail.com', password: 'asdf' })
      .end(function (err, response) {
        console.log(response)
        expect(response.status).to.equal(200);
        done();
      });
  });

  var page_ = chai.request.agent(app)
  it('/path POST test: login page data validation', function (done) {
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
        page_.get('/users/portal')
          .end(function (err2, res2) {
            console.log(res2)
            done();
          });
      });

  });

  it('/path POST test: register page connection', function (done) {
    var path = '/users/register';
    chai
      .request(app)
      .post(path)
      // .field('myparam' , 'test')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ Email: 'test_email@mail.com', Password: 'asdf' })
      .end(function (err, response) {
        expect(response.status).to.equal(200);
        done();
      });
  });

  it('/path POST test: register page data validation', function (done) {
    var path = '/users/register';
    chai
      .request(app)
      .post(path)
      // .field('myparam' , 'test')
      //  .set('content-type', 'application/x-www-form-urlencoded')
      //  .send({Email: 'test_email@mail.com', Password: 'asdf'})
      .end(function (err, response) {
        expect(response.accepted).to.be.equal(false);
        expect(response.serverError).to.be.equal(false);
        expect(response.clientError).to.be.equal(false);
        expect(response.error).to.be.equal(false);
        done();
      });
  });
});