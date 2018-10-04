const { MESSAGE_TYPE } = require('../../data/messagingAPI/messageType')

exports.onRandomizeQuestionerMessage = [{
  type: MESSAGE_TYPE.TEXT,
  text: "Randomizing questioner... Who will give you a question?"
}, {
  type: MESSAGE_TYPE.TEXT,
  text: "*jeng* *jeng* *jeng*"
}
]