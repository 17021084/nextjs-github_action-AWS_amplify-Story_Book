import { NextResponse, NextRequest } from "next/server";
import { Axios } from "axios";
import AWS from "aws-sdk";
import fs from "fs";
import path from "path";
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || "ap-northeast-1",
});
const S3 = new AWS.S3();

const uploadFileToS3 = async (filename, body) => {
  try {
    const command = new PutObjectCommand({
      Bucket: "demo-pre-resize-image",
      Key: filename,
      Body: body,
    });
    return (response = await S3.send(command));
  } catch (error) {
    console.error("Error sending PutObjectCommand", error);
  }
};

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-northeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function generatePresignedUrl(fileName, fileType) {
  const command = new PutObjectCommand({
    Bucket: "demo-pre-resize-image",
    Key: "test/"+fileName,
    ContentType: fileType, // Important for the client to set the correct content type when uploading
  });

  try {
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    return {
      presignedUrl,
      fileName,
      fileType,
    };
  } catch (error) {
    console.error("Error generating presigned URL", error);
  }
}

export async function POST(req) {
  const data = await req.json();

  console.log("File upload", data);
  const url = await Promise.all(
    data.map((file) => {
      return generatePresignedUrl(file.fileName, file.fileType);
    })
  );
  // const url = await generatePresignedUrl(data[0].fileName, data[0].fileType)

  // console.log("url", url);
  return new NextResponse(JSON.stringify({ status: 200, data: url }));
}
