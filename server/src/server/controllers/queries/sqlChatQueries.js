const db = require('../../models');
const badRequestError = require('../../errors/BadRequestError');

module.exports.getCatalogById = async (id) => {
  return await db.Catalogs.findOne({
    where: {
      id,
    },
    include: [{
      model: db.Conversations,
      //required: true,
      attributes: ['id'],
    }],
  });
};
