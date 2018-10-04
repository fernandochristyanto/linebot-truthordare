const { MESSAGE_TYPE } = require('../../data/messagingAPI/messageType')

exports.onPlayerLeaveMessage = (fullName) => {
  return {
    type: MESSAGE_TYPE.TEXT,
    text: `Goodbye ${fullName}, I hope we can play together another time`
  }
}