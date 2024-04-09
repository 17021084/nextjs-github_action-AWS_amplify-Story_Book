const { sha3_256 } = require("js-sha3");

function hashWithSalt(input, salt) {
  const saltedInput = input + salt; // Simple way to combine input and salt
  return sha3_256(saltedInput);
}

function hashFileName(filename) {
  if (!filename) throw new Error("Empty filename");
  const mySalt = "XQ2n!6C8ukqi!a";
  const [fileNamePart, extendPart] = filename?.split(".");
  if (!fileNamePart || !extendPart) throw new Error("Invalid file");
  const hashedFileNamePart = hashWithSalt(fileNamePart, mySalt);
  return hashedFileNamePart + "." + extendPart;
}

// バナー.png
// fc08f98e9a8e34a677496043b6d2fcdee8cc5af59da8dff0b1dd6d0cf91350e4.png
console.log(hashFileName("バナー.png"));

// サクコレ_齋藤冬優花_スプリングフラワー_パターン2_225_400.jpg
// 54302ef6c9d5efdb8e45d281ac8cf1314de43d057532abe997dd98db54fd1e53.jpg
console.log(
  hashFileName(
    "サクコレ_齋藤冬優花_スプリングフラワー_パターン2_225_400.jpg"
  )
);

exports = hashFileName;
