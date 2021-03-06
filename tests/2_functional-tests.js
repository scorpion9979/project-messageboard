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
  this.timeout(15000);
  suite('API ROUTING FOR /api/threads/:board', function() {

    suite('POST', function() {
      test('POST thread', function(done) {
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
    });

    suite('GET', function() {
      test('GET thread', function(done) {
        chai.request(server)
          .get('/api/threads/test')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response isn\'t an array');
            assert.isAtMost(res.body.length, 10, 'response array isn\'t of length 10');
            res.body.forEach(thread => {
              assert.isString(thread.text, 'thread text isn\'t a string');
              assert.notProperty(thread, 'delete_password', 'delete_password shouldn\'t be sent');
              assert.isString(thread.created_on, 'created_on isn\'t a string');
              assert.isString(thread.bumped_on, 'bumped_on isn\'t a string');
              assert.notProperty(thread, 'reported', 'reported shouldn\'t be sent');
              assert.isArray(thread.replies, 'replies aren\'t an array');
              assert.isAtMost(thread.replies.length, 3, 'thread replies aren\'t of length 3');
            });
            done();
          });
      });
    });

    suite('PUT', function() {
      test('Valid _id', function(done) {
        chai.request(server)
          .put('/api/threads/test')
          .send({thread_id: 'test_thread_id'})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'success');
            done();
          });
      });
    });

  });

  suite('API ROUTING FOR /api/replies/:board', function() {

    suite('POST', function() {
      test('POST reply', function(done) {
        chai.request(server)
          .post('/api/replies/test')
          .send({_id: 'test_reply_id', thread_id: 'test_thread_id', text: 'test reply', delete_password: 'pass123'})
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
    });

    suite('GET', function() {
      test('GET reply', function(done) {
        chai.request(server)
          .get('/api/replies/test')
          .query({thread_id: 'test_thread_id'})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.body.text, 'thread text isn\'t a string');
            assert.notProperty(res.body, 'delete_password', 'delete_password shouldn\'t be sent for threads');
            assert.isString(res.body.created_on, 'created_on isn\'t a string');
            assert.isString(res.body.bumped_on, 'bumped_on isn\'t a string');
            assert.notProperty(res.body, 'reported', 'reported shouldn\'t be sent for threads');
            assert.isArray(res.body.replies, 'replies aren\'t an array');
            res.body.replies.forEach(reply => {
              assert.notProperty(reply, 'delete_password', 'delete_password shouldn\'t be sent for replies');
              assert.notProperty(reply, 'reported', 'reported shouldn\'t be sent for replies');
            });
            done();
          });
      });
    });

    suite('PUT', function() {
      test('Valid _id', function(done) {
        chai.request(server)
          .put('/api/replies/test')
          .send({thread_id: 'test_thread_id', reply_id: 'test_reply_id'})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'success');
            done();
          });
      });
    });

    suite('DELETE', function() {
      test('Invalid _id', function(done) {
        chai.request(server)
          .del('/api/replies/test')
          .send({thread_id: 'test_thread_id', reply_id: 'test_reply_id', delete_password: 'pass456'})
          .end(function(err, res) {
            assert.equal(res.status, 400);
            assert.equal(res.text, 'incorrect password');
            done();
          });
      });
      test('Valid _id', function(done) {
        chai.request(server)
          .del('/api/replies/test')
          .send({thread_id: 'test_thread_id', reply_id: 'test_reply_id', delete_password: 'pass123'})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'success');
            done();
          });
      });
    });

  });

  suite('DELETE TESTING FOR /api/threads/:board', function() {
    suite('DELETE', function() {
      test('Invalid _id', function(done) {
        chai.request(server)
          .del('/api/threads/test')
          .send({thread_id: 'test_thread_id', delete_password: 'wfef2'})
          .end(function(err, res) {
            assert.equal(res.status, 400);
            assert.equal(res.text, 'incorrect password');
            done();
          });
      });
      test('Valid _id', function(done) {
        chai.request(server)
          .del('/api/threads/test')
          .send({thread_id: 'test_thread_id', delete_password: 'password'})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'success');
            done();
          });
      });
    });
  });

});
