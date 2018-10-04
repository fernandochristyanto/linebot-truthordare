const { MESSAGE_TYPE } = require('../../data/messagingAPI/messageType')

exports.startingGameButtons = {
  type: 'template',
  altText: 'Are you playing offline with your friends or online?',
  template: {
    type: 'buttons',
    actions: [
      {
        type: 'postback',
        label: 'F2F',
        data: 'action=f2f'
      },
      {
        type: 'postback',
        label: 'LDR',
        data: 'action=ldr'
      }
    ],
    title: 'Do you see your friends?',
    text: 'Face 2 Face | Long Distance Relationship'
  }
}