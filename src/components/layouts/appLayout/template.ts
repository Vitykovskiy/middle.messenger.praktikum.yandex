export const template = `
{{#if sidebar}}
    <div class="main-layout__sidebar">
        {{{sidebar}}}
    </div>
{{/if}}
{{{ content }}}`;
