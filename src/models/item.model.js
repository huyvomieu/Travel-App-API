const Joi = require("joi");

const ItemModel = Joi.object({
        address: Joi.string().required(),
        key: Joi.string().allow('', null),
        itemsId: Joi.number(),
        bed: Joi.number().required(),
        dateTour: Joi.string().required(),
        description: Joi.string().required(),
        distance: Joi.string().required(), 
        duration: Joi.string().required(),
        pic: Joi.string().required(),
        price: Joi.number().required(), 
        score: Joi.number().required(),
        timeTour: Joi.string().required(),
        title: Joi.string().required(),
        tourGuideId: Joi.string().required(),
        tourGuideName: Joi.string().required(),
        tourGuidePhone: Joi.string().required(),
        tourGuidePic: Joi.string().required().allow('', null),
        categoryId: Joi.number(),
        deleted: Joi.boolean().default(false),
        status: Joi.number().default(1),
        created: Joi.date().default(new Date().toISOString()),
});

module.exports = ItemModel;