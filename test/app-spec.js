var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var expect = require('chai').expect;
var userController = require('../controllers/userController.js');
const http = require('http');
var assert = require('assert');

chai.use(chaiHttp);

const options = {
  hostname: 'localhost',
  port: 3000,
  method: 'POST',
  headers:
  { host: 'localhost:3000',
    connection: 'keep-alive',
    'content-length': '38',
    'cache-control': 'max-age=0',
    origin: 'http://localhost:3000',
    'upgrade-insecure-requests': '1',
    'content-type': 'application/x-www-form-urlencoded',
    'user-agent':
     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36',
    'sec-fetch-user': '?1',
    accept:
     'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-mode': 'navigate',
    referer: 'http://localhost:3000/users/login',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.9',
    cookie:
     'connect.sid=s%3Ark_gfLq-zMP8kALONtk1-ly1Zn8Wju5J.RmmaVaHedy'
  }
};

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

  it('/user/login View Test', function(done) {
    this.timeout(0);
    chai.request(app)
      .get('/users/login')
      .end(function(err, res){        
        expect(res.text).to.have.string('Log in');
        expect(res.text).to.have.string('name=\"password\"');
        expect(res.text).to.have.string('type=\"password\"');
        expect(res.text).to.have.string('\"btn btn-primary\" type=\"submit\" value=\"Log in\"');
        done();
      });
  });

  it('/user/register GET', function(done) {
    this.timeout(0);
    chai.request(app)
      .get('/users/register')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('/user/register View Test', function(done) {
    this.timeout(0);
    chai.request(app)
      .get('/users/register')
      .end(function(err, res){
        expect(res.text).to.have.string('Register');
        expect(res.text).to.have.string('<input class=\"form-control\" name=\"first_name\" type=\"text\">');
        expect(res.text).to.have.string('<input class=\"form-control\" name=\"email\" type=\"text\"');
        expect(res.text).to.have.string('<input class=\"form-control\" name=\"password\" type=\"password\"');
        done();
      });
  });

  it('should send parameters to : /path POST', function(done) {
    var path = "/users/login";
    chai
     .request(app)
     .post(path)
    // .field('myparam' , 'test')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({Email: 'test_email@mail.com', Password: 'asdf'})
      .end(function(response) {
        expect(response.status).to.equal(200);
        done();
    });
  });

    it('should send parameters to : /path POST', function(done) {
    var path = "/users/login";
    chai
     .request(app)
     .post(path)
    // .field('myparam' , 'test')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({Email: 'test_email@mail.com', Password: 'asdf'})
      .end(function(response) {
        expect(response.accepted).to.be.equal(false);
        done();
    });
  });
});