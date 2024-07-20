const { USER_ROLES } = require("../controller/auth.controller");

module.exports.extractUserProfile = function (userObj = {}) {
  const { user_metadata = {} } = userObj;

  return {
    avatar: user_metadata.avatar_url,
    email: user_metadata.email,
    full_name: user_metadata.full_name,
    name: user_metadata.name,
    picture: user_metadata.picture,
    picture: user_metadata.picture,
    iam: user_metadata?.userRole === USER_ROLES.ADMIN ? 1 : 0,
  };
};
