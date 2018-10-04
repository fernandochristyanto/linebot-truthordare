const { MESSAGE_TYPE } = require('../../data/messagingAPI/messageType')

exports.onPlayerJoinMessage = (fullName) => {
  return {
    type: MESSAGE_TYPE.TEXT,
    text: `${fullName} has joined the game.`
  }
}