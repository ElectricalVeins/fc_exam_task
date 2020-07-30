const db = require('../../models/index');
const { Op } = require("sequelize");
const ServerError = require('../../errors/ServerError');

module.exports.getAllTimers = async () => {
    return await db.Timers.findAll(
  /*       {
        where: {
            [Op.gt]: {
                finalDate: new Date()
            },
        }
    } */{raw: true}
    );
};

module.exports.findAllUserTimers = async (userId) => {
    return await db.Timers.findAll({ where: { userId } });
};

module.exports.createTimer = async (timer) => {
    return await db.Timers.create({ ...timer }, {raw: true});
};

module.exports.softDeleteTimer = async (id, userId, transaction) => {
    const result = await db.Timers.destroy({ where: { id, userId }/* , transaction */ });
    console.log(result);
    if (result !== 1) {
        throw new ServerError('cannot delete timer');
    }
    return result;
};

module.exports.updateTimer = async (data, id, transaction) => {
    const [updatedCount, [updatedTimer]] = await db.Timers.update(data, { where: { id }, returning: true, transaction });
    if (updatedCount !== 1) {
        throw new ServerError('cannot update timer');
    }
    return updatedTimer.dataValues;
};
