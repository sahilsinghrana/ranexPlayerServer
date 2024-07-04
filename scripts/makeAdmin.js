import 'dotenv/config'

import { USER_ROLES } from "../controller/auth.controller.js";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = `${process.env.SUPABASE_URL}`;
const supabaseKey = `${process.env.SUPABASE_SERVICE_KEY}`;

const supabase = createClient(supabaseUrl, supabaseKey);

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email) throw new Error("Email not provided! ADD {ADMIN_EMAIL} in your env file")
if (!password) throw new Error("password not provided! ADD {ADMIN_PASSWORD} in your env file")

async function main() {
    return supabase.auth.admin.createUser({
        email: email,
        password: password,
        user_metadata: {
            first_name: "Admin",
            last_name: "User",
            userRole: USER_ROLES.ADMIN
        },
        email_confirm : true
    }).then(({ data, error }) => {
        if (error) throw new Error(error);
        console.log("Successfully created admin user!", data)
        process.exit(1)
    }).catch(err => {
        console.log(err)
        process.exit(1)
    })

}

main();