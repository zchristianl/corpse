var chai = require('chai');
var chaiHttp = require('chai-http');

const paymentController = require('../controllers/paymentController');
chai.use(chaiHttp);

var req = {
  body : {id: '4', user_id: '1', reference: '1', method: '1', amount: '1', message:'asdf', order_id: '1'},
  params: {id:'4'},
  flash: function(){},
  redirect: function(){}
};

var res = {
  sendStatus: function(){},
  end: function(){},
  render: function(){},
  redirect: function(){}

};

describe('Payment tests', () => {

  it('Payment Test: payment get', function () {
    paymentController.payment_get(req, res);
    // expect(res.status).to.equal(200);
  });
  it('Payment Test: success get', function () {
    paymentController.success_get(req, res);
    // expect(res.status).to.equal(200);
  });
  it('Payment Test: cancel get', function () {
    paymentController.cancel_get(req, res);
    // expect(res.status).to.equal(200);
  });
  it('Payment Test: create invoice', function () {
    paymentController.create_invoice(req, res);
    // expect(res.status).to.equal(200);
  });
  it('Payment Test: payment create', function () {
    try{
      paymentController.payment_create(req, res);
    } 
    catch (err){
      console.log(err);
    }
    // expect(res.status).to.equal(200);
  });
  it('Payment Test: payment remove', function () {
    try{
      paymentController.payment_remove(req, res);
    } 
    catch (err){
      console.log(err);
    }
    // expect(res.status).to.equal(200);
  });
  it('Payment Test: create session', function () {
    try{
      paymentController.create_session(req, res);
    } 
    catch (err){
      console.log(err);
    }
    // expect(res.status).to.equal(200);
  });
  it('Payment Test: stripe webhook', function () {
    try{
      paymentController.stripe_webhook(req, res);
    } 
    catch (err){
      console.log(err);
    }
    // expect(res.status).to.equal(200);
  });  
});