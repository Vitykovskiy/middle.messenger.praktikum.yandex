export const template = `
{{#if titleSlot}}
    <div class="ui-card__title-slot">
        {{{titleSlot}}}
    </div>
{{/if}}
{{#if title}}
    <div class="ui-card__title">
        {{title}}
    </div>
{{/if}}
{{#if contentSlot}}
    <div class="ui-card__content-slot">
        {{{contentSlot}}}
    </div>
{{/if}}
{{#if content}}
    <div class="ui-card__content">
        {{content}}
    </div>
{{/if}}
<div class="ui-card__actions">
    {{{actions}}}
</div>`;
