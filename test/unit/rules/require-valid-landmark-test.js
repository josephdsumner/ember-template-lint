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

    // Exceptions
    '<form role="search"></form>',
    '<footer role="contentinfo"></footer>',

  ],


  bad: [

    /**
    Landmark elements with role attribute assignments are sometimes
    divided into two failure severity classes:

    1. Conflicts -- never okay, role override causes severe issues: 
      <nav role="main"></nav>
      <nav role="arbitrary"></nav>
    
    2. Redundancies -- not best practice, but landmarks function:
      <nav role="navigation"></nav>
      <nav role=""></nav>

    The current rule logic treats all of these as failures, but tests
    are organized as above to simplify any future need to refactor 
    to a severity configuration.
    */

    // 1. Conflicts
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
      template: '<aside role="arbitrary"></aside>',
      result: {
        source: '<aside role="arbitrary"></aside>',
        line: 1,
        column: 0,
        message: ERROR_MESSAGE,
        moduleId: 'layout',
      },
    },

    {
      template: '<footer role="main"></footer>',
      result: {
        source: '<footer role="main"></footer>',
        line: 1,
        column: 0,
        message: ERROR_MESSAGE,
        moduleId: 'layout',
      },
    },
    {
      template: '<footer role="arbitrary"></footer>',
      result: {
        source: '<footer role="arbitrary"></footer>',
        line: 1,
        column: 0,
        message: ERROR_MESSAGE,
        moduleId: 'layout',
      },
    },

    {
      template: '<form role="main"></form>',
      result: {
        source: '<form role="main"></form>',
        line: 1,
        column: 0,
        message: ERROR_MESSAGE,
        moduleId: 'layout',
      },
    },
    {
      template: '<form role="arbitrary"></form>',
      result: {
        source: '<form role="arbitrary"></form>',
        line: 1,
        column: 0,
        message: ERROR_MESSAGE,
        moduleId: 'layout',
      },
    },

    {
      template: '<header role="main"></header>',
      result: {
        source: '<header role="main"></header>',
        line: 1,
        column: 0,
        message: ERROR_MESSAGE,
        moduleId: 'layout',
      },
    },
    {
      template: '<header role="arbitrary"></header>',
      result: {
        source: '<header role="arbitrary"></header>',
        line: 1,
        column: 0,
        message: ERROR_MESSAGE,
        moduleId: 'layout',
      },
    },

    {
      template: '<main role="navigation"></main>',
      result: {
        source: '<main role="navigation"></main>',
        line: 1,
        column: 0,
        message: ERROR_MESSAGE,
        moduleId: 'layout',
      },
    },
    {
      template: '<main role="arbitrary"></main>',
      result: {
        source: '<main role="arbitrary"></main>',
        line: 1,
        column: 0,
        message: ERROR_MESSAGE,
        moduleId: 'layout',
      },
    },

    {
      template: '<nav role="main"></nav>',
      result: {
        source: '<nav role="main"></nav>',
        line: 1,
        column: 0,
        message: ERROR_MESSAGE,
        moduleId: 'layout',
      },
    },
    {
      template: '<nav role="arbitrary"></nav>',
      result: {
        source: '<nav role="arbitrary"></nav>',
        line: 1,
        column: 0,
        message: ERROR_MESSAGE,
        moduleId: 'layout',
      },
    },

    {
      template: '<section role="main"></section>',
      result: {
        source: '<section role="main"></section>',
        line: 1,
        column: 0,
        message: ERROR_MESSAGE,
        moduleId: 'layout',
      },
    },
    {
      template: '<section role="arbitrary"></section>',
      result: {
        source: '<section role="arbitrary"></section>',
        line: 1,
        column: 0,
        message: ERROR_MESSAGE,
        moduleId: 'layout',
      },
    },


    // 2. Redundancies
    {
      template: '<aside role="complementary"></aside>',
      result: {
        source: '<aside role="complementary"></aside>',
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
      template: '<header role="banner"></header>',
      result: {
        source: '<header role="banner"></header>',
        line: 1,
        column: 0,
        message: ERROR_MESSAGE,
        moduleId: 'layout',
      },
    },
    {
      template: '<header role=""></header>',
      result: {
        source: '<header role=""></header>',
        line: 1,
        column: 0,
        message: ERROR_MESSAGE,
        moduleId: 'layout',
      },
    },  

    {
      template: '<main role="main"></main>',
      result: {
        source: '<main role="main"></main>',
        line: 1,
        column: 0,
        message: ERROR_MESSAGE,
        moduleId: 'layout',
      },
    },
    {
      template: '<main role=""></main>',
      result: {
        source: '<main role=""></main>',
        line: 1,
        column: 0,
        message: ERROR_MESSAGE,
        moduleId: 'layout',
      },
    },  

    {
      template: '<nav role="navigation"></nav>',
      result: {
        source: '<nav role="navigation"></nav>',
        line: 1,
        column: 0,
        message: ERROR_MESSAGE,
        moduleId: 'layout',
      },
    },
    
    {
      template: '<nav role=""></nav>',
      result: {
        source: '<nav role=""></nav>',
        line: 1,
        column: 0,
        message: ERROR_MESSAGE,
        moduleId: 'layout',
      },
    },  
  
    {
      template: '<section role="region"></section>',
      result: {
        source: '<section role="region"></section>',
        line: 1,
        column: 0,
        message: ERROR_MESSAGE,
        moduleId: 'layout',
      },
    },
    
    {
      template: '<section role=""></section>',
      result: {
        source: '<section role=""></section>',
        line: 1,
        column: 0,
        message: ERROR_MESSAGE,
        moduleId: 'layout',
      },
    },  


    // Explicit redundancies for footer + form are exceptions
    {
      template: '<footer role=""></footer>',
      result: {
        source: '<footer role=""></footer>',
        line: 1,
        column: 0,
        message: ERROR_MESSAGE,
        moduleId: 'layout',
      },
    },  
    {
      template: '<form role=""></form>',
      result: {
        source: '<form role=""></form>',
        line: 1,
        column: 0,
        message: ERROR_MESSAGE,
        moduleId: 'layout',
      },
    },

  ],
});
