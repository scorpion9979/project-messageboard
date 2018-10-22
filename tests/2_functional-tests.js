/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {

    suite('POST', function() {
      chai.request(server)
          .post('/api/threads/test')
          .send({_id: 'test_thread_id', text: 'test test', delete_password: 'password'})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.body.text, 'thread text isn\'t a string');
            assert.isString(res.body.delete_password, 'delete_password isn\'t a string');
            assert.isString(res.body.created_on, 'created_on isn\'t a string');
            assert.isString(res.body.bumped_on, 'bumped_on isn\'t a string');
            assert.isBoolean(res.body.reported, 'reported isn\'t a boolean');
            assert.isArray(res.body.replies, 'replies aren\'t an array');
            assert.equal(res.body.text, 'test test', 'thread text mismatch');
            assert.equal(res.body.delete_password, 'password', 'delete password mismatch');
            assert.equal(res.body.created_on, res.body.bumped_on, 'created_on and bumped_on didn\'t start equal');
            assert.equal(res.body.reported, false, 'reported bool value mismatch');
            done();
          });
    });

    suite('GET', function() {

    });

    suite('DELETE', function() {

    });

    suite('PUT', function() {

    });

  });

  suite('API ROUTING FOR /api/replies/:board', function() {

    suite('POST', function() {
      chai.request(server)
          .post('/api/replies/test')
          .send({thread_id: 'test_thread_id', text: 'test reply', delete_password: 'pass123'})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.body.replies[0].text, 'reply text isn\'t a string');
            assert.isString(res.body.replies[0].delete_password, 'reply delete_password isn\'t a string');
            assert.isString(res.body.replies[0].created_on, 'reply created_on isn\'t a string');
            assert.isBoolean(res.body.replies[0].reported, 'reported isn\'t a boolean');
            assert.equal(res.body._id, 'test_thread_id', 'thread id mismatch');
            assert.notEqual(res.body.created_on, res.body.bumped_on, 'bumped_on didn\'t change');
            assert.equal(res.body.replies[0].text, 'test reply', 'reply text mismatch');
            assert.equal(res.body.replies[0].delete_password, 'pass123', 'reply delete_password mismatch');
            done();
          });
    });

    suite('GET', function() {

    });

    suite('PUT', function() {

    });

    suite('DELETE', function() {

    });

  });

});
