'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

const ERROR_MESSAGE = require('../../../lib/rules/no-duplicate-id').ERROR_MESSAGE;

generateRuleTests({
  name: 'no-duplicate-id',

  config: true,

  good: [
    // Unique sibling TextNode IDs
    '<div id="id-00"></div><div id="id-01"></div>',

    // MustacheStatements
    '<div id={{"id-00"}}></div>',
    '<div id={{"id-00"}}></div><div id={{"id-01"}}></div>',
    '<div id={{this.divId00}}></div>',
    '<div id={{this.divId00}}></div><div id={{this.divId01}}></div>',

    // ConcatStatements
    '<div id="concat-{{this.divId00}}"></div>',
    '<div id="concat-{{this.divId00}}"></div><div id="concat-{{this.divId01}}"></div>',

    // Mustache and Concat do not conflict/flag with TextNode
    '<div id={{id-00}}></div><div id="id-00"></div>',
    '<div id="id-00"></div><div id={{id-00}}></div>',
    '<div id="concat-{{id-00}}"></div><div id="concat-id-00"></div>',
    '<div id="concat-id-00"></div><div id="concat-{{id-00}}"></div>',

    // SourceNode: BlockStatement
    '<div id="id-00"></div>{{#foo elementId="id-01"}}{{/foo}}',
    '{{#foo elementId="id-01"}}{{/foo}}<div id="id-00"></div>',

    // [WIP] Number
    '<div id={{1234}}></div>',
    '<div id={{1234}}></div><div id={{"1234"}}></div>',

    // [WIP] Dynamic
    '<div id={{"id-00"}}></div><div id={{"id-01"}}></div>',
    '<div id={{this.foo}}></div><div id={{this.bar}}></div>',

    // Source: Mustache
    '{{foo id="id-00"}}{{foo id="id-01"}}',
  ],

  bad: [
    {
      template: '<div id="id-00"></div><div id="id-00"></div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 27,
        source: 'id="id-00"',
      },
    },
    {
      template: '<div><div id="id-01"></div></div><div><div id="id-01"></div></div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 43,
        source: 'id="id-01"',
      },
    },

    {
      template: '<div id="id-00"></div><div id={{"id-00"}}></div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 27,
        source: 'id={{"id-00"}}',
      },
    },

    {
      template: '<div id={{"id-00"}}></div><div id="id-00"></div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 31,
        source: 'id="id-00"',
      },
    },

    {
      template: '<div id="id-00"></div><div id="id-{{"00"}}"></div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 27,
        source: 'id="id-{{"00"}}"',
      },
    },

    {
      template: '<div id="id-00"></div><div id="{{"id"}}-00"></div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 27,
        source: 'id="{{"id"}}-00"',
      },
    },

    // BlockStatement
    {
      template: '<div id="id-00"></div>{{#foo elementId="id-00"}}{{/foo}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 22,
        source: '{{#foo elementId="id-00"}}{{/foo}}',
      },
    },

    {
      template: '{{#foo elementId="id-00"}}{{/foo}}<div id="id-00"></div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 39,
        source: 'id="id-00"',
      },
    },

    {
      template: '<div id={{"id-00"}}></div>{{#foo elementId="id-00"}}{{/foo}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 26,
        source: '{{#foo elementId="id-00"}}{{/foo}}',
      },
    },

    {
      template: '{{#foo elementId="id-00"}}{{/foo}}<div id={{"id-00"}}></div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 39,
        source: 'id={{"id-00"}}',
      },
    },

    {
      template: '<div id="id-{{"00"}}"></div>{{#foo elementId="id-00"}}{{/foo}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 28,
        source: '{{#foo elementId="id-00"}}{{/foo}}',
      },
    },

    {
      template: '{{#foo elementId="id-00"}}{{/foo}}<div id="id-{{"00"}}"></div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 39,
        source: 'id="id-{{"00"}}"',
      },
    },

    {
      template: '{{#foo elementId="id-00"}}{{/foo}}{{#bar elementId="id-00"}}{{/bar}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 34,
        source: '{{#bar elementId="id-00"}}{{/bar}}',
      },
    },

    // Source Node: MustacheStatement
    {
      template: '{{foo id="id-00"}}{{foo id="id-00"}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 18,
        source: '{{foo id="id-00"}}',
      },
    },

    // MustacheStatement with NumberLiteral
    {
      template: '<div id={{1234}}></div><div id={{1234}}></div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 28,
        source: 'id={{1234}}',
      },
    },

    // MustacheStatement with Dynamic/Computed Value
    {
      template: '<div id={{this.divId00}}></div><div id={{this.divId00}}></div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 36,
        source: 'id={{this.divId00}}',
      },
    },
  ],
});
