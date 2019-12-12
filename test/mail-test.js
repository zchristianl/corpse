var chai = require('chai');
var chaiHttp = require('chai-http');

const mail = require('../utils/mail');
chai.use(chaiHttp);

var itemVars = { orderId: '1' };
var order = { id: 1, clientEmail: 'test@mail.com' };

describe('order tests', () => {

  it('Mail Test: send contact', function () {
    mail.sendContact('test message', undefined, undefined);
    // expect(res.status).to.equal(200);
  });

  it('Mail Test: send order confirm', function () {
    mail.sendOrderConfrim('test@mail.com', order, itemVars);
    // expect(res.status).to.equal(200);
  });

  it('Mail Test: send invoice', function () {
    mail.sendInvoice(undefined, 'name_of_file', order, undefined, undefined);
    // expect(res.status).to.equal(200);
  });

  it('Mail Test: send password reset confirm', function () {

    mail.sendResetConfirm('test@mail.com');
    // expect(res.status).to.equal(200);
  });
});
