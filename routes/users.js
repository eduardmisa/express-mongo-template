var express = require('express');
var router = express.Router();
var context = require('../context')


router.get('/',
 async function(req, res, next) {
  let result = await context.users.paginateRecord(req.query.pageNumber, req.query.pageSize)
  res.send(result)
})

router.get('/:slug',
 async function(req, res, next) {
  let result = await context.users.getRecord(req.params.slug)
  res.send(result)
})

router.post('/',
 async function(req, res, next) {
  let result = await context.users.addRecord(req.body)
  res.send(result)
})

router.put('/:slug',
 async function(req, res, next) {
  let result = await context.users.editRecord(req.params.slug, req.body)
  res.send(result)
})

router.delete('/:slug',
 async function(req, res, next) {
  let result = await context.users.deleteRecord(req.params.slug)
  res.send(result)
})

module.exports = router;
