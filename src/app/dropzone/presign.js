const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

async function generateUploadURLs(bucketName, fileKeys, expiration = 60) {
  const s3Client = new S3Client({
    region: "your-region", // e.g., us-west-2
    credentials: {
      accessKeyId: "YOUR_ACCESS_KEY_ID",
      secretAccessKey: "YOUR_SECRET_ACCESS_KEY",
    },
  });

  const urls = [];
  for (const fileKey of fileKeys) {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
    });

    const url = await getSignedUrl(s3Client, command, {
      expiresIn: expiration * 60,
    }); // Expiration time in seconds
    urls.push(url);
  }

  return urls;
}

// Example usage
const bucketName = "your-bucket-name";
const fileNames = ["file1.txt", "file2.txt"]; // These would be the keys under which the files will be stored in the bucket

generateUploadURLs(bucketName, fileNames)
  .then((urls) => {
    console.log(urls);
    // Send these URLs to the frontend to be used for uploads
  })
  .catch((error) => console.error(error));


  
async function uploadFile(file, presignedUploadUrl) {
  const response = await fetch(presignedUploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": "file.type",
    },
  });

  return response.status; // 200 indicates success
}
