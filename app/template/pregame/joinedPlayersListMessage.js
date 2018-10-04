const { MESSAGE_TYPE } = require('../../data/messagingAPI/messageType')

exports.joinedPlayerListMessage = (joinedPlayers) => {
  return {
    type: MESSAGE_TYPE.TEXT,
    text: mapJoinedPlayersToMessage(joinedPlayers)
  }
}

function mapJoinedPlayersToMessage(joinedPlayers) {
  if (joinedPlayers.length == 0)
    return "No player has joined the game :("

  let text = 'Here is the list of players who are brave and honest :\n'
  joinedPlayers.forEach((player) => {
    text += `- ${player.fullName}\n`
  })
  return text
}