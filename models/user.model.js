const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
    {

        organizationId: {
            type: mongoose.Types.ObjectId,
            ref: "Organization",
        },
        userName: {
            required: true,
            type: String,
            trim: true,
        },
        socketId: {
            type: String,
            required: false
        },
        email: {
            required: true,
            type: String,
            unique: true,
        },
        phone: {
            required: true,
            type: String,
            unique: true,
        },
        password: {
            required: false,
            type: String,
        },
        code: {
            required: false,
            type: Number,
        },
        role: {
            type: String,
            default: "user"
        },
        verified: {
            type: Boolean,
            required: false,
            default: false
        },
        address: {
            type: mongoose.Types.ObjectId,
            ref: "Address",
        }
    },
    {
        toJSON: {
            transform: function (doc, ret) {
                ret.userId = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                delete ret.password;
            }
        },
        timestamps: true,
    }
);

//Encrypt password before storing
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
});

//Check if password matches
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;