var express = require('express');
var router = express.Router();
var fooController = require('../controllers/foo');

router.get('/', fooController.get);
router.post('/', fooController.insert);
router.get('/:id', fooController.getById);
router.put('/:id', fooController.updateById);
router.delete('/:id', fooController.deleteById);

module.exports = router;
