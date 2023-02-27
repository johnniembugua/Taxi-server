const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const axios = require('axios');
const fetch = require("node-fetch");
const crypto = require("crypto");
const otpGenerator = require('otp-generator');
const validateMongoDbID = require("../utils/validateMongoDbId");
const createUser = async (req, res) => {
    try {
        const phone = req.body.phone;

        if (!phone) {
            return res.status(406).json({ message: "phone number required" });
        }
        if (!req.body.userName) {
            return res.status(406).json({ message: "userName required" })
        }
        if (!req.body.email) {
            return res.status(406).json({ message: "Email required" })
        }
        const findUser = await User.findOne({ phone });
        if (findUser) {
            return res.status(400).json({
                message: "User with same Phone/Email already exists"
            });

        }

        const newUser = await User.create(req.body);

        res.json(newUser);

    } catch (e) {
        res.status(500).json({ message: e.message })
    }
};


const loginUser = async (req, res) => {
    try {
        const { phone, password } = req.body;
        if (!phone) {
            return res.status(406).json({ message: "phone number required" })
        }
        const findUser = await User.findOne({ phone });
        if (findUser && await findUser.isPasswordMatched(password)) {
            const token = jwt.sign({ id: findUser._id }, process.env.JWT_SECRET);
            res.json({ token, ...findUser.toJSON() });
        }
        else {
            return res.status(400).json({ message: "Inavalid Credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const otpLogin = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) {
            return res.status(406).json({ message: "phone number required" })
        }
        const findUser = await User.findOne({ phone });
        if (!findUser) {

            return res.status(400).json({ message: "User with this phone number does not exist" });

        }


        // const response = await axios({
        //     method: "post",
        //     url: "https://accounts.jambopay.com/auth/token",
        //     headers: {
        //         "Content-Type": "application/x-www-form-urlencoded"
        //     },
        //     data: {
        //         "grant_type": "client_credentials",
        //         "client_id": "qzuRm3UxXShEGUm2OHyFgHzkN1vTkG3kIVGN2z9TEBQ=",
        //         "client_secret": "36f74f2b-0911-47a5-a61b-20bae94dd3f1gK2G2cWfmWFsjuF5oL8+woPUyD2AbJWx24YGjRi0Jm8="
        //     }
        // })

        // console.log(response);
        // const sendOtpRes = axios({
        //     method: "post",
        //     url: "https://swift.jambopay.co.ke/api/public/send",
        //     headers: {
        //         "Authorization": `Bearer ${response.data.access_token}`,
        //         "Content-Type": "application/json"
        //     },
        //     data: {
        //         "contact": "0799005059",
        //         "message": "Your verification code is 5677",
        //         "callback": "http://localhost:5200/api",
        //         "sender_name": "PASANDA"
        //     }
        // })
        //     ;
        // console.log(sendOtpRes.status);

        // console.log(sendOtpRes.data);
        // const token = jwt.sign({ id: findUser?._id }, process.env.JWT_SECRET);
        // res.json({ token, ...findUser.toJSON() });

        createOtp(res, phone, findUser);



    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const verifyOTP = async (req, res) => {
    try {
        const { phone, otp, hash } = req.body;
        if (!phone) {
            return res.status(406).json({ message: "phone number required" })
        }
        const findUser = await User.findOne({ phone });
        if (!findUser) {

            return res.status(400).json({ message: "User with this phone number does not exist" });

        }

        oTPverify(res, hash, phone, otp);
        const token = jwt.sign({ id: findUser._id }, process.env.JWT_SECRET);
        res.json({ token, ...findUser.toJSON() });


    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization;
        if (!token) return res.json(false);
        const myToken = token.split(' ')[1];
        const verified = jwt.verify(myToken, process.env.JWT_SECRET);
        if (!verified) return res.json(false);
        const user = await User.findById(verified.id);
        if (!user) return res.json(false);
        res.json(true);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

const updatePassword = async (req, res) => {
    const { userId } = req.user;

    const password = req.body.password;
    console.log(userId);
    try {
        const user = await User.findById(userId);
        if (password) {
            user.password = password;
            const updatedPassword = await user.save();
            res.json(updatedPassword);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function createOtp(res, phone) {
    const otp = otpGenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false, });

    const ttl = 5 * 60 * 1000;
    const expires = Date.now() + ttl;
    const data = `${phone}.${otp}.${expires}`;
    const hash = crypto.createHmac("sha256", "key").update(data).digest("hex");
    const fullHash = `${hash}.${expires}`;
    console.log(`Your OTP is ${otp}`);

    //SEND SMS
    return res.status(200).json({ hash: fullHash, otp: otp });
}

async function oTPverify(res, hash, phone, otp) {
    let [hashValue, expires] = hash.split('.');
    let now = Date.now();
    if (now > parseInt(expires)) return res.status(500).json({ message: "OTP Expired" });
    let data = `${phone}.${otp}.${expires}`;
    const newCalculateHash = crypto.createHmac("sha256", "key").update(data).digest("hex");
    if (newCalculateHash === hashValue) {
        return;
    }
    return res.status(500).json({ message: "Invalid OTP" });

}
module.exports = {
    createUser,
    loginUser,
    otpLogin,
    verifyOTP,
    verifyToken,
    updatePassword,
}