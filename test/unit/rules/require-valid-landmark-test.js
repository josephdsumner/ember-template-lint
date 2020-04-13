'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

const ERROR_MESSAGE = require('../../../lib/rules/require-valid-landmark').ERROR_MESSAGE;

generateRuleTests({
  name: 'require-valid-landmark',

  config: true,

  good: [
    // Non-landmark elements, no roles
    '<div></div>',
    '<p></p>',

    // Landmark elements, no roles
    '<aside></aside>',
    '<footer></footer>',
    '<form></form>',
    '<header></header>',
    '<main></main>',
    '<nav></nav>',
    '<section></section>'

  ],

  // TODO update with tests that should fail
  bad: [
    // {
    //   template: 'FailingTest00 -- contains DisallowedText',
    //   result: {
    //     source: 'FailingTest00 -- contains DisallowedText',
    //     line: 1,
    //     column: 0,
    //     message: ERROR_MESSAGE,
    //     moduleId: 'layout',
    //   },
    // },
  ],
});
