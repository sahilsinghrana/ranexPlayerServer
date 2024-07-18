module.exports.successResponseHandler = function (res, responseData) {
  res.status(200);
  res.send({
    data: responseData,
    message: "Success",
    responseCode: 1,
  });
};

module.exports.errorResponseHandler = function (res, status, error) {
  const errorMessage =
    typeof error === "string" ? error : error?.message || "Unexpected Error!";
  res.status(status || 500);
  res.json({
    responseCode: 0,
    message: errorMessage,
  });
};
