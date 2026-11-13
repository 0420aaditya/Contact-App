import { model, Schema } from "mongoose"

let contactSchema = Schema({
    firstName: {
        type: String,
        required: [true, "firstName is required."],
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
        required: [true, "phone is required."],
    },
    notes: {
        type: String,
    },
    photo: {
        type: String,
    },
    isFavorite: {
        type: Boolean,
        default: false,
    },
    lastVisitedAt: {
        type: Date,
    },
})

let Contact = model("Contact", contactSchema)
export default Contact
