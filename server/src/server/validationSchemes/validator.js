module.exports.validator = schema => async (req, res, next) => {
    try {
        await schema.validate(req.body); 
        next();
    } catch (err) {
        next(err);
    }
};