module.exports.successResponseHandler = function (reply, responseData) {
  reply.status(200);
  reply.send({
    data: responseData,
    message: "Success",
    responseCode: 1,
  });
};

module.exports.errorResponseHandler = function (reply, status, error) {
  const errorMessage =
    typeof error === "string" ? error : error?.message || "Unexpected Error!";
  reply.status(status || 500);
  reply.send({
    responseCode: 0,
    message: errorMessage,
  });
};
