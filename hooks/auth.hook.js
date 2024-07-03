import supabase from "../config/supabase.js";
import { errorResponseHandler } from "../handler/responseHandler.js";

export async function authMiddleware(req, reply) {
    try {
        const bearerToken = req.headers.authorization
        if (!bearerToken) throw new Error("Invalid Token")
        const token = bearerToken?.split("Bearer ")[1]
        const { error, data } = await supabase.auth.getUser(token);
        if (error || !token || !data?.user) {
            throw new Error("Invalid Token");
        }
        req.user = data.user;
    } catch (err) {
        errorResponseHandler(reply, 403, err)
        return reply;
    }
}