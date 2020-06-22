'use strict';

const AstNodeInfo = require('../../../lib/helpers/ast-node-info');
const { parse } = require('ember-template-recast');

describe('isImgElement', function () {
  it('can detect an image tag', function () {
    let tableAst = parse('<table></table>');
    expect(AstNodeInfo.isImgElement(tableAst.body[0])).toBe(false);

    let imgAst = parse('<img />');
    expect(AstNodeInfo.isImgElement(imgAst.body[0])).toBe(true);
  });
});

describe('hasChildren', function () {
  it('functions for empty input', function () {
    expect(AstNodeInfo.hasChildren(parse(''))).toBe(false);
  });

  it('functions for empty elements', function () {
    let ast = parse('<div></div>');
    expect(AstNodeInfo.hasChildren(ast.body[0])).toBe(false);
    expect(AstNodeInfo.hasChildren(ast)).toBe(true);
  });

  it('detects text', function () {
    let ast = parse('<div>hello</div>');
    expect(AstNodeInfo.hasChildren(ast.body[0])).toBe(true);
  });

  it('detects whitespace', function () {
    let ast = parse('<div> </div>');
    expect(AstNodeInfo.hasChildren(ast.body[0])).toBe(true);
  });
});

describe('elementAttributeValue', function () {
  it('Default: returns an AST Node', function () {
    let raw = '<div id="text-node-attr-value"></div>';
    let ast = parse(raw);
    let attrValue = AstNodeInfo.elementAttributeValue(ast.body[0], 'id');
    expect(attrValue.type).toEqual('TextNode');
    expect(attrValue.chars).toEqual('text-node-attr-value');
  });

  it('Unwrap option set to `false`: returns an AST Node', function () {
    let raw = '<div id="text-node-attr-value"></div>';
    let ast = parse(raw);
    let attrValue = AstNodeInfo.elementAttributeValue(ast.body[0], 'id', false);
    expect(attrValue.type).toEqual('TextNode');
    expect(attrValue.chars).toEqual('text-node-attr-value');
  });

  it('Unwrap option set to `true`: returns a String', function () {
    let raw = '<div id="text-node-attr-value"></div>';
    let ast = parse(raw);
    let attrValue = AstNodeInfo.elementAttributeValue(ast.body[0], 'id', true);
    expect(typeof attrValue).toEqual('string');
    expect(attrValue).toEqual('text-node-attr-value');
  });
});
