// utils/encryption.js
const crypto = require('crypto');

const getKey = () => {
  const key = Buffer.from(process.env.ENCRYPTION_KEY, "base64");
  if (key.length !== 32) {
    throw new Error("Encryption key must be 32 bytes (base64)");
  }
  return key;
};

const encrypt = (text) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getKey(), iv);

  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    iv: iv.toString("base64"),
    content: encrypted.toString("base64"),
    tag: tag.toString("base64"),
  };
};

const decrypt = (data) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    getKey(),
    Buffer.from(data.iv, "base64")
  );

  decipher.setAuthTag(Buffer.from(data.tag, "base64"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(data.content, "base64")),
    decipher.final()
  ]);

  return decrypted.toString("utf8");
};

module.exports = { encrypt, decrypt };