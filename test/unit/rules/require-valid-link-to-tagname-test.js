'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

const ERROR_MESSAGE = require('../../../lib/rules/require-valid-link-to-tagname').ERROR_MESSAGE;

generateRuleTests({
  name: 'require-valid-link-to-tagname',

  config: true,

  good: [
    '<LinkTo @route="routeName">foo</LinkTo>',
    '<LinkTo @route="routeName" tagName="a">foo</LinkTo>',
    '{{#link-to "routeName"}}foo{{/link-to}}',
    '{{#link-to "routeName" tagName="a"}}foo{{/link-to}}',    
],

  bad: [
    {
      template: '<LinkTo @route="routeName" tagName="button">foo</LinkTo>',
      result: {
        source: '<LinkTo @route="routeName" tagName="button">foo</LinkTo>',
        line: 1,
        column: 0,
        message: ERROR_MESSAGE
      },
    },
    {
      template: '{{#link-to "routeName" tagName="button"}}foo{{/link-to}}',
      result: {
        source: '{{#link-to "routeName" tagName="button"}}foo{{/link-to}}',
        line: 1,
        column: 0,
        message: ERROR_MESSAGE
      },
    },
  ],
});
