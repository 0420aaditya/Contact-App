import { model, Schema } from "mongoose"

let userSchema = Schema({
    name: {
        type: String,
        required: [true, "name is required."],
    },
    email: {
        type: String,
        required: [true, "email is required."],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "password is required."],
    },
})

let User = model("User", userSchema)
export default User
