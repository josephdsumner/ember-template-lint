'use strict';

const Rule = require('./base');
const NodeMatcher = require('../helpers/node-matcher');

const ERROR_MESSAGE = 'ID attribute values must be unique';

/* [WIP] Schema
  const ALLOWED_ID_ATTRIBUTE_FORMATS = {
    ElementNode: {
      nodeName: 'ElementNode',
      attrNodeType: 'AttrNode',
      idAttrTagNames: ['id, @id'],
      idAttrValueTypes: ['TextNode', 'MustacheStatement', 'ConcatStatement'],
    },
    BlockStatement: {
      nodeName: 'BlockStatement',
      attrNodeType: 'Hash',
      idAttrTagNames: ['elementId'],
      idAttrValueTypes: ['StringLiteral'],
    },
    MustacheStatement: {
      nodeName: 'MustacheStatement',
      attrNodeType: 'Hash',
      idAttrTagNames: ['id'],
      idAttrValueTypes: ['StringLiteral'],
    },
  };
*/

module.exports = class NoDuplicateId extends Rule {
  logNode({ node, message }) {
    return this.log({
      message,
      line: node.loc && node.loc.start.line,
      column: node.loc && node.loc.start.column,
      source: this.sourceForNode(node),
    });
  }

  visitor() {
    // Visiting function node filter for AttrNodes: attribute name, node type
    function isValidAttrNodeId(node) {
      // consider removing `@id` eventually (or make it a toggle available via config)
      let isValidAttrNodeIdTag = ['id', '@id'].includes(node.name);
      let isValidAttrNodeIdValueType = [
        'TextNode',
        'MustacheStatement',
        'ConcatStatement',
      ].includes(node.value.type);
      return node && isValidAttrNodeIdTag && isValidAttrNodeIdValueType;
    }

    // MustacheStatement is StringLiteral
    function isMustacheString(node) {
      let refNode = { type: 'MustacheStatement', path: { type: 'StringLiteral' } };
      return NodeMatcher.match(node.value, refNode);
    }

    function getMustacheValue(node, scope) {
      let idValue;
      if (isMustacheString(node)) {
        idValue = node.value.path.value;
      } else {
        idValue = scope.sourceForNode(node.value);
      }
      return idValue;
    }

    function getMustachePartValue(part, scope) {
      let refNodeStr = { type: 'MustacheStatement', path: { type: 'StringLiteral' } };
      let refNodeDyn = { type: 'MustacheStatement', path: { type: 'PathExpression' } };
      if (NodeMatcher.match(part, refNodeStr)) {
        return part.path.value;
      }
      if (NodeMatcher.match(part, refNodeDyn)) {
        // console.log('DYN');
        // console.log(scope.sourceForNode(part));
        return scope.sourceForNode(part);
      }
    }

    // Verify ConcatStatement has only StringLiteral parts
    function isConcatString(node) {
      let refNodes = [
        { type: 'TextNode' },
        { type: 'MustacheStatement', path: { type: 'StringLiteral' } },
      ];
      return (
        NodeMatcher.match(node, { value: { type: 'ConcatStatement' } }) &&
        node.value.parts.every((part) => NodeMatcher.match(part, refNodes))
      );
    }

    // Helper
    function getPartValue(part, scope) {
      // console.log(part);
      return part.type === 'TextNode' ? part.chars : getMustachePartValue(part, scope);
    }

    // Join ConcatStatement Parts
    function getJoinedConcatParts(node, scope) {
      return node.value.parts.map((part) => getPartValue(part, scope)).join('');
    }

    let idValueSet = new Set();
    return {
      AttrNode(node) {
        if (!isValidAttrNodeId(node)) {
          return;
        }
        // Assign an idValue only if it is entirely String, e.g.
        // id="id-value"
        // id={{"id-value"}}
        // id="id-{{"value"}}"
        // id="{{"id-"}}{{"value"}}"
        // or similar
        let idValue;

        // TextNode: unwrap
        // ----------------
        // id="id-value"
        if (node.value.type === 'TextNode') {
          idValue = node.value.chars;
        }

        // MustacheStatement: Resolve if possible
        // --------------------------------------
        // id={{"id-value"}} -> "id-value"
        // id={{idValue}} -> {{idValue}}
        if (node.value.type === 'MustacheStatement') {
          idValue = getMustacheValue(node, this);
        }

        // ConcatStatement: all parts must be String Literals
        // --------------------------------------------------
        // id="id-{{"value"}}" is all String parts: continue
        // id="id-{{this.value}}" has a dynamic part: bypass
        if (node.value.type === 'ConcatStatement') {
          // if (isConcatString(node)) {
          // Join `parts` if all Strings: "id-{{"value"}}": "id-value"
          idValue = getJoinedConcatParts(node, this);
          // console.log(idValue);
          // }
        }

        // If idValue didn't get assigned by this point, i.e.,
        // it is not entirely composed of StringLiteral components,
        // set it to the raw source
        if (!idValue) {
          idValue = this.sourceForNode(node.value);
          // console.log(this.sourceForNode(node.value.parts[1]));
        }

        idValueSet.has(idValue)
          ? this.logNode({ node, message: ERROR_MESSAGE })
          : idValueSet.add(idValue);
      },

      BlockStatement(node) {
        let refPair = { key: 'elementId', value: { type: 'StringLiteral' } };
        let elementIdHashArg = node.hash.pairs.find((testPair) =>
          NodeMatcher.match(testPair, refPair)
        );
        if (!elementIdHashArg) {
          return;
        }
        let idValue = elementIdHashArg.value.value;
        idValueSet.has(idValue)
          ? this.logNode({ node, message: ERROR_MESSAGE })
          : idValueSet.add(idValue);
      },

      MustacheStatement(node) {
        let refPair = { key: 'id', value: { type: 'StringLiteral' } };
        let idHashArg = node.hash.pairs.find((testPair) => NodeMatcher.match(testPair, refPair));
        if (!idHashArg) {
          return;
        }
        let idValue = idHashArg.value.value;
        idValueSet.has(idValue)
          ? this.logNode({ node, message: ERROR_MESSAGE })
          : idValueSet.add(idValue);
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
