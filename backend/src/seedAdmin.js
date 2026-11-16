import "dotenv/config"
import bcrypt from "bcrypt"
import mongoose from "mongoose"
import User from "./schema/userSchema.js"

let seedAdmin = async () => {
    await mongoose.connect(process.env.DB_URL)

    let userCount = await User.countDocuments()

    if (userCount > 0) {
        console.log("users already exist, skipping admin seed")
        return
    }

    let hashedPassword = await bcrypt.hash("Admin@123", 10)

    await User.create({
        name: "Admin",
        email: "admin@example.com",
        password: hashedPassword,
    })

    console.log("seeded admin user: admin@example.com")
}

try {
    await seedAdmin()
} catch (error) {
    console.error("admin seed failed:", error.message)
    process.exitCode = 1
} finally {
    await mongoose.disconnect()
}
