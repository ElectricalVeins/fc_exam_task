module.exports = function (err, req, res, next) {
  if (!err.message || !err.code) {
    return res.status(500).send('Unknown Server Error');
  } else {
    return res.status(err.code).send(err.message);
  }
};
