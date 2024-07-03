import { loginController, signupController } from "../controller/auth.controller.js";

async function authRoutes(fastify) {
    fastify.post("/login", loginController)
    fastify.post("/signup", signupController)
}

export default authRoutes;