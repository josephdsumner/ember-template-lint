'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
<<<<<<< HEAD
=======

>>>>>>> Generate files + POC for ElementNodes
const ERROR_MESSAGE = require('../../../lib/rules/require-valid-link-to-tagname').ERROR_MESSAGE;

generateRuleTests({
  name: 'require-valid-link-to-tagname',

  config: true,

<<<<<<< HEAD
  good: [
    '<LinkTo @route="routeName">foo</LinkTo>',
    '<LinkTo @route="routeName" tagName="a">foo</LinkTo>',
    '{{#link-to "routeName"}}foo{{/link-to}}',
    '{{#link-to "routeName" tagName="a"}}foo{{/link-to}}',    
=======
  // TODO update with a good example that should pass
  good: [
    // '{{#link-to tagName="button"}}foo{{/link-to}}',
    '<LinkTo>foo</LinkTo>',
    '<LinkTo tagName="a">foo</LinkTo>',

>>>>>>> Generate files + POC for ElementNodes
],

  bad: [
    {
<<<<<<< HEAD
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
=======
      template: '<LinkTo tagName="button">foo</LinkTo>',
      result: {
        source: '<LinkTo tagName="button">foo</LinkTo>',
>>>>>>> Generate files + POC for ElementNodes
        line: 1,
        column: 0,
        message: ERROR_MESSAGE
      },
<<<<<<< HEAD
    },
=======
    }
>>>>>>> Generate files + POC for ElementNodes
  ],
});
