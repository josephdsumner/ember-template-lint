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
    '<section></section>',

    // Non-landmark elements, landmark-assigning roles
    '<div role="complementary"></div>',
    '<div role="contentinfo"></div>',
    '<div role="form"></div>',
    '<div role="banner"></div>',
    '<div role="main"></div>',
    '<div role="navigation"></div>',
    '<div role="region"></div>',
  ],


  bad: [

    // Landmark elements with role assignments
    {
      template: '<aside role="main"></aside>',
      result: {
        source: '<aside role="main"></aside>',
        line: 1,
        column: 0,
        message: ERROR_MESSAGE,
        moduleId: 'layout',
      },
    },
    {
      template: '<aside role=""></aside>',
      result: {
        source: '<aside role=""></aside>',
        line: 1,
        column: 0,
        message: ERROR_MESSAGE,
        moduleId: 'layout',
      },
    },
    {
      template: '<aside role="some-role"></aside>',
      result: {
        source: '<aside role="some-role"></aside>',
        line: 1,
        column: 0,
        message: ERROR_MESSAGE,
        moduleId: 'layout',
      },
    },
  ],
});
