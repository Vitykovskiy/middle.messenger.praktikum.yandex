export const template = `
  <label class="ui-input__label" for="{{name}}">{{label}}</label>
  {{{input}}}
  {{{divider}}}
  {{#if error}}
    <span class="ui-input__error">{{error}}</span>
  {{/if}}
`;
