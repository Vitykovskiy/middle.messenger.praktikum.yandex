export const template = `
<div class="ui-card__header-container">
    {{#if header}}
        <div class="ui-card__header">
            {{{header}}}
        </div>
    {{/if}}
    {{#if isCloseBtn}}
        <div class="ui-card__close-btn">
            {{{closeBtn}}}
        </div>
    {{/if}}
</div>

{{#if content}}
    <div class="ui-card__content">
        {{{content}}}
    </div>
{{/if}}


<div class="ui-card__actions">
    {{{actions}}}
</div>`;
