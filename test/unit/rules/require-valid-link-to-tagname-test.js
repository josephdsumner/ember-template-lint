'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

const ERROR_MESSAGE = require('../../../lib/rules/require-valid-link-to-tagname').ERROR_MESSAGE;

generateRuleTests({
  name: 'require-valid-link-to-tagname',

  config: true,

  // TODO update with a good example that should pass
  good: [
    // '{{#link-to tagName="button"}}foo{{/link-to}}',
    '<LinkTo>foo</LinkTo>',
    '<LinkTo tagName="a">foo</LinkTo>',

],

  bad: [
    {
      template: '<LinkTo tagName="button">foo</LinkTo>',
      result: {
        source: '<LinkTo tagName="button">foo</LinkTo>',
        line: 1,
        column: 0,
        message: ERROR_MESSAGE
      },
    }
  ],
});
