const expect = require('chai').expect;
var express = require('express');
var app = express();

describe('Basic Test', () => {
  it('should return a string', () => {
    expect('ci with travis').to.equal('ci with travis');
  });
});

describe('User module', () => {
  beforeEach(() => {
    app.set('views', 'login');
    app.set('view engine', 'ext');
    app.engine('ext', (path, options, callback) => {
      const details = Object.assign({ path, }, options);
      callback(null, JSON.stringify(details));
    });
  });
  it('Login Test', async () => {
    const res = await app.get('/login').type('text/html');
  
    // This will have your response as json
    expect(res.text).to.equal('Sign In');
  });
});