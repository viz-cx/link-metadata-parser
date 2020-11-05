"use strict";
const chardet = require("chardet");
const iconv = require("iconv-lite");
const urlMetadata = require("url-metadata");
const requestBase64 = require("./requestBase64");
const { removeEmptyProperties } = require("./utils");

const metadataOptions = {
  // force image urls in selected tags to use https,
  // valid for 'image', 'og:image' and 'og:image:secure_url' tags:
  ensureSecureImageRequest: false,

  // custom function to decode special-case encodings
  decode: function (buf) {
    const encoding = chardet.detect(buf);
    if (!encoding) {
      return "";
    }
    if (encoding === "UTF-8") {
      return buf.toString();
    }
    if (!iconv.encodingExists(encoding)) {
      return "";
    }
    return iconv.decode(buf, encoding, {
      stripBOM: true,
      addBOM: false,
      defaultEncoding: "UTF-8",
    });
  },

  // add base64 image encoded data
  encodeImage: false,

  // encoded image maximum width, 0 for disable resizing
  maxImageWidth: 0,
};

module.exports = function linkMetadata(url, options = {}) {
  return new Promise((resolve, reject) => {
    const mergedOptions = { ...metadataOptions, ...options };
    urlMetadata(url, mergedOptions).then(
      (metadata) => {
        var imageUrl = metadata["image"];
        // make relative url absolute
        var r = new RegExp("^(?:[a-z]+:)?//", "i");
        if (imageUrl.length > 0 && !r.test(imageUrl)) {
          const urlapi = require("url");
          const url = urlapi.parse(metadata["url"]);
          var basePath = url.protocol + "//" + url.hostname;
          if (url.port) {
            basePath += ":" + url.port;
          }
          imageUrl = basePath + imageUrl;
        }

        var meta = {
          link: metadata["url"],
          title: metadata["title"],
          description: metadata["description"],
          keywords: metadata["keywords"],
          source: metadata["source"],
          image: {
            url: imageUrl,
          },
        };
        meta = removeEmptyProperties(meta, true);
        if (true === mergedOptions.encodeImage && imageUrl !== undefined) {
          if (!imageUrl) {
            imageUrl = url;
          }
          requestBase64(imageUrl, mergedOptions.maxImageWidth).then(
            (base64) => {
              meta["image"]["url"] = imageUrl;
              meta["image"]["data"] = base64;
              resolve(meta);
            },
            (_) => {
              resolve(meta);
            }
          );
        } else {
          resolve(meta);
        }
      },
      (error) => {
        reject(error);
      }
    );
  });
};
