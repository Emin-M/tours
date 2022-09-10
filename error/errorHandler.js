const sendProductionError = (err, res) => {
    if (err.operational) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    } else {
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    };
};


module.exports = (err, req, res, next) => {
    statusCode = err.statusCode;

    if (process.env.NODE_ENV.trim() === "development") {
        res.status(statusCode).json({
            success: false,
            message: err.message,
            err: err,
            status: statusCode,
            stack: err.stack
        });
    } else if (process.env.NODE_ENV.trim() === "production") {
        sendProductionError(err, res)
    };
};