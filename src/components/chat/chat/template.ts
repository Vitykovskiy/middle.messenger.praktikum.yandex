export const template = `
{{#if showDialog}} 
      {{{header}}}
      {{{dialog}}}
      {{{footer}}}
{{else}}
      {{{emptyMessage}}}
{{/if}}
`;
