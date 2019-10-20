var express = require('express');
var router = express.Router();
var context = require('../context')


router.get('/',
 function(req, res, next) {

  context.users.paginateRecord({
      pageNumber: req.query.pageNumber,
      pageSize: req.query.pageSize,
      callback: (result) => {
        res.send(result)
    }})
})

router.get('/:slug',
 function(req, res, next) {

  context.users.getRecord({
      recordId: req.params.slug,
      callback: (result) => {
        res.send(result)
      }
    })
})

router.post('/',
 function(req, res, next) {
  
  context.users.addRecord({
      record: req.body,
      callback: (result) => {
        res.send(result)
      }
    })
})

router.put('/:slug',
 function(req, res, next) {

  context.users.editRecord({
      recordId: req.params.slug,
      record: req.body,
      callback: (result) => {
        res.send(result)
      }
    })
})

router.delete('/:slug',
 function(req, res, next) {
  
  context.users.deleteRecord({
      recordId: req.params.slug,
      callback: (result) => {
        res.send(result)
      }
    })
})

module.exports = router;
