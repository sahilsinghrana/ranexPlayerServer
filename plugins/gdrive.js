// googleDrivePlugin.js
const fp = require("fastify-plugin");
const { google } = require("googleapis");

async function googleDrivePlugin(fastify, options) {
  const { clientId, clientSecret, redirectUri, scopes } = options;

  fastify.register(require("fastify-oauth2"), {
    name: "googleOAuth2",
    credentials: {
      client: {
        id: clientId,
        secret: clientSecret,
      },
      auth: require("fastify-oauth2").GOOGLE_CONFIGURATION,
    },
    startRedirectPath: "/login",
    callbackUri: redirectUri,
    scope: scopes.join(" "),
  });

  fastify.decorate("googleDrive", {
    getAuthClient: (accessToken) => {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: accessToken });
      return auth;
    },
    listFiles: async (auth, query) => {
      const drive = google.drive({ version: "v3", auth });
      const res = await drive.files.list(query);
      return res.data.files;
    },
    getFileStream: async (auth, fileId) => {
      const drive = google.drive({ version: "v3", auth });
      const res = await drive.files.get(
        { fileId, alt: "media" },
        { responseType: "stream" },
      );
      return res.data;
    },
  });
}

module.exports = fp(googleDrivePlugin);
