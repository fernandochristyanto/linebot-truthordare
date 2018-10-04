const db = require('../../model')
const client = require('../../client')
const { mainMenu } = require('../../template/pregame/mainMenuButtons')
const config = require('../../../config')

module.exports = async (event) => {
  if (event.message.text.toLowerCase() == config.botName) {
    const groupLineId = event.source.groupId
    const group = await db.TrGroup.findOne({ lineId: groupLineId })
    if (!group) {
      await db.TrGroup.create({
        lineId: groupLineId
      })
      return client.replyMessage(event.replyToken, mainMenu)
    }
    else {
      // if (group.state)
      //   return null
      return client.replyMessage(event.replyToken, mainMenu)
    }
  }
}