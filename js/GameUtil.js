"use strict";

var GameUtil = {};

GameUtil.math = {};

GameUtil.math.getRandomArbitrary = function (min, max) {
    return Math.random() * (max - min) + min;
};