exports.onTargetRandomizedButtons = (targetPlayer, isOffline) => {
  return {
    type: 'template',
    altText: 'Truth / Dare',
    template: {
      type: 'buttons',
      actions: getButtonsArray(targetPlayer, isOffline),
      title: 'Player Name',
      text: getText(isOffline)
    }
  }
}

function getText(isOffline) {
  return isOffline ? "Do you want to be brave or be honest?" : "Do you want to be honest? Oh no, You have to be *evil smile*"
}

function getButtonsArray(targetPlayer, isOffline) {
  let buttonsArray = [
    {
      type: 'postback',
      label: 'Truth',
      data: `action=truth&targetLineId=${targetPlayer.lineId}`
    }
  ]

  if (isOffline)
    buttonsArray.push({
      type: 'postback',
      label: 'Dare',
      data: `action=dare&targetLineId=${targetPlayer.lineId}`
    })

  return buttonsArray
}