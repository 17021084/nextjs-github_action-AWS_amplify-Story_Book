import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'ap-northeast-1'
});


export default async function handler(req, res) {
  const { folderPath, bucketName } = req.body;

  fs.readdir(folderPath, async (err, files) => {
    if (err) {
      console.error("Could not list the directory.", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const presignedUrls = [];

    for (const file of files) {
      const filePath = path.join(folderPath, file);

      const params = {
        Bucket: bucketName,
        Key: file,
        Expires: 3600, // URL expires in 1 hour
        ContentType: 'application/octet-stream'
      };

      try {
        const url = await s3.getSignedUrlPromise('putObject', params);
        presignedUrls.push({ file, url });
      } catch (error) {
        console.error("Error creating presigned URL", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }

    res.status(200).json(presignedUrls);
  });
}
