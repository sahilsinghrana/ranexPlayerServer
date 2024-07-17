const supabase = require("../config/supabase.js");
const {
  errorResponseHandler,
  successResponseHandler,
} = require("../handler/responseHandler.js");

module.exports.USER_ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
};

module.exports.loginController = async function (req, reply) {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (!data?.user?.user_metadata.userRole) {
      supabase.auth.updateUser({
        data: {
          userRole: USER_ROLES.USER,
        },
      });
    }

    if (error) {
      errorResponseHandler(reply, 500, error);
    } else successResponseHandler(reply, data);
  } catch (err) {
    errorResponseHandler(reply, 500, err);
  }
};

module.exports.signupController = async function (req, reply) {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: "https://example.com/welcome",
        data: {
          userRole: USER_ROLES.USER,
        },
      },
    });
    if (error) {
      errorResponseHandler(reply, 500, error);
    } else successResponseHandler(reply, data);
  } catch (err) {
    errorResponseHandler(reply, 500, err);
  }
};

module.exports.logoutController = async function (req, reply) {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      errorResponseHandler(reply, 500, error);
    } else successResponseHandler(reply, "Signed out successfully!");
  } catch (err) {
    errorResponseHandler(reply, 500, err);
  }
};
