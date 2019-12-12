var chai = require('chai');
var chaiHttp = require('chai-http');

const itemController = require('../controllers/itemController');
chai.use(chaiHttp);

var req = {
  body : {id: '1', user_id: '1', message:'asdf', order_id: '1'},
  params: {id:'1'}
};

var res = {
  sendStatus: function(){},
  end: function(){}
};

describe('Item tests', () => {

  it('Item Test: remove', function () {
    itemController.item_get(req, res);
    // expect(res.status).to.equal(200);
  });
  it('Item Test: remove', function () {
    try{
      itemController.item_create(req, res);
    } 
    catch(error){
      console.log(error);
    }
    // expect(res.status).to.equal(200);
  });
  it('Item Test: remove', function () {
    itemController.item_remove(req, res);
    // expect(res.status).to.equal(200);
  });
  it('Item Test: remove', function () {
    try {
      itemController.item_modify(req, res);
    }
    catch(err)
    {
      //console.log(err);
    }
    // expect(res.status).to.equal(200);
  });
});