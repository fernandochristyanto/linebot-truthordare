const { MESSAGE_TYPE } = require('../../data/messagingAPI/messageType')

exports.onQuestionerSubmittedTruthQuestionMessage = (target, question) => {
  return {
    type: MESSAGE_TYPE.TEXT,
    text: `Truth question : ${question}.\n\n${target.fullName}, your answer please...`
  }
}