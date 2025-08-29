export const template = `
    {{{avatar}}}
    <div class="chat-preview__content">
    <div class="chat-preview__header">
      <div class="chat-preview__username">{{title}}</div>
      <div class="chat-preview__date">{{dateTime}}</div>
    </div>
    <div class="chat-preview__message">
      <div class="chat-preview__text">
        {{#if isOwnerLastMessage}}<b>Вы: </b>{{/if}}
        {{content}}
      </div>
      {{#if unreadedMessagesCount}}
        <div class="chat-preview__counter">
          <div>{{unreadedMessagesCount}}</div>
        </div>
      {{/if}}
    </div>
  </div>
`;
