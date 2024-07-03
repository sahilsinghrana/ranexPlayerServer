import { error } from "console";
import supabase from "../config/supabase.js";
import { errorResponseHandler, successResponseHandler } from "../handler/responseHandler.js";

export async function loginController(req, reply) {
    const { email, password } = req.body;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) {
            errorResponseHandler(reply, 500, error)
        } else
            successResponseHandler(reply, data)
    } catch (err) {
        errorResponseHandler(reply, 500, err)

    }
}

export async function signupController(req, reply) {

    const { email, password } = req.body;
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                emailRedirectTo: 'https://example.com/welcome',
            },
        })
        if (error) {
            errorResponseHandler(reply, 500, error)
        } else
            successResponseHandler(reply, data)
    } catch (err) {
        errorResponseHandler(reply, 500, err)
    }
}


export async function logoutController(req, reply) {
    try {
        const { error } = await supabase.auth.signOut()
        if (error) {
            errorResponseHandler(reply, 500, error)
        } else
            successResponseHandler(reply, "Signed out successfully!")
    } catch (err) {
        errorResponseHandler(reply, 500, err)
    }
}