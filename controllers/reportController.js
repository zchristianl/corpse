const models = require('../config/database');
// eslint-disable-next-line no-unused-vars
const logger = require('../utils/logger');
const opres = (o) => {

  let oarr = [
    [models.Op.eq], [models.Op.ne], [models.Op.gt], [models.Op.lt], [models.Op.gte], [models.Op.lte], [models.Op.like], [models.Op.notLike]
  ];
  return o > oarr.length ? null : oarr[o];

};

const opgrp = (o1, o2) => {
  /*
    * object structure
    *  field obj/objarray
    *  next, operator
    * */
  let ret = {};
  ret[o1.field] = {};
  ret[o1.field][o1.next] = [o1.field, o2.field];
  ret.next = o2.next;
};

exports.report_get = (req, res) => {
  res.render('NO_EXIST');
};

exports.report_post = (req, res) => {
  //Authorize
  let csearch = req.body.csearch;

  //object structure
  /*
    *   operator, =,≠,<,>,≤,≥,like,notlike
    *   field, (table row)
    *   transition: AND, OR, END
    * */
  let qobs = [];
  let pos = 0;
  let made = [];

  csearch.forEach((o) => {
    let nobj = {};
    let infobj = opres(o.operator);
    nobj.operator = infobj.opr;
    nobj.pos = pos;
    nobj.field = o.field;
    pos++;
    qobs.push(nobj);
  });

  qobs.foreach((o) => {
    let tobj = {};
    tobj.field = {};
    tobj.field[o.operator] = o.field;
    made.push(tobj);
  });

  for (let i = 0; i < made.length - 1; i++) {
    if (made.length < 2) continue;
    made[i + 1] = opgrp(made[i], made[i + 1]);
  }

  let condobj = made[made.length - 1];
  let robj = {};

  models.Orders.findAll().then((r) => { robj = r; });
  robj.findAll({ where: { condobj } }).then((fobj) => { res.render('NO_EXIST', { orders: fobj }); });

};