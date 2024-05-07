import React, { useEffect, useRef, useState } from "react";

const WebcamComponent = ({ handleCamera }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const captureImage = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas
        .getContext("2d")
        .drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        const file = new File([blob], "captured_image.jpg", {
          type: "image/jpeg",
        });
        setCapturedImage(file);
      }, "image/jpeg");
    }
  };

  console.log(capturedImage, "capturedImage");
  useEffect(() => {
    const enableCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: "user",
          },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error(error, "Error");
      }
    };

    enableCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay muted width={350} height={350} />
      {/* <button onClick={captureImage}>Capture Image</button> */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default WebcamComponent;
