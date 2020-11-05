"use strict";
const request = require("request");
const sharp = require("sharp");

module.exports = function requestBase64(url, maxWidth = 0) {
  return new Promise((resolve, reject) => {
    request(
      {
        url: url,
        method: "GET",
        followRedirect: true,
        followAllRedirects: true,
        followOriginalHttpMethod: true,
        maxRedirects: 10,
        encoding: "binary",
      },
      function (err, res, body) {
        if (err) return reject(err);
        var binary = Buffer.from(body, "binary");
        var sharped = sharp(binary);
        sharped
          .metadata()
          .then(function (metadata) {
            var result = sharped;
            if (maxWidth > 0 && metadata.width > maxWidth) {
              result = result.resize(maxWidth);
            }
            return result.png().toBuffer();
          })
          .then(
            (buffer) => {
              const type = "image/png";
              const data = "data:" + type + ";base64," + buffer.toString("base64");
              resolve(data);
            },
            (error) => {
              console.log("Sharp error:", error);
              reject(new Error("Failed to convert to png"));
            }
          );
      }
    );
  });
};
