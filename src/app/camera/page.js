// components/Camera.js
'use client'
import { useEffect, useRef } from "react";

const Camera = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const constraints = { video: true };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.error("Error accessing camera:", error);
      });
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline />
    </div>
  );
};

export default Camera;
