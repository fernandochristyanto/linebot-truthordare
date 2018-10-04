const { extractObjectFromPostbackData } = require('../../service/data')
const { ACTION } = require('../../data/action')
const db = require('../../model')
const client = require('../../client')
const { onPlayerJoinMessage } = require('../../template/pregame/onPlayerJoinMessage')

module.exports = async (event) => {
  const data = extractObjectFromPostbackData(event.postback.data)
  const action = data.action

  switch (action) {
    case ACTION.JOIN:
      return await handleJoin(event, data);
    case ACTION.LEAVE:
      return;
    case ACTION.LISTOFPLAYER:
      return;
    case ACTION.PLAY:
      return;
    case ACTION.F2F:
      return;
    case ACTION.LDR:
      return;
    case ACTION.TRUTH:
      return;
    case ACTION.DARE:
      return
    case ACTION.TRUTHVALIDATION:
      return
  }
}

async function handleJoin(event, data) {
  const userLineId = event.source.userId
  const groupLineId = event.source.groupId

  let group = await db.TrGroup.findOne({ lineId: groupLineId })
  if (!group)
    group = await db.TrGroup.create({ lineId: groupLineId })

  let joinedMember = await db.TrGroupMember.findOne({ groupId: group.id, lineId: userLineId })
  const profile = await client.getProfile(userLineId);
  console.log(joinedMember)
  if (!joinedMember) {
    joinedMember = await db.TrGroupMember.create({
      groupId: group.id,
      lineId: userLineId,
      fullName: profile.displayName
    })
  }

  return client.replyMessage(event.replyToken, onPlayerJoinMessage(profile.displayName))
}