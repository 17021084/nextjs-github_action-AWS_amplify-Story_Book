import AWS from "aws-sdk";
import fs from "fs";
import path from "path";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || "ap-northeast-1",
});

const s3 = new AWS.S3();

export default async function handler(req, res) {
  console.log("api call")
  if(req.method === "POST"){
    const { folderPath, bucketName } = req.body;
    console.log("req", req);
    res.status(200).send({ message: "OK" });
  }

}
