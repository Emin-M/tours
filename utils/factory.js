const {
    asyncCatch
} = require("./asyncCatch");
const GlobalError = require("../error/GlobalError");

//! factory function for document deleting
const deleteOne = (Model) => asyncCatch(async (req, res, next) => {
    const id = req.params.id;

    //! deleting document
    const deletedDocument = await Model.findByIdAndRemove({
        _id: id,
        creator: req.user._id,
    });
    if (!deletedDocument) return next(new GlobalError("Invalid ID", 404));

    res.json({
        success: true,
        message: "document deleted"
    });
});

//! factory function for getting one document
const getOne = (Model) => asyncCatch(async (req, res, next) => {
    const id = req.params.id;
    const document = await Model.findById(id);

    if (!document) return next(new GlobalError("Invalid ID", 404));

    res.json({
        success: true,
        data: {
            document
        }
    });
});

const getMe = (req, res, next) => {
    req.params.id = req.user._id;
    next();
};

module.exports = {
    deleteOne,
    getOne,
    getMe
};