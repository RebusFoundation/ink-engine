const docx = require("./docx");
const epub = require("./epub");
const markup = require("./markup");
const pdf = require("./pdf");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const fs = require("fs");

const PREFERSDATA = [pdf, markup];
// const PREFERSPATH = [docx, epub]

async function* process(options) {
  let processor;
  let suffix;
  switch (options.mediaType) {
    case "epub":
    case "application/epub+zip":
      processor = epub;
      suffix = ".epub";
      break;
    case "docx":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      processor = docx;
      suffix = ".docx";
      break;
    case "html":
    case "text/html":
      processor = markup;
      suffix = ".html";
      break;
    case "pdf":
    case "application/pdf":
      processor = pdf;
      suffix = ".pdf";
      break;
    default:
      throw new Error("Unsupported Media Type");
  }
  const { data, filename } = options;
  const randomFileName = crypto.randomBytes(15).toString("hex");
  options.tempRoot = path.join(os.tmpdir(), randomFileName, "/");
  await fs.promises.mkdir(options.tempRoot, { recursive: true });
  if (PREFERSDATA.includes(processor) && !data) {
    options.data = await fs.promises.readFile(filename);
  } else if (!filename) {
    options.filename = path.join(options.tempRoot, "original" + suffix);
    await fs.promises.writeFile(options.filename, data);
  }
  // We probably should iterate over the processor here and create thumbnails
  yield* processor(options);
}

module.exports = process;
