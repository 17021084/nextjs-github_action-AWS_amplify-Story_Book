"use client"
import { useState } from 'react';
import axios from 'axios';

export default function Uploader() {
  const [files, setFiles] = useState(null);

  const handleUpload = async () => {
    const folderPath = '/path/to/your/folder/';
    const bucketName = 'mutil-path-upload-nextjs';

    try {
      const response = await axios.post('/api/upload', { folderPath, bucketName });
      const presignedUrls = response.data;

      for (const { file, url } of presignedUrls) {
        // Use any method to upload the file to S3, e.g., Axios or fetch
        // Here's an example using Axios
        await axios.put(url, files[file], {
          headers: { 'Content-Type': 'application/octet-stream' }
        });
        console.log(`File ${file} uploaded successfully.`);
      }

      alert('All files uploaded successfully.');
    } catch (error) {
      console.error('Error uploading files', error);
      alert('Error uploading files. Please check the console.');
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    const fileMap = {};

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      fileMap[file.name] = file;
    }

    setFiles(fileMap);
  };

  return (
    <div>
      <input type="file" webkitdirectory onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Files</button>
    </div>
  );
}
