const db = require('../../models/index');
const { Op } = require("sequelize");
const ServerError = require('../../errors/ServerError');

module.exports.getWorkingTimers = async () => {
    return await db.Timers.findAll({
        where: {
            finalDate: {
                [Op.gte]: new Date()
            },
        }
    }, { raw: true }
    );
};

module.exports.findTimerById = async (id) => {
    return await db.Timers.findByPk(id);
};

module.exports.findAllUserTimers = async (userId) => {
    return await db.Timers.findAll({ where: { userId } });
};

module.exports.createTimer = async (timer) => {
    return await db.Timers.create({ ...timer }, { raw: true });
};

module.exports.softDeleteTimer = async (id, userId, transaction) => {
    const result = await db.Timers.destroy({ where: { id, userId }/* , transaction */ });
    if (result !== 1) {
        throw new ServerError('cannot delete timer');
    }
    return result;
};

module.exports.updateTimer = async (data, id, userId, transaction) => {
    const [updatedCount, [updatedTimer]] = await db.Timers.update(data, { where: { id, userId }, returning: true, transaction });
    if (updatedCount !== 1) {
        throw new ServerError('cannot update timer');
    }
    return updatedTimer.dataValues;
};