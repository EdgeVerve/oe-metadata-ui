/**
 *
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 *
 */

module.exports = function (options) {
  return function (req, res, next) {
    req.skeleton = true;
    return next();
  };
};

