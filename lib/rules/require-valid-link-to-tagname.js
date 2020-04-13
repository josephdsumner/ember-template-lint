'use strict';

<<<<<<< HEAD

const Rule = require('./base');
const AstNodeInfo = require('../helpers/ast-node-info');

=======
const Rule = require('./base');
const AstNodeInfo = require('../helpers/ast-node-info');

// TODO Change template to the real error message that you want to report
>>>>>>> Generate files + POC for ElementNodes
const ERROR_MESSAGE = 'Built-in LinkTo components must not override wrapping `a` tag';

module.exports = class RequireValidLinkToTagname extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        if (node.tag !== 'LinkTo')  {
          return;
        }
<<<<<<< HEAD
        // Support @tagName or tagName -- but not both
=======
>>>>>>> Generate files + POC for ElementNodes
        let tagNameValues = [
          AstNodeInfo.elementAttributeValue(node, 'tagName'),
          node.tag === 'LinkTo' && AstNodeInfo.elementAttributeValue(node, '@tagName'),
        ]
          .filter((possibleValue) => typeof possibleValue === 'string')
          .map((value) => value.toLowerCase().trim());

        if (tagNameValues.length > 1) {
          this.log({
            message:
              'Specifying tagName as both an attribute and an argument to <LinkTo /> is invalid.',
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
          });
        }

<<<<<<< HEAD
=======
        console.log(tagNameValues);

>>>>>>> Generate files + POC for ElementNodes
        let hasValidTagName = tagNameValues.every( tagNameValue => 
          tagNameValue === 'a');
        
        if (!hasValidTagName) {
          this.log({
            message: ERROR_MESSAGE,
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
          });
        }
<<<<<<< HEAD
      },
      BlockStatement(node)  {
        if ( node.path.original !== 'link-to') {
          return;
        }

        let tagNameHashArg = node.hash.pairs.find((pair) => pair.key === 'tagName');

        if (tagNameHashArg && tagNameHashArg.value.type === 'StringLiteral') {
          let tagNameValue = tagNameHashArg.value.value;
          let hasValidTagName = (tagNameValue === 'a');
          if (!hasValidTagName) {
            this.log({
              message: ERROR_MESSAGE,
              line: node.loc && node.loc.start.line,
              column: node.loc && node.loc.start.column,
              source: this.sourceForNode(node),
            });
          }
        }
=======


>>>>>>> Generate files + POC for ElementNodes
      }
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
