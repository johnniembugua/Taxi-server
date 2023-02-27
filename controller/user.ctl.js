const Address = require("../models/address.model");
const User = require("../models/user.model");
const validateMongoDbID = require("../utils/validateMongoDbId");


const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);


    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (user) {
            const address = await Address.findById(user.address);

            res.json({ user, ...address.toJSON() });
        } else {
            res.status(404).json({ message: `User with id ${id} not found` });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}


const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndRemove(id);
        if (user) {
            res.json({ message: "User deleted Successfully" })
        } else {
            res.status(404).json({ message: `User with id ${id} not found` });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateUser = async (req, res) => {
    const { id } = req.params;

    try {

        const updateUser = await User.findByIdAndUpdate(id, req.body, { new: true });

        if (updateUser) {
            res.json(updateUser);

        } else {
            res.status(404).json({ message: `Failed to find and update user ${id}` });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const verifyUser = async (req, res) => {
    const { id } = req.params;

    try {
        const verifyUser = await User.findByIdAndUpdate(id, { verified: true }, { new: true });
        res.json({ message: `${verifyUser.userName} Verified` });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const createAddress = async (req, res) => {
    const { location, longitude, latitude } = req.body;

    if (!location) {
        return res.status(400).json({ message: "Location required" });
    }
    try {
        const address = new Address(req.body);
        await address.save();
        res.json(address);



    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports = {
    getAllUsers,
    getUser,
    deleteUser,
    updateUser,
    verifyUser,
    createAddress,
}