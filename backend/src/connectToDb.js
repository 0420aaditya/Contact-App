import mongoose from "mongoose"

const connectToDb = async () => {
    await mongoose.connect(process.env.DB_URL)
    console.log("connected to database")
}

export default connectToDb
