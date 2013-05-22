/**
 * connect-pause
 * Copyright(c) 2013 Ariel Flesler <aflesler@gmail.com>
 * MIT Licensed
 */

module.exports = function(delay) {
  delay = delay || 1000;

  return function(req, res, next){
    setTimeout(next, delay);
  };
};
