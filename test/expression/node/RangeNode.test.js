// test RangeNode
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    math = require('../../../index'),
    Node = require('../../../lib/expression/node/Node'),
    ConstantNode = require('../../../lib/expression/node/ConstantNode'),
    SymbolNode = require('../../../lib/expression/node/SymbolNode'),
    RangeNode = require('../../../lib/expression/node/RangeNode');

describe('RangeNode', function() {

  it ('should create a RangeNode', function () {
    var start = new ConstantNode(0);
    var end = new ConstantNode(10);
    var n = new RangeNode([start, end]);
    assert(n instanceof RangeNode);
    assert(n instanceof Node);
    assert.equal(n.type, 'RangeNode');
  });

  it ('should throw an error when calling without new operator', function () {
    var start = new ConstantNode(0);
    var end = new ConstantNode(10);
    assert.throws(function () {RangeNode([start, end])}, SyntaxError);
  });

  it ('should throw an error creating a RangeNode with wrong number or type of arguments', function () {
    var start = new ConstantNode(0);
    var end = new ConstantNode(10);

    assert.throws(function () { new RangeNode(); }, TypeError);
    assert.throws(function () { new RangeNode(start, end); }, TypeError);
    assert.throws(function () { new RangeNode([]); }, TypeError);
    assert.throws(function () { new RangeNode([start, end, start, end]); }, TypeError);
    assert.throws(function () { new RangeNode([0, 10]); }, TypeError);
  });

  it ('should compile a RangeNode', function () {
    var start = new ConstantNode(0);
    var end = new ConstantNode(10);
    var step = new ConstantNode(2);
    var n = new RangeNode([start, end, step]);

    var expr = n.compile(math);
    assert.deepEqual(expr.eval(), math.matrix([0, 2, 4, 6, 8, 10]));
  });

  it ('should filter a RangeNode', function () {
    var start = new ConstantNode(0);
    var end = new ConstantNode(10);
    var step = new ConstantNode(2);
    var n = new RangeNode([start, end, step]);

    assert.deepEqual(n.filter(function (node) {return node instanceof RangeNode}),  [n]);
    assert.deepEqual(n.filter(function (node) {return node instanceof SymbolNode}),  []);
    assert.deepEqual(n.filter(function (node) {return node instanceof ConstantNode}),  [start, step, end]);
    assert.deepEqual(n.filter(function (node) {return node instanceof ConstantNode && node.value == '2'}),  [step]);
    assert.deepEqual(n.filter(function (node) {return node instanceof ConstantNode && node.value == '4'}),  []);
  });

  it ('should transform a RangeNodes start', function () {
    var start = new ConstantNode(0);
    var end = new ConstantNode(10);
    var step = new ConstantNode(2);
    var n = new RangeNode([start, end, step]);

    var e = new ConstantNode(3);
    var f = n.transform(function (node) {
      return node instanceof ConstantNode && node.value == '0' ? e : node;
    });

    assert.notStrictEqual(f, n);
    assert.deepEqual(f.start,  e);
    assert.deepEqual(f.end,  end);
    assert.deepEqual(f.step,  step);
  });

  it ('should transform a RangeNodes end', function () {
    var start = new ConstantNode(0);
    var end = new ConstantNode(10);
    var step = new ConstantNode(2);
    var n = new RangeNode([start, end, step]);

    var e = new ConstantNode(3);
    var f = n.transform(function (node) {
      return node instanceof ConstantNode && node.value == '10' ? e : node;
    });

    assert.notStrictEqual(f, n);
    assert.deepEqual(f.start,  start);
    assert.deepEqual(f.end,  e);
    assert.deepEqual(f.step,  step);
  });

  it ('should transform a RangeNodes step', function () {
    var start = new ConstantNode(0);
    var end = new ConstantNode(10);
    var step = new ConstantNode(2);
    var n = new RangeNode([start, end, step]);

    var e = new ConstantNode(3);
    var f = n.transform(function (node) {
      return node instanceof ConstantNode && node.value == '2' ? e : node;
    });

    assert.notStrictEqual(f, n);
    assert.deepEqual(f.start, start);
    assert.deepEqual(f.end, end);
    assert.deepEqual(f.step, e);
  });

  it ('should transform a RangeNodes without step', function () {
    var start = new ConstantNode(0);
    var end = new ConstantNode(10);
    var n = new RangeNode([start, end]);

    var e = new ConstantNode(3);
    var f = n.transform(function (node) {
      return node instanceof ConstantNode && node.value == '10' ? e : node;
    });

    assert.notStrictEqual(f, n);
    assert.deepEqual(f.start, start);
    assert.deepEqual(f.end, e);
  });

  it ('should transform a RangeNode itself', function () {
    var start = new ConstantNode(0);
    var end = new ConstantNode(10);
    var step = new ConstantNode(2);
    var n = new RangeNode([start, end, step]);

    var e = new ConstantNode(5);
    var f = n.transform(function (node) {
      return node instanceof RangeNode ? e : node;
    });

    assert.strictEqual(f, e);
  });

  it ('should stringify a RangeNode without step', function () {
    var start = new ConstantNode(0);
    var end = new ConstantNode(10);
    var n = new RangeNode([start, end]);

    assert.equal(n.toString(), '0:10');
  });

  it ('should stringify a RangeNode with step', function () {
    var start = new ConstantNode(0);
    var end = new ConstantNode(10);
    var step = new ConstantNode(2);
    var n = new RangeNode([start, end, step]);

    assert.equal(n.toString(), '0:2:10');
  });

  it ('should LaTeX a RangeNode without step', function () {
    var start = new ConstantNode(0);
    var end = new ConstantNode(10);
    var n = new RangeNode([start, end]);

    assert.equal(n.toTex(), '0:10');
  });

  it ('should LaTeX a RangeNode with step', function () {
    var start = new ConstantNode(0);
    var end = new ConstantNode(10);
    var step = new ConstantNode(2);
    var n = new RangeNode([start, end, step]);

    assert.equal(n.toTex(), '0:2:10');
  });

});
