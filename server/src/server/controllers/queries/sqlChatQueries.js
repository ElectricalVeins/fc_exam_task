const db = require('../../models');
const badRequestError = require('../../errors/BadRequestError');

module.exports.getCatalogById = async (id) => {
  const catalog = await db.Catalogs.findOne({
    where: {
      id,
    },
    include: [{
      model: db.Conversations,
      required: true,
      attributes: ['id'],
    }],
  });
  if (!catalog || catalog.length === 0) {
    throw new badRequestError('Catalog not found!');
  }
  return catalog;
};
