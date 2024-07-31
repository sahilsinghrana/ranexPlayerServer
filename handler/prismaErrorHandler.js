const { Prisma } = require("@prisma/client");

function prismaErrorHandler(e, res) {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2002") {
      // TODO - better error handling
      throw "Duplicate value : " + e.meta?.target.join(",");
    }
  }
  throw e;
}

module.exports = prismaErrorHandler;
