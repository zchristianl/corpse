var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var expect = require('chai').expect;

chai.use(chaiHttp);

describe('inventory-tests', () => {

  var page_ = chai.request.agent(app);
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
        done();
      });

  });

  it('/inventory - Get Inventory Page', function (done) {
    this.timeout(0);
    page_
      .get('/inventory')
      .end(function (err, res) {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('/inventory - Create Inventory Entry no name', function (done) {
    var path = '/inventory/create';
    this.timeout(0);
    page_
      .post(path)
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        category: 'TestCat',
        type: 'product',
        description: 'TestDescr',
        cost: '1.00',
        price: '1.00',
        stock: '5'
      })
      .end(function (err, res) {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('/inventory - Create Inventory Entry', function (done) {
    var path = '/inventory/create';
    this.timeout(0);
    page_
      .post(path)
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        item_name: 'TestItem',
        category: 'TestCat',
        type: 'product',
        description: 'TestDescr',
        cost: '1.00',
        price: '1.00',
        stock: '5'
      })
      .end(function (err, res) {
        expect(res.status).to.equal(200);
        done();
      });
  });

  var lastInvItem = '';
  it('/inventory - Get last Inventory Entry', function (done) {
    var path = '/inventory';
    this.timeout(0);
    page_
      .get(path)
      .end(function (err, res) {
        var matchAllItems = /(?:form method="GET" action="\/inventory\/edit\/)(\d+)"/g;
        var matchedItems = res.text.match(matchAllItems);
        lastInvItem = matchedItems[matchedItems.length - 1].match(/\d+/g)[0];
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('/inventory - Get item by parameter id', function (done) {
    this.timeout(0);
    page_
      .get('/inventory/edit/' + lastInvItem)
      .end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(res.text.match(/TestItem/g).length > 0).to.equal(true);
        done();
      });
  });

  it('/inventory - Edit Inventory Entry', function (done) {
    var path = '/inventory/edit/';
    this.timeout(0);
    page_
      .post(path)
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        id: lastInvItem,
        item_name: 'TestItemEdited',
        category: 'TestCat',
        type: 'product',
        description: 'TestDescr',
        cost: '1.00',
        price: '1.00',
        stock: '5'
      })
      .end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(res.text.match(/TestItemEdited/g).length > 0).to.equal(true);
        done();
      });
  });

  it('/inventory - Remove Inventory Entry', function (done) {
    var path = '/inventory/delete/' + lastInvItem;
    this.timeout(0);
    page_
      .post(path)
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ id: lastInvItem })
      .end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(res.text.match(/TestItemEdited/g)).to.equal(null);
        done();
      });
  });

  it('/inventory - Get Edit Page no id', function (done) {
    this.timeout(0);
    page_
      .get('/inventory/edit')
      .end(function (err, res) {
        expect(res.status).to.equal(200);
        done();
      });
  });

});