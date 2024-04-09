"use client";
import axios from "axios";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function Dropzone() {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback(async (acceptedFiles) => {
    console.log("Start loading file");
    // Main read file

    const data = await new Promise((resolve, reject) => {
      try {
        const listFiles = [];
        acceptedFiles.forEach((file) => {
          const { name, path, type } = file;
          // handle filter files by extension
          // continue

          // ====
          //  Restrict file size

          // ===change file name

          //
          const reader = new FileReader();
          reader.onabort = () => console.log("file reading was aborted");
          reader.onerror = () => console.log("file reading has failed");
          reader.onload = () => {
            const binaryStr = reader.result;
            listFiles.push({
              name,
              file,
              type,
              binaryStr,
            });
          };
          reader.readAsArrayBuffer(file);
        });
        return resolve(listFiles);
      } catch (error) {
        return reject(error);
      }
    });
    console.log("Loaded");
    setFiles(data);
    //
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const uploadFiles = async () => {
    try {
      console.log("Uploading");
      console.log("File", files);
      const data = [];
      files.forEach((file, index) => {
        data.push({
          fileName: file.name,
          fileType: file.type,
        });
      });
      console.log("data==>>", data);
      const res = await axios.post("/api/upload", data);
      const presignedDataList = res?.data.data;
      console.log("res", res.data);
      console.log("Uploaded s3....... ");
      const s3Res = await Promise.all(
        files.map((f) => {
          return uploadFileToS3ViaPresigned(f, presignedDataList);
        })
      );
      console.log("s3Res", s3Res);
    } catch (error) {
      console.log("Failed to upload files", error);
    }
  };

  const uploadFileToS3ViaPresigned = async (file, presignedDataList) => {
    try {
      console.log("file", file);
      console.log("presignedDataList", presignedDataList);
      const [presignedData] = presignedDataList.filter(
        (pre) => pre.fileName === file.name
      );
      console.log("presignedData", presignedData);
      const response = await fetch(presignedData.presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": presignedData?.fileType,
        },
        body: file.binaryStr,
      });
      if (response.ok) {
        console.log("Upload successful");
      } else {
        console.error("Upload failed");
      }
    } catch (error) {
      console.log("Failed to upload files", error);
    }
  };

  


  
  // const multipInputHander = (e) => {
  //   console.log(e)
  //   const files = e.target.files; // Get the selected files
  //   for (const file of files) {
  //     console.log(file.name); // Access the file name
  //     console.log(file.size); // Access the file size
  //     // You can also read the file content, upload it, etc.
  //   }
  // };

  return (
    <div>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drag drop some files here, or click to select files</p>

        {(files.length && (
          <div>
            <h1>Uploaded file </h1>
            {files.map((f, index) => {
              return <div key={index}>name is : {f.name}</div>;
            })}
          </div>
        )) || <div></div>}
      </div>
      <h1>Upload to proxy file===========================</h1>
      <div>
        <button onClick={() => uploadFiles()}> UploadFile </button>
      </div>
      {/* <div>
        <input
          onChange={(e) => multipInputHander(e)}
          type="file"
          id="files"
          name="files"
          multiple
        />
      </div> */}
    </div>
  );
}
