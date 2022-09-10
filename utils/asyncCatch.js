const asyncCatch = (callback) => {
    return (req, res) => {
        callback(req, res).catch((err) => res.json({
            success: false,
            message: err.message
        }));
    }
};

module.exports = {
    asyncCatch
};