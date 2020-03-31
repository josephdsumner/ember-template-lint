'use strict';

const Rule = require('./base');
const AstNodeInfo = require('../helpers/ast-node-info');

// TODO Change template to the real error message that you want to report
const ERROR_MESSAGE = 'Built-in LinkTo components must not override wrapping `a` tag';

module.exports = class RequireValidLinkToTagname extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        if (node.tag !== 'LinkTo')  {
          return;
        }
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

        console.log(tagNameValues);

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


      }
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
