const supabase = require("../config/supabase.js");
const {
  errorResponseHandler,
  successResponseHandler,
} = require("../handler/responseHandler.js");

module.exports.USER_ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
};

module.exports.loginController = async function (req, res) {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) throw new Error(error);

    if (!data?.user?.user_metadata.userRole) {
      supabase.auth.updateUser({
        data: {
          userRole: USER_ROLES.USER,
        },
      });
    }
    successResponseHandler(res, data);
  } catch (err) {
    errorResponseHandler(res, 500, err);
  }
};

module.exports.signupController = async function (req, res) {
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

    if (error) throw new Error(error);

    successResponseHandler(res, data);
  } catch (err) {
    errorResponseHandler(res, 500, err);
  }
};

module.exports.logoutController = async function (req, res) {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error);
    successResponseHandler(res, "Signed out successfully!");
  } catch (err) {
    errorResponseHandler(res, 500, err);
  }
};
