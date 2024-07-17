const supabase = require("../config/supabase.js");
const { USER_ROLES } = require("../controller/auth.controller.js");
const { errorResponseHandler } = require("../handler/responseHandler.js");

module.exports.verifyAccessTokenHook = async function (req, reply) {
  try {
    const reqAccessToken = req.headers.authorization;
    const extractedToken = reqAccessToken?.split("Basic ")[1];
    if (extractedToken !== process.env.ACCESS_TOKEN)
      throw new Error("Unauthorized!!");
  } catch (err) {
    errorResponseHandler(reply, 403, err);
  }
};

/**
 *
 * @param {*} req
 * @returns user
 */
async function validateToken(req) {
  const { data, error } = await supabase.auth.getSession();
  if (data?.session?.user && !error) return data.session?.user;

  const xAuthToken = req.headers["x-auth-token"] || "";

  const extractedToken = xAuthToken.split("Bearer ")[1];

  if (extractedToken) {
    const { data, error } = await supabase.auth.getUser(extractedToken);

    if (!error && data.user) return data.user;
  }
  throw new Error("Unauthorized!");
}

function getRoleFromUser(user = {}) {
  return user?.user_metadata?.userRole || "";
}

function isUserAdmin(user = {}) {
  return getRoleFromUser(user) === USER_ROLES.ADMIN;
}

module.exports.authMiddleware = async function (req, reply) {
  try {
    const user = await validateToken(req);
    req.user = user;
  } catch (err) {
    errorResponseHandler(reply, 401, err);
    return reply;
  }
};

module.exports.checkAdminMiddleware = async function (req, reply) {
  try {
    const user = await validateToken(req);
    if (!isUserAdmin(user)) errorResponseHandler(reply, 401, "Unauthorized!");
  } catch (err) {
    errorResponseHandler(reply, 500, err);
  }
};
