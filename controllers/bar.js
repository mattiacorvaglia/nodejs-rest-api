var ObjectID = require('mongodb').ObjectID;
var createError = require('http-errors');

// ----------------------------------------------------------------------------
// Get all
exports.get = function(req, res, next) {
  const db = req.app.locals.db;
  db.collection('bar').find().toArray((err, data) => {
    if (err) return next(createError(400, 'Error querying database'));
    res.json(data);
  });
};

// ----------------------------------------------------------------------------
// Get By ID
exports.getById = function(req, res, next) {
  const db = req.app.locals.db;
  db.collection('bar').findOne({ '_id': new ObjectID(req.params.id) }, (err, data) => {
    if (err) return next(createError(400, 'Error querying database'));
    if (!data) return next(createError(404, 'No records found'));
    res.json(data);
  });
};

// ----------------------------------------------------------------------------
// Insert
exports.insert = function(req, res, next) {
  const db = req.app.locals.db;
  db.collection('bar').insertOne(req.body, (err, data) => {
    if (err) return next(createError(400, 'Error querying database'));
    if (data.insertedCount != 1) return next(createError(400, 'No records inserted'));
    res.json(data.ops[0]);
  });
}

// ----------------------------------------------------------------------------
// Update by ID
exports.updateById = function(req, res, next) {
  const db = req.app.locals.db;
  db.collection('bar').updateOne({ '_id': new ObjectID(req.params.id) },
  { $set: req.body },
  (err, data) => {
    if (err) return next(createError(400, 'Error querying database'));
    if (data.modifiedCount != 1) return next(createError(400, 'No records updated'));
    res.json({ updated: true });
  });
}

// ----------------------------------------------------------------------------
// Delete by ID
exports.deleteById = function(req, res, next) {
  const db = req.app.locals.db;
  db.collection('bar').deleteOne({ '_id': new ObjectID(req.params.id) },
  (err, data) => {
    if (err) return next(createError(400, 'Error querying database'));
    if (data.deletedCount != 1) return next(createError(400, 'No records deleted'));
    res.json({ deleted: true });
  });
}