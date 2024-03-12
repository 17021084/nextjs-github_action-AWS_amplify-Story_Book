"use client";
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

  return (
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
  );
}
