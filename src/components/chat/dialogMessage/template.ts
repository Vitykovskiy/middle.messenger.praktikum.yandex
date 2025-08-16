export const template = `
{{#if text}}
    <div class="message__text">
        {{text}}
        <div class="message__view-info {{#if isOutgoing}}message__view-info_outgoing{{/if}}">{{time}}</div>
    </div>
{{/if}}

{{#if imgUrl}}
    {{#if imgUrl}}
        <div class="message__image" >
            <img src="/src/assets/images/otkrytka-privet.jpg" alt="img">
            <div class="message__view-info message__view-info_background">{{time}}</div>
        </div>
    {{/if}}
{{/if}}
`;
