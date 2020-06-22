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

describe('attributeValue: TextNode', function () {
  it('Unwrap option default: returns AST Node', function () {
    let raw = '<div id="text-node-attr-value"></div>';
    let ast = parse(raw);
    let attrValue = AstNodeInfo.attributeValue(AstNodeInfo.findAttribute(ast.body[0], 'id'));
    expect(attrValue.type).toEqual('TextNode');
    expect(attrValue.chars).toEqual('text-node-attr-value');
  });

  it('Unwrap option `false`: returns AST Node', function () {
    let raw = '<div id="text-node-attr-value"></div>';
    let ast = parse(raw);
    let attrValue = AstNodeInfo.attributeValue(AstNodeInfo.findAttribute(ast.body[0], 'id'), false);
    expect(attrValue.type).toEqual('TextNode');
    expect(attrValue.chars).toEqual('text-node-attr-value');
  });

  it('Unwrap option `true`: returns String', function () {
    let raw = '<div id="text-node-attr-value"></div>';
    let ast = parse(raw);
    let attrValue = AstNodeInfo.attributeValue(AstNodeInfo.findAttribute(ast.body[0], 'id'), true);
    expect(typeof attrValue).toEqual('string');
    expect(attrValue).toEqual('text-node-attr-value');
  });
});

describe('hasAttributeValue: TextNode', function () {
  it('Unwrap option default: returns AST Node', function () {
    let raw = '<div id="text-node-attr-value"></div>';
    let ast = parse(raw);
    let hasAttrValue = AstNodeInfo.hasAttributeValue(ast.body[0], 'id', 'text-node-attr-value');
    expect(hasAttrValue).toBe(false);
  });

  it('Unwrap option `false`: returns AST Node', function () {
    let raw = '<div id="text-node-attr-value"></div>';
    let ast = parse(raw);
    let hasAttrValue = AstNodeInfo.hasAttributeValue(
      ast.body[0],
      'id',
      'text-node-attr-value',
      false
    );
    expect(hasAttrValue).toBe(false);
  });

  it('Unwrap option `true`: returns String', function () {
    let raw = '<div id="text-node-attr-value"></div>';
    let ast = parse(raw);
    let hasAttrValue = AstNodeInfo.hasAttributeValue(
      ast.body[0],
      'id',
      'text-node-attr-value',
      true
    );
    expect(hasAttrValue).toBe(true);
  });
});

describe('elementAttributeValue with TextNode', function () {
  it('Unwrap option default: returns AST Node', function () {
    let raw = '<div id="text-node-attr-value"></div>';
    let ast = parse(raw);
    let eleAttrValue = AstNodeInfo.elementAttributeValue(ast.body[0], 'id');
    expect(eleAttrValue.type).toEqual('TextNode');
    expect(eleAttrValue.chars).toEqual('text-node-attr-value');
  });

  it('Unwrap option `false`: returns AST Node', function () {
    let raw = '<div id="text-node-attr-value"></div>';
    let ast = parse(raw);
    let eleAttrValue = AstNodeInfo.elementAttributeValue(ast.body[0], 'id', false);
    expect(eleAttrValue.type).toEqual('TextNode');
    expect(eleAttrValue.chars).toEqual('text-node-attr-value');
  });

  it('Unwrap option `true`: returns String', function () {
    let raw = '<div id="text-node-attr-value"></div>';
    let ast = parse(raw);
    let eleAttrValue = AstNodeInfo.elementAttributeValue(ast.body[0], 'id', true);
    expect(typeof eleAttrValue).toEqual('string');
    expect(eleAttrValue).toEqual('text-node-attr-value');
  });
});
