const db = require('../../model')
const client = require('../../client')
const { mainMenu } = require('../../template/pregame/mainMenuButtons')
const config = require('../../../config')
const { ACTION } = require('../../data/action')
const { findOneOrCreate } = require('../../service/trGroup')
const { MESSAGE_TYPE } = require('../../data/messagingAPI/messageType')

module.exports = async (event) => {
  const group = await findOneOrCreate(event.source.groupId)
  if (group.state) {
    switch (group.state) {
      case ACTION.TRUTH_AWAITINGQUESTION:
        return await handleTruthAwaitingQuestion(event, group)
      case ACTION.DARE_AWAITINGQUESTION:
    }
  }
  else if (event.message.text.toLowerCase() == config.botName) {
    return client.replyMessage(event.replyToken, mainMenu)
  }
}


async function handleTruthAwaitingQuestion(event, group) {
  const userSenderLineId = event.source.userId
  const questioner = await db.TrGroupMember.findOne({ groupId: group.id, questioner: true })

  if (questioner.lineId == userSenderLineId) {
    const question = event.message.text
    group.question = question
    group.state = ACTION.TRUTH
    await group.save()

    const target = await db.TrGroupMember.findOne({ groupId: group.id, target: true })
    client.pushMessage(event.source.groupId, {
      type: MESSAGE_TYPE.TEXT,
      text: `Question : ${question}\n\n${target.fullName}, your answer please`
    })
  }
}