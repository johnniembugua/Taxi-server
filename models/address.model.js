const mongoose = require("mongoose");

const addressSchema = mongoose.Schema(
    {
        location: {
            required: true,
            type: String,
            trim: true,
        },
        longitude: {
            required: true,
            type: Number,

        },
        latitude: {
            required: true,
            type: Number,

        },
    },
    {
        toJSON: {
            transform: function (doc, ret) {
                ret.addressId = ret._id.toString();
                delete ret._id;
                delete ret.__v;

            }
        },
        timestamps: true,
    }
);

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;