const db = require('../model')

exports.findOneOrCreate = async (groupLineId) => {
  let group = await db.TrGroup.findOne({ lineId: groupLineId })
  if (!group)
    group = await db.TrGroup.create({
      lineId: groupLineId
    })

  return group
}