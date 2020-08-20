'use strict';

const NodeMatcher = require('../helpers/node-matcher');
const Rule = require('./base');

const ERROR_MESSAGE = 'ID attribute values must be unique';

/* Schema (Summary AST Node Formats to check)
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
    // Helper Functions:

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

    // Resolve MustacheStatement value to StringLiteral if possible
    // Usage context for the `part` argument:
    // MustacheStatement `node` => `part` = `node.value`
    // ConcatStatement `part` => `part` = `part`
    function getMustacheValue(part, scope) {
      let refNodeStr = { type: 'MustacheStatement', path: { type: 'StringLiteral' } };
      let refNodeDyn = { type: 'MustacheStatement', path: { type: 'PathExpression' } };
      if (NodeMatcher.match(part, refNodeStr)) {
        return part.path.value;
      }
      if (NodeMatcher.match(part, refNodeDyn)) {
        return scope.sourceForNode(part);
      }
    }

    function getPartValue(part, scope) {
      return part.type === 'TextNode' ? part.chars : getMustacheValue(part, scope);
    }

    // Resolve ConcatStatement parts to StringLiterals where possible, join
    function getJoinedConcatParts(node, scope) {
      return node.value.parts.map((part) => getPartValue(part, scope)).join('');
    }

    // Stores the idValues collected during visits; reference for duplicates
    let idValueSet = new Set();
    return {
      AttrNode(node) {
        if (!isValidAttrNodeId(node)) {
          return;
        }

        let idValue;

        // Start by checking idValues that resolve to StringLiteral

        // TextNode: unwrap
        // id="id-value" --> "id-value"
        if (node.value.type === 'TextNode') {
          idValue = node.value.chars;
        }

        // MustacheStatement: resolve if possible
        // id={{"id-value"}} -> "id-value"
        // id={{idValue}} -> "{{idValue}}"
        if (node.value.type === 'MustacheStatement') {
          idValue = getMustacheValue(node.value, this);
        }

        // ConcatStatement: resolve parts to StringLiteral where possible
        // id="id-{{"value"}}" -> "id-value"
        // id="id-{{value}}-{{"number"}}" --> "id-{{value}}-number"
        if (node.value.type === 'ConcatStatement') {
          idValue = getJoinedConcatParts(node, this);
        }

        // If idValue didn't get assigned by this point, i.e., it has no
        // resolvable components, use the full raw source
        if (!idValue) {
          idValue = this.sourceForNode(node.value);
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
