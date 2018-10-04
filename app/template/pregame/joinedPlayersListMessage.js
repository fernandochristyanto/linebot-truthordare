const { MESSAGE_TYPE } = require('../../data/messagingAPI/messageType')

exports.joinedPlayerListMessage = (joinedPlayers) => {
  return {
    type: MESSAGE_TYPE.TEXT,
    text: mapJoinedPlayersToMessage(joinedPlayers)
  }
}

function mapJoinedPlayersToMessage(joinedPlayers) {
  //TODO: map joined players to message (liat mockup)
  let text = 'Here is the list of players who are brave and honest :\n'
  joinedPlayers.forEach((player) => {
    text += `- ${player.fullName}\n`
  })
  return text
}