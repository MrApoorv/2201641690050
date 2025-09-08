import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export async function Log(stack, level, pkg, message) {
    try {
        const response = await axios.post(
            "http://20.244.56.144/evaluation-service/logs",
            { stack, level, package: pkg, message },
            {
                headers: {
                    Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
                },
            }
        );
        console.log("Log sent:", response.data);
    } catch (err) {
        console.error("Log failed:", err.response?.data || err.message);
    }
}
