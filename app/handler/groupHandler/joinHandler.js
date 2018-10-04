const db = require('../../model')
const client = require('../../client')
const { welcomeMessage } = require('../../template/join/welcomeMessage')
const { welcomeSticker } = require('../../template/join/welcomeSticker')

module.exports = async (event) => {
  const group = await db.TrGroup.find({ lineId: event.source.groupId })
  if (group.length == 0) {
    // insert group
    await db.TrGroup.create({
      lineId: event.source.groupId,
    })
  }

  client.pushMessage(event.source.groupId, [
    welcomeMessage,
    welcomeSticker
  ])
}