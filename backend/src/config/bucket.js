require("dotenv").config();

const { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const bucket = new S3Client({
  region: process.env.BUCKET_REGION,
  endpoint: process.env.BUCKET_URL,
  credentials: {
    accessKeyId: process.env.BUCKET_ID,
    secretAccessKey: process.env.BUCKET_KEY,
  },
});

const getFile = async (key) => {
  const input = { Bucket: process.env.BUCKET_NAME, Key: `uploads/${key}` };
  const command = new GetObjectCommand(input);

  const signerUrl = await getSignedUrl(bucket, command, { expiresIn: 3600 });

  return signerUrl;
};

const uploadFile = async (key, req) => {
  const input = {
    Bucket: process.env.BUCKET_NAME,
    Key: `uploads/${key}`,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  const command = new PutObjectCommand(input);

  await bucket.send(command);
};

const deleteFile = async (key) => {
  const input = {
    Bucket: process.env.BUCKET_NAME,
    Key: `uploads/${key}`,
  };

  const command = new DeleteObjectCommand(input);

  await bucket.send(command);
};

module.exports = { getFile, uploadFile, deleteFile };
