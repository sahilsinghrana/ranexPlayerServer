import supabase from "../config/supabase.js";
import { USER_ROLES } from "../controller/auth.controller.js";

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email) throw new Error("Email not provided! ADD {ADMIN_EMAIL} in your env file")
if (!password) throw new Error("password not provided! ADD {ADMIN_PASSWORD} in your env file")

try {
    await supabase.auth.admin.createUser({
        email: email,
        password: password,
        user_metadata: {
            first_name: "Admin",
            last_name: "User",
            userRole: USER_ROLES.ADMIN
        }
    })
    console.log("Successfully created admin user!")
    process.exit(1)
} catch (err) {
    console.log(err)
    process.exit(0)
}