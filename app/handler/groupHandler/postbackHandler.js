const { extractObjectFromPostbackData } = require('../../service/data')
const { ACTION } = require('../../data/action')
const db = require('../../model')
const client = require('../../client')
const { onPlayerJoinMessage } = require('../../template/pregame/onPlayerJoinMessage')
const { joinedPlayerListMessage } = require('../../template/pregame/joinedPlayersListMessage')
const ObjectId = require('mongodb').ObjectId;
const { MESSAGE_TYPE } = require('../../data/messagingAPI/messageType')
const { findOneOrCreate, endGame } = require('../../service/trGroup')
const { startingGameButtons } = require('../../template/pregame/startingGameButtons')
const { onRandomizePlayerMessage } = require('../../template/ingame/onRandomizeTargetMessage')
const { onTargetRandomizedButtons } = require('../../template/ingame/onTargetRandomizedButtons')
const { onRandomizeQuestionerMessage } = require('../../template/ingame/onRandomizeQuestionerMessage')
const { onQuestionerRandomizedMessage } = require('../../template/ingame/onQuestionerRandomizedMessage')
const { mainMenu } = require('../../template/pregame/mainMenuButtons')

const MINIMAL_JOIN_PLAYER = 3;

module.exports = async (event) => {
  const data = extractObjectFromPostbackData(event.postback.data)
  const action = data.action

  switch (action) {
    case ACTION.JOIN:
      return await handleJoin(event, data);
    case ACTION.LEAVE:
      return await handleLeave(event, data)
    case ACTION.LISTOFPLAYER:
      return await handleListAllPlayers(event);
    case ACTION.PLAY:
      return await handlePlayAGame(event)
    case ACTION.F2F:
      return await f2fOrldr(event, data)
    case ACTION.LDR:
      return await f2fOrldr(event, data)
    case ACTION.TRUTH:
      return await handleTruthSelected(event, data)
    case ACTION.DARE:
      return
    case ACTION.TRUTHVALIDATION:
      return await handleTruthValidation(event, data)
  }
}

async function handleTruthValidation(event, data) {
  const group = await db.TrGroup.findOne({ lineId: event.source.groupId })
  if (data.valid) {
    await client.pushMessage(group.lineId, {
      type: MESSAGE_TYPE.TEXT,
      text: "Game has ended!"
    })
    await endGame(group.lineId)
    await client.pushMessage(group.lineId, mainMenu)
  }
  else {
    group.state = ACTION.TRUTH
    await group.save()
    await client.pushMessage(group.lineId, {
      type: MESSAGE_TYPE.TEXT,
      text: "Answer is not acceptable, we are still waiting for your answer..."
    })
    client.pushMessage(group.lineId, onTargetAnsweredTruthQuestionButtons)
  }
}

async function handleTruthSelected(event, data) {
  const group = await findOneOrCreate(event.source.groupId)

  if (group.state == ACTION.LDR || group.state == ACTION.F2F) {
    const targetMember = await db.TrGroupMember.findOne({ groupId: group.id, target: true })
    if (targetMember.target && targetMember.lineId == event.source.userId) { // beneran target
      group.state = ACTION.TRUTH_AWAITINGQUESTION
      await group.save()

      await client.pushMessage(event.source.groupId, onRandomizeQuestionerMessage)
      await randomizeQuestionerAndAnnounce(event, group, targetMember)
    }
  }
}

async function randomizeQuestionerAndAnnounce(event, group, target) {
  const remainingGroupMembers = await db.TrGroupMember.find({
    groupId: group.id,
    $or: [{ target: false }, { target: undefined }]
  })

  const randomQuestionerIndex = Math.floor(Math.random() * remainingGroupMembers.length)
  const questioner = remainingGroupMembers[randomQuestionerIndex]
  questioner.questioner = true
  await questioner.save()

  await client.pushMessage(event.source.groupId, onQuestionerRandomizedMessage(questioner, target))
}

async function f2fOrldr(event, data) {
  const groupLineId = event.source.groupId
  const group = await findOneOrCreate(groupLineId)

  if (!group.state) {
    switch (data.action) {
      case ACTION.F2F:
        group.state = ACTION.F2F
        break;
      case ACTION.LDR:
        group.state = ACTION.LDR
        break;
    }

    group.ingame = true
    await group.save()

    // Push message to group
    await client.pushMessage(groupLineId, onRandomizePlayerMessage)

    await randomizeTargetAndAnnounce(event, group)
  }
}

async function randomizeTargetAndAnnounce(event, group) {
  const joinedGroupMembers = await db.TrGroupMember.find({ groupId: group.id })
  const randomTargetIndex = Math.floor(Math.random() * joinedGroupMembers.length)
  const chosenTarget = joinedGroupMembers[randomTargetIndex]
  chosenTarget.target = true;
  await chosenTarget.save()

  // send reply with options: truth / dare (if f2f)
  const isOffline = (group) => {
    return group.state == ACTION.F2F
  }

  client.pushMessage(group.lineId, onTargetRandomizedButtons(chosenTarget, isOffline(group)))
}

async function handlePlayAGame(event) {
  const group = await findOneOrCreate(event.source.groupId)
  const joinedMembers = await db.TrGroupMember.find({ groupId: group.id })
  if (group.ingame)
    return null

  if (joinedMembers.length < MINIMAL_JOIN_PLAYER) {
    return client.replyMessage(event.replyToken, {
      type: MESSAGE_TYPE.TEXT,
      text: `Minimum player to start a game is 3. Only ${joinedMembers.length} has joined.`
    })
  }
  else {
    return client.replyMessage(event.replyToken, startingGameButtons)
  }
}

async function handleJoin(event, data) {
  const userLineId = event.source.userId
  const groupLineId = event.source.groupId

  let group = await findOneOrCreate(groupLineId)

  if (group.ingame)
    return null;

  let joinedMember = await db.TrGroupMember.findOne({ groupId: group.id, lineId: userLineId })
  const profile = await client.getGroupMemberProfile(groupLineId, userLineId);
  if (!joinedMember) {
    joinedMember = await db.TrGroupMember.create({
      groupId: group.id,
      lineId: userLineId,
      fullName: profile.displayName
    })

    group.groupMembers.push(joinedMember)
    await group.save()
  }

  return client.replyMessage(event.replyToken, onPlayerJoinMessage(profile.displayName))
}

async function handleLeave(event, data) {
  let group = await findOneOrCreate(event.source.groupId)

  if (group.ingame)
    return null;

  const player = await db.TrGroupMember.findOne({ lineId: event.source.userId, groupId: group.id })

  if (!player) {
    // player has not joined
    return client.replyMessage(event.replyToken, {
      type: MESSAGE_TYPE.TEXT,
      text: "Player has not joined the game"
    })
  }
  else {
    // remove player
    client.replyMessage(event.replyToken, {
      type: MESSAGE_TYPE.TEXT,
      text: `${player.fullName} has left the game.`
    })

    group.groupMembers.remove(player)
    await group.save()
    await db.TrGroupMember.remove({
      lineId: event.source.userId
    })
  }
}

async function handleListAllPlayers(event) {
  let group = await findOneOrCreate(event.source.groupId)
  const joinedPlayers = await db.TrGroupMember.find({ groupId: group.id })
  return client.replyMessage(event.replyToken, joinedPlayerListMessage(joinedPlayers))
}