'use strict';

const Rule = require('./base');

const ERROR_MESSAGE = 'ID attribute values must be unique';

// Utility functions
// -----------------

// Visiting function node filter for AttrNodes: attribute name, node type
function isValidAttrNodeId(node) {
  // consider removing `@id` eventually (or make it a toggle available via config)
  let isValidAttrNodeIdTag = ['id', '@id'].includes(node.name);
  let isValidAttrNodeIdValueType = ['TextNode', 'MustacheStatement', 'ConcatStatement'].includes(
    node.value.type
  );
  return node && isValidAttrNodeIdTag && isValidAttrNodeIdValueType;
}

// MustacheStatement is StringLiteral
function isMustacheString(node) {
  return (
    node && node.value.type === 'MustacheStatement' && node.value.path.type === 'StringLiteral'
  );
}

// Verify ConcatStatement has only StringLiteral parts
function isConcatString(node) {
  // Helpers
  function concatPartIsString(part) {
    return (
      part &&
      (part.type === 'TextNode' ||
        (part.type === 'MustacheStatement' && part.path.type === 'StringLiteral'))
    );
  }
  function allConcatPartsAreStrings(parts) {
    return parts.every(concatPartIsString);
  }
  // Result
  return (
    node && node.value.type === 'ConcatStatement' && allConcatPartsAreStrings(node.value.parts)
  );
}

// Join ConcatStatement Parts
function getJoinedConcatParts(node) {
  // Helper
  function getPartValue(part) {
    return part.type === 'TextNode' ? part.chars : part.path.value;
  }
  // Result
  return node.value.parts.map(getPartValue).join('');
}
module.exports = class NoDuplicateId extends Rule {
  logNode({ message, node }) {
    this.log({
      message,
      line: node.loc && node.loc.start.line,
      column: node.loc && node.loc.start.column,
      source: this.sourceForNode(node),
    });
  }

  visitor() {
    let idValueSet = new Set();
    return {
      AttrNode(node) {
        // Only check relevant nodes
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
          if (isMustacheString(node)) {
            idValue = node.value.path.value;
          } else {
            idValue = this.sourceForNode(node.value);
          }
        }

        // ConcatStatement: all parts must be String Literals
        // --------------------------------------------------
        // id="id-{{"value"}}" is all String parts: continue
        // id="id-{{this.value}}" has a dynamic part: bypass
        if (node.value.type === 'ConcatStatement') {
          if (isConcatString(node)) {
            // Join `parts` if all Strings: "id-{{"value"}}": "id-value"
            idValue = getJoinedConcatParts(node);
          }
        }

        // If idValue didn't get assigned by this point, i.e.,
        // it is not entirely composed of StringLiteral components,
        // set it to the raw source
        if (!idValue) {
          idValue = this.sourceForNode(node.value);
        }

        // Log if this is a duplicate idValue, add to the set if it is unique
        let isDuplicate = idValueSet.has(idValue);
        if (isDuplicate) {
          this.logNode({ message: ERROR_MESSAGE, node });
        } else {
          idValueSet.add(idValue);
        }
      },

      BlockStatement(node) {
        // Helpers
        function isElementIdHashPair(pair) {
          return pair.key === 'elementId';
        }
        function getElementIdHashPair(hashPairs) {
          return hashPairs.find(isElementIdHashPair);
        }
        function isValidElementIdHashPair(hashArg) {
          return hashArg && hashArg.value.type === 'StringLiteral';
        }
        // Validate BlockStatement: elementId="some-StringLiteral"
        let hashPairs = node.hash.pairs;
        let elementIdHashArg = getElementIdHashPair(hashPairs);
        if (!isValidElementIdHashPair(elementIdHashArg)) {
          return;
        }
        let idValue = elementIdHashArg.value.value;

        let isDuplicate = idValueSet.has(idValue);
        if (isDuplicate) {
          this.logNode({ message: ERROR_MESSAGE, node });
        } else {
          idValueSet.add(idValue);
        }
      },

      MustacheStatement(node) {
        // Helpers
        function isIdHashPair(pair) {
          return pair.key === 'id';
        }
        function getIdHashPair(hashPairs) {
          return hashPairs.find(isIdHashPair);
        }
        function isValidIdHashPair(hashArg) {
          return hashArg && hashArg.value.type === 'StringLiteral';
        }
        // Validate MustacheStatement: id="some-StringLiteral"
        let hashPairs = node.hash.pairs;
        let idHashArg = getIdHashPair(hashPairs);
        if (!isValidIdHashPair(idHashArg)) {
          return;
        }

        let idValue = idHashArg.value.value;

        let isDuplicate = idValueSet.has(idValue);
        if (isDuplicate) {
          this.logNode({ message: ERROR_MESSAGE, node });
        } else {
          idValueSet.add(idValue);
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
