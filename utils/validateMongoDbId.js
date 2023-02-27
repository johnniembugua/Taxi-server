const mongoose = require("mongoose");

const validateMongoDbID = async (res, id) => {
    const isValid = await mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
        return res.status(406).json({ message: "This id is not valid or not found" });

    }

    //throw new Error(`This id is not valid or not found`)

};

module.exports = validateMongoDbID;
