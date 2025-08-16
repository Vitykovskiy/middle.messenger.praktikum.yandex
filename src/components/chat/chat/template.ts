export const template = `
{{#if dialog}} 
      {{{header}}}
      {{{dialog}}}
      {{{footer}}}
{{else}}
      Выберите чат чтобы отправить сообщение
{{/if}}
`;
