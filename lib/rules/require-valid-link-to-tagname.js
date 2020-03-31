'use strict';

const Rule = require('./base');
const AstNodeInfo = require('../helpers/ast-node-info');

const ERROR_MESSAGE = 'Built-in LinkTo components must not override wrapping `a` tag';

module.exports = class RequireValidLinkToTagname extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        if (node.tag !== 'LinkTo')  {
          return;
        }
        // Support @tagName or tagName -- but not both
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
      },

      //  GOOD:  
      //    {{#link-to tagName="button"}}foo{{/link-to}}
      //    {{#link-to}}foo{{/link-to}}
      //  BAD:
      //    {{#link-to tagName="button"}}foo{{/link-to}}
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
      }
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
