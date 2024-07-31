function streamController(request, reply) {
  try {
    const songPath = path.join(__dirname, "assets/music/yrym99.mp3");
    console.log("LOGGG", {
      songPath: songPath,
    });
    fs.stat(songPath, (err, stats) => {
      if (err) {
        reply.code(404).send("Song not found");
        return;
      }
      const range = request.headers.range;
      console.log("LOGGG", {
        range: range,
      });
      if (!range) {
        reply.header("Content-Type", "audio/mpeg");
        reply.header("Content-Length", stats.size);

        const stream = fs.createReadStream(songPath);
        stream.pipe(reply.raw);
        reply.send("No Range");
      }

      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
      const chunkSize = end - start + 1;
      console.log("LOGGG", {
        responseding: chunkSize,
      });
      reply
        .code(206)
        .header("Content-Range", `bytes ${start}-${end}/${stats.size}`)
        .header("Accept-Ranges", "bytes")
        .header("Content-Length", chunkSize)
        .header("Content-Type", "audio/mpeg");

      const stream = fs.createReadStream(songPath, { start, end });
      stream.pipe(reply.raw);
    });
  } catch (err) {
    reply.send(err);
  }
}

module.exports = streamController;
