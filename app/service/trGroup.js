const db = require('../model')

exports.findOneOrCreate = async (groupLineId) => {
  let group = await db.TrGroup.findOne({ lineId: groupLineId })
  if (!group)
    group = await db.TrGroup.create({
      lineId: groupLineId
    })

  return group
}

exports.endGame = async (groupLineId) => {
  let group = await db.TrGroup.findOne({ lineId: groupLineId })
  group.state = undefined;
  group.question = undefined
  await group.save()
  await db.TrGroupMember.update({ groupId: group.id }, { target: undefined, questioner: undefined }, { multi: true })
}