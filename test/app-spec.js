const expect = require('chai').expect;

describe('test', () => {
  it('should return a string', () => {
    expect('ci with travis').to.equal('ci with travis');
  });
});

var User, app, request, server, should, user, agent;

should   = require("should");
app      = require("../server");
user     = model("user");
request  = require("supertest");
agent = request.agent(app);

describe('User', function () {
  before(function(done) {
      user = new user({
        email    : "user@user.com",
        first_name: "Full Name",
        last_name : "Last Name",
        password : "pass11",
        account_type : "account_type",
        phone: "phone_number",
        fax: "fax number"
      });
      user.save(done)
    });
  describe('Login test', function () {
      it('should redirect to /', function (done) {
        agent
        .post('/users/session')
        .field('email', 'user@user.com')
        .field('password', 'pass11')
        .expect('Location','/')
        .end(done)
      })

  after(function(done) {
      User.remove().exec();
      return done();
    });

})
})