var express = require('express');
var router = express.Router();
var barController = require('../controllers/bar');

router.get('/', barController.get);
router.post('/', barController.insert);
router.get('/:id', barController.getById);
router.put('/:id', barController.updateById);
router.delete('/:id', barController.deleteById);

module.exports = router;
