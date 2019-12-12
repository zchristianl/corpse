var chai = require('chai');
var chaiHttp = require('chai-http');

const noteController = require('../controllers/noteController');
chai.use(chaiHttp);

var req = {
  body : {id: '1', user_id: '1', message:'asdf', order_id: '1'}
};

var res = {
  sendStatus: function(){},
  end: function(){}
};

describe('Note tests', () => {

  it('Note Test: remove', function () {
    noteController.note_remove(req, res);
    // expect(res.status).to.equal(200);
  });
  it('Note Test: create', function () {
    try{
      noteController.note_create(req, res);
    }
    catch(err){
      console.log(err);
    }
    // expect(res.status).to.equal(200);
  });
});