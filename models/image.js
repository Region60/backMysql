const {Schema, model} = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")


const image = new Schema({
    originalname: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    }
})

image.plugin(mongoosePaginate)

module.exports = model('Image', image)