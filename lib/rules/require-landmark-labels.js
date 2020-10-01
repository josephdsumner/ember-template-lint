'use strict';

const Rule = require('./base');
const AstNodeInfo = require('../helpers/ast-node-info');
const NodeMatcher = require('../helpers/node-matcher');

const ERROR_MESSAGE =
  'If multiple landmark elements (or elements with an equivalent role) of the same type are found on a page, they must each have a unique label.';

const LANDMARK_ELEMENT_TAG_VALUES = new Set([
  'header',
  'main', 
  'aside', 
  'form',
  'nav', 
  'footer'
]);

const LANDMARK_ROLE_ELEMENT_MAP = {
  banner: 'header',
  main: 'main',
  complementary: 'aside',
  form: 'form',
  search: 'form',
  navigation: 'nav',
  contentinfo: 'footer',
};

const LANDMARK_ELEMENT_ROLE_MAP = {
  header: 'banner',
  main: 'main', 
  aside: 'complementary', 
  form: 'form',
  nav: 'navigation', 
  footer: 'contentinfo',
}
const LANDMARK_ROLE_ELEMENT_REFS = Object.keys(LANDMARK_ROLE_ELEMENT_MAP);

const LANDMARK_ROLE_VALUES = Object.values(LANDMARK_ROLE_ELEMENT_MAP);

function isLandmarkElement(node) {
  return LANDMARK_ELEMENT_TAG_VALUES.includes(node.tag);
}

function elementHasLandmarkRole(node) {
  return NodeMatcher.match(node, {
    attributes: [{ 
      name: 'role',
      value: { type: 'StringLiteral' }
    }]
    }
  );
}

function getLandmarkRole(node) {
  let result;
  if (isLandmarkElement(node)) {
    result = LANDMARK_ELEMENT_ROLE_MAP[node.tag];
  } else if (elementHasLandmarkRole(node)) {
    let roleAttrNode = node.attributes.find(attrNode => attrNode.name === 'role');
    if (LANDMARK_ROLE_VALUES.includes(roleAttrNode.value.chars)) {
      result = roleAttrNode.value.chars;
    }
    return result;
  }
}

module.exports = class RequireLandmarkLabels extends Rule {
  constructor(options) {
    super(options);
    this._landmarkHash = [];
  }

  visitor() {
    return {
      ElementNode(node) {
        const hasRoleAttribute = AstNodeInfo.hasAttribute(node, 'role');

        // Return if it is not a landmark element or doesn't have role
        // or if the role value is not a string literal
        if (
          (hasRoleAttribute ||
            LANDMARK_ELEMENTS.has(node.tag) ||
            hasRoleAttribute.value.type === 'TextNode') === false
        ) {
          return;
        }

        const roleValue = AstNodeInfo.elementAttributeValue(node, 'role');

        // <nav>
        const isLandMarkElement = LANDMARK_ELEMENTS.has(node.tag);

        // <div role="navigation">
        const isLandMarkRole = LANDMARK_ROLES.includes(roleValue);

        if (isLandMarkElement || isLandMarkRole) {
          // check for accessible label via aria-label or aria-labelledby
          const label =
            AstNodeInfo.elementAttributeValue(node, 'aria-label') ||
            AstNodeInfo.elementAttributeValue(node, 'aria-labelledby') ||
            '';

          const landmark = isLandMarkElement ? node.tag : ROLE_LANDMARK_MAP[roleValue];
          let current = { landmark, label };

          const isNotUnique = this._landmarkHash.find((e) => {
            let landmarkRole = isLandMarkElement ? node.tag : ROLE_LANDMARK_MAP[roleValue];
            return e.landmark === landmarkRole && e.label === label;
          });

          if (isNotUnique) {
            this.log({
              message: ERROR_MESSAGE,
              line: node.loc && node.loc.start.line,
              column: node.loc && node.loc.start.column,
              source: this.sourceForNode(node),
            });
          } else {
            this._landmarkHash.push(current);
          }
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
