const GlobalError = require("./GlobalError");

const sendProductionError = (err, res, statusCode) => {
    if (err.operational) {
        res.status(statusCode).json({
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

const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map(err => err.message);
    const finalErr = errors.join(",");

    return new GlobalError(finalErr, 400);
};

const handleCastError = (err) => {
    return new GlobalError("Provide a valid Object ID!");
}


module.exports = (err, req, res, next) => {
    statusCode = err.statusCode || 500;

    if (process.env.NODE_ENV.trim() === "development") {
        res.status(statusCode).json({
            success: false,
            message: err.message,
            err: err,
            status: statusCode,
            stack: err.stack
        });
    } else if (process.env.NODE_ENV.trim() === "production") {
        if (err.name === "ValidationError") err = handleValidationError(err);
        if (err.name === "CastError") err = handleCastError(err);

        sendProductionError(err, res, statusCode);
    };
};