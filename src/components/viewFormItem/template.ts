export const template = `
  {{#if label}}<div class="view-form__key">{{label}}</div>
  {{else}}
    {{labelSlot}}
  {{/if}}
  {{#if value}}<div class="view-form__value">{{value}}</div>{{/if}}
`;
