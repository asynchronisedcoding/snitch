import dns from "node:dns"
dns.setServers(["8.8.8.8", "8.8.4.4"])


import app from "./app/app.js"
import { connectDB } from "./config/db.js"

try {
    await connectDB()
    console.log("DB connected successfully")
} catch (err) {
    console.error("Failed to connect to DB:", err.message)
    process.exit(1)
}

app.listen(3000, ()=>{
    console.log("server is running on port 3000")
})