exports.mainMenu = {
  type: 'template',
  altText: 'Pick an event',
  template: {
    type: 'buttons',
    actions: [
      {
        type: 'postback',
        label: 'Join',
        data: `action=join`
      },
      {
        type: 'postback',
        label: 'Leave',
        data: 'action=leave'
      },
      {
        type: 'postback',
        label: 'List of Player',
        data: 'action=listofplayer'
      },
      {
        type: 'postback',
        label: 'Play a Game',
        data: 'action=play'
      }
    ],
    title: 'Pick an Event',
    text: 'You should be brave and be honest'
  }
}