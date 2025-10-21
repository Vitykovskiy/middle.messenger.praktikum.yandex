export const template = `
{{#if sidebar}}
    <div class="app-layout__sidebar">
        {{{sidebar}}}
    </div>
{{/if}}
 <div id="routerView"></div>
{{{modal}}}
`;
