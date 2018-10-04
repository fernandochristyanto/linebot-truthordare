const { MESSAGE_TYPE } = require('../../data/messagingAPI/messageType')

exports.onQuestionerRandomizedMessage = (questioner, target) => {
  return {
    type: MESSAGE_TYPE.TEXT,
    text: `${questioner.fullName}, what is your question or dare for ${target.fullName}?`
  }
}