var chai = require('chai');
var chaiHttp = require('chai-http');

const createInvoice = require('../utils/createInvoice');
chai.use(chaiHttp);

var invoice = { shipping: 'ground', items: 'all', subtotal: 199, paid: 9, invoice_nr: 1 };
var order =   {id: 1, clientEmail: 'test@mail.com'}; 

describe('order tests', () => {
  it('InvoiceDownloadFunction test', function () {
    createInvoice.createInvoiceDownload(invoice, 'testFileName');
    // expect(res.status).to.equal(200);
  });

  it('InvoiceEmail test', function () {
    createInvoice.createInvoiceEmail(invoice, 'testFileName', order, undefined, undefined);
    // expect(res.status).to.equal(200);
  });
});
