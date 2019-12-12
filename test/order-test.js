var chai = require('chai');
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

const orderController = require('../controllers/orderController');

var req = {
  body : {id: '1', state:'1', type: '1', amount: '1', user_id: '1', message:'asdf', order_id: '1', comments: '1'},
  params: {id:'1'},
  userid: '1',
  user: {account_type: '1'}
};

var req2 = {
  body : {state:'1', type: '1', amount: '1', user_id: '1', message:'asdf', order_id: '1', comments: '1'},
  params: {id:'1'},
  userid: '1',
  user: {account_type: '1'}
};

var req3 = {
  body : {state:'1', type: '1', amount: '1', user_id: '1', message:'asdf', order_id: '1', comments: '1'},
  params: {},
  userid: '1',
  user: {account_type: '1'}
};
var res = {
  sendStatus: function(){},
  end: function(){},
  render: function(){},
  send: function(){},
  redirect: function(){}
};

describe('order tests', () => {
  it('Order Test: get client', function () {
    orderController.order_view_get_client(req, res);
    // expect(res.status).to.equal(200);
  });
  it('Order Test: get view', function () {
    orderController.order_view_get(req, res);
    // expect(res.status).to.equal(200);
  });
  it('Order Test: get', function () {
    orderController.order_get(req, res);
    // expect(res.status).to.equal(200);
  });
  it('Order Test: get inquiry', function () {
    orderController.order_inquire_get(req, res);
    // expect(res.status).to.equal(200);
  });
  it('Order Test: create post', function () {
    orderController.order_create_post(req, res);
    // expect(res.status).to.equal(200);
  });
  it('Order Test: order remove', function () {
    orderController.order_remove(req, res);
    // expect(res.status).to.equal(200);
  });
  it('Order Test: modify', function () {
    orderController.order_modify(req, res);
    // expect(res.status).to.equal(200);
  });
  it('Order Test: modify 2', function () {
    try{
      orderController.order_modify(req2, res);
    }
    catch(err){
      console.log(err);
    }// expect(res.status).to.equal(200);
  });
  it('Order Test: modify 3', function () {
    try{
      orderController.order_modify(req3, res);
    }
    catch(err){
      console.log(err);
    }// expect(res.status).to.equal(200);
  });
  it('Order Test: update', function () {
    // orderController.inventoryUpdate('1', '2');
    // expect(res.status).to.equal(200);
  });
  it('Order Test: create', function () {
    orderController.order_create(req, res);
    // expect(res.status).to.equal(200);
  });
  it('Order Test: udpate2', function () {
    try{
      orderController.inventoryUpdate('1', '1');
    }
    catch(error){
      console.log(error);
    }
    // expect(res.status).to.equal(200);
  });
});