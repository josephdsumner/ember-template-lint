'use strict';

const Rule = require('./base');
const AstNodeInfo = require('../helpers/ast-node-info');

const ERROR_MESSAGE = 'Invalid role assignment on ARIA landmark-defining HTML sectioning element';

const landmarkTags = [
  'aside',
  'footer',
  'form',
  'header',
  'main',
  'nav',
  'section'
];

const landmarkRoles = [
  'complementary',
  'contentinfo',
  'form',
  'banner',
  'main',
  'navigation',
  'region'
];

module.exports = class RequireValidLandmark extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        if ( !landmarkTags.includes(node.tag) ) {
          return;
        }
        console.log(node.tag);
        let failingCondition = false;
        if (failingCondition) {
          this.log({
            message: ERROR_MESSAGE,
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
          });
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
