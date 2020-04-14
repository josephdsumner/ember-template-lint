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

const validLandmarkRoles = {
  'aside': [],
  'footer': ['contentinfo'],
  'form': ['search'],
  'header': [],
  'main': [],
  'nav': [],
  'section': []
};



module.exports = class RequireValidLandmark extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        // Check only ARIA landmark-defining HTML section elements
        let isLandmarkElement = landmarkTags.includes(node.tag);
        let hasRoleAttribute  = AstNodeInfo.hasAttribute(node, 'role');
        if ( !isLandmarkElement || !hasRoleAttribute ) {
          return;
        }

        let roleAttributeValue = AstNodeInfo.elementAttributeValue(node, 'role');
        let hasValidRoleValue = validLandmarkRoles[node.tag].includes(roleAttributeValue);

        if (!hasValidRoleValue) {
          console.log(AstNodeInfo.elementAttributeValue(node, 'role').length)
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
