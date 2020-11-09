"use strict";
const http = require("http");
const urlapi = require("url");
const linkMetadata = require("../src/index");

const PORT = process.env.PORT || 8080;

class HttpServer {
  constructor({ port }) {
    this.server = http
      .createServer((req, res) => {
        this.onRequest(req, res);
      })
      .listen(port);

    this.server.on("listening", () => {
      console.log("Server started on " + port + " port");
    });

    this.server.on("error", (error) => {
      console.log("Failed to run server", error);
    });
  }

  onRequest(req, res) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
    );

    const { method, url } = req;

    if (method.toLowerCase() === "options") {
      res.statusCode = 204;
      return;
    }

    if (method.toLowerCase() !== "get") {
      res.statusCode = 405;
      res.end(JSON.stringify({ success: 0, message: "Method Not Allowed" }));
      return;
    }

    const query = urlapi.parse(url, true).query;
    const link = query.link;
    var options = {};
    if (query.encodeImage) {
      options.encodeImage = "true" === query.encodeImage;
    }
    if (query.maxImageWidth) {
      options.maxImageWidth = parseInt(query.maxImageWidth);
    }
    if (link !== undefined) {
      linkMetadata(link, options).then(
        (meta) => res.end(JSON.stringify({ success: 1, meta: meta })),
        (err) => res.end(JSON.stringify({ success: 0, message: err.message }))
      );
    } else {
      res.end(
        JSON.stringify({
          success: 0,
          message:
            "Please provide link (string) parameter. You can also set parameters encodeImage (boolean) and maxImageWidth (integer)",
        })
      );
    }
  }
}

new HttpServer({
  port: PORT,
});
