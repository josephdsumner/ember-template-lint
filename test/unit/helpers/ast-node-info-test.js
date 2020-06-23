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

// attributeValue unwrapping
// -------------------------
// New behavior
// TextNode: only unwrap when unwrapTextNode option is set to `true`
describe('attributeValue: TextNode', function () {
  let raw = '<div id="text-node-attr-value"></div>';
  let ast = parse(raw);

  it('Unwrap option default: returns AST Node', function () {
    let attrValue = AstNodeInfo.attributeValue(AstNodeInfo.findAttribute(ast.body[0], 'id'));
    expect(attrValue.type).toEqual('TextNode');
    expect(attrValue.chars).toEqual('text-node-attr-value');
  });

  it('Unwrap option `false`: returns AST Node', function () {
    let attrValue = AstNodeInfo.attributeValue(AstNodeInfo.findAttribute(ast.body[0], 'id'), false);
    expect(attrValue.type).toEqual('TextNode');
    expect(attrValue.chars).toEqual('text-node-attr-value');
  });

  it('Unwrap option `true`: returns String', function () {
    let attrValue = AstNodeInfo.attributeValue(AstNodeInfo.findAttribute(ast.body[0], 'id'), true);
    expect(typeof attrValue).toEqual('string');
    expect(attrValue).toEqual('text-node-attr-value');
  });
});

describe('hasAttributeValue: TextNode', function () {
  let raw = '<div id="text-node-attr-value"></div>';
  let ast = parse(raw);
  it('Unwrap option default: returns AST Node', function () {
    let hasAttrValue = AstNodeInfo.hasAttributeValue(ast.body[0], 'id', 'text-node-attr-value');
    expect(hasAttrValue).toBe(false);
  });

  it('Unwrap option `false`: returns AST Node', function () {
    let hasAttrValue = AstNodeInfo.hasAttributeValue(
      ast.body[0],
      'id',
      'text-node-attr-value',
      false
    );
    expect(hasAttrValue).toBe(false);
  });

  it('Unwrap option `true`: returns String', function () {
    let hasAttrValue = AstNodeInfo.hasAttributeValue(
      ast.body[0],
      'id',
      'text-node-attr-value',
      true
    );
    expect(hasAttrValue).toBe(true);
  });
});

describe('elementAttributeValue: TextNode', function () {
  let raw = '<div id="text-node-attr-value"></div>';
  let ast = parse(raw);

  it('Unwrap option default: returns AST Node', function () {
    let eleAttrValue = AstNodeInfo.elementAttributeValue(ast.body[0], 'id');
    expect(eleAttrValue.type).toEqual('TextNode');
    expect(eleAttrValue.chars).toEqual('text-node-attr-value');
  });

  it('Unwrap option `false`: returns AST Node', function () {
    let eleAttrValue = AstNodeInfo.elementAttributeValue(ast.body[0], 'id', false);
    expect(eleAttrValue.type).toEqual('TextNode');
    expect(eleAttrValue.chars).toEqual('text-node-attr-value');
  });

  it('Unwrap option `true`: returns String', function () {
    let eleAttrValue = AstNodeInfo.elementAttributeValue(ast.body[0], 'id', true);
    expect(typeof eleAttrValue).toEqual('string');
    expect(eleAttrValue).toEqual('text-node-attr-value');
  });
});

// Checks to make sure other node types are unaffected (always wrapped)
describe('attributeValue: MustacheStatement', function () {
  let raw = '<div id={{"mustache-statement-attr-value"}}></div>';
  let ast = parse(raw);

  it('Unwrap option default: returns AST Node', function () {
    let attrValue = AstNodeInfo.attributeValue(AstNodeInfo.findAttribute(ast.body[0], 'id'));
    expect(attrValue.type).toEqual('MustacheStatement');
  });

  it('Unwrap option `false`: returns AST Node', function () {
    let attrValue = AstNodeInfo.attributeValue(AstNodeInfo.findAttribute(ast.body[0], 'id'), false);
    expect(attrValue.type).toEqual('MustacheStatement');
  });

  it('Unwrap option `true`: returns AST Node', function () {
    let attrValue = AstNodeInfo.attributeValue(AstNodeInfo.findAttribute(ast.body[0], 'id'), true);
    expect(attrValue.type).toEqual('MustacheStatement');
  });
});

describe('hasAttributeValue: MustacheStatement', function () {
  let raw = '<div id={{"mustache-statement-attr-value"}}></div>';
  let ast = parse(raw);
  let exp = AstNodeInfo.findAttribute(ast.body[0], 'id').value;

  it('Unwrap option default: returns AST Node', function () {
    let hasAttrValue = AstNodeInfo.hasAttributeValue(ast.body[0], 'id', exp);
    expect(hasAttrValue).toBe(true);
  });

  it('Unwrap option `false`: returns AST Node', function () {
    let hasAttrValue = AstNodeInfo.hasAttributeValue(ast.body[0], 'id', exp, false);
    expect(hasAttrValue).toBe(true);
  });

  it('Unwrap option `true`: returns AST Node', function () {
    let hasAttrValue = AstNodeInfo.hasAttributeValue(ast.body[0], 'id', exp, true);
    expect(hasAttrValue).toBe(true);
  });
});

describe('attributeValue: ConcatStatement', function () {
  let raw = '<div id="concat-statement-{{"attr-value"}}"></div>';
  let ast = parse(raw);

  it('Unwrap option default: returns AST Node', function () {
    let attrValue = AstNodeInfo.attributeValue(AstNodeInfo.findAttribute(ast.body[0], 'id'));
    expect(attrValue.type).toEqual('ConcatStatement');
  });

  it('Unwrap option `false`: returns AST Node', function () {
    let attrValue = AstNodeInfo.attributeValue(AstNodeInfo.findAttribute(ast.body[0], 'id'), false);
    expect(attrValue.type).toEqual('ConcatStatement');
  });

  it('Unwrap option `true`: returns AST Node', function () {
    let attrValue = AstNodeInfo.attributeValue(AstNodeInfo.findAttribute(ast.body[0], 'id'), true);
    expect(attrValue.type).toEqual('ConcatStatement');
  });
});

describe('hasAttributeValue: ConcatStatement', function () {
  let raw = '<div id="concat-statement-{{"attr-value"}}"></div>';
  let ast = parse(raw);
  let exp = AstNodeInfo.findAttribute(ast.body[0], 'id').value;

  it('Unwrap option default: returns AST Node', function () {
    let hasAttrValue = AstNodeInfo.hasAttributeValue(ast.body[0], 'id', exp);
    expect(hasAttrValue).toBe(true);
  });

  it('Unwrap option `false`: returns AST Node', function () {
    let hasAttrValue = AstNodeInfo.hasAttributeValue(ast.body[0], 'id', exp, false);
    expect(hasAttrValue).toBe(true);
  });

  it('Unwrap option `true`: returns AST Node', function () {
    let hasAttrValue = AstNodeInfo.hasAttributeValue(ast.body[0], 'id', exp, true);
    expect(hasAttrValue).toBe(true);
  });
});
