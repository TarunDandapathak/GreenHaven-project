const Joi = require("joi");

const placeValidation = Joi.object({

    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().min(1).required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    image: Joi.string().allow("", null)
});

const reviewValidation = Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),
        comment: Joi.string().required()
    })
}).required()



const bookingSchema = Joi.object({
    "checkInDate": Joi.date().required(),
    "checkOutDate": Joi.date().greater(Joi.ref("checkInDate")).required()
});

module.exports = { placeValidation, reviewValidation, bookingSchema };