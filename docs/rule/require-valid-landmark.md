# require-valid-landmark

TODO: context about the problem goes here
ARIA landmarks provide a means to convey a web page's organization and structure by dividing its content into distinct, perceivable areas. Notably, because the page areas defined by ARIA landmarks can be programmatically determined, assistive technologies can use them to ease the burden of whole-page navigation for differently-abled users.

Specifically, ARIA landmarks can be implemented with either:

* Landmark-defining HTML sectioning elements (`<header>Company Name</header>`)
* Landmark-defining role attributes (`<div role="banner">Company Name</div>`)

TODO: what the rule does goes here

## Examples

This rule **forbids** the following:

```hbs
{{!-- TODO: Example 1  --}}
```

```hbs
{{!-- TODO: Example 2  --}}
```

This rule **allows** the following:

```hbs
{{!-- TODO: Example 1  --}}
```

```hbs
{{!-- TODO: Example 2  --}}
```

## Migration

TODO: suggest any fast/automated techniques for fixing violations in a large codebase

* TODO: suggestion on how to fix violations using find-and-replace / regexp
* TODO: suggestion on how to fix violations using a codemod

## Configuration

TODO: exclude this section if the rule has no extra configuration

* object -- containing the following properties:
  * string -- `parameterName1` -- TODO: description of parameter including the possible values and default value
  * boolean -- `parameterName2` -- TODO: description of parameter including the possible values and default value

## Related Rules

* [TODO-related-rule-name1](related-rule-name1.md)
* [TODO-related-rule-name2](related-rule-name2.md)

## References

* TODO: link to relevant documentation goes here
* TODO: link to relevant function spec goes here
* TODO: link to relevant guide goes here
