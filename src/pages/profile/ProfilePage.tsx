import { useContext, useEffect, useRef, useState } from "react";
import { UserLayout } from "../../components/Layout/Layout";
import { AuthContext } from "../../context/Auth";
import { useHistory } from "react-router";
import { Modal } from 'bootstrap'
import _ from "lodash";
import * as faceapi from "face-api.js";
import { WithFaceLandmarks } from "face-api.js";
import './profile.css';
import Alert from "../../components/Alert";

export const ProfilePage = () => {
  const {isLogin, setIsLogin} = useContext(AuthContext);
  const history = useHistory();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const modalAddFaceData = useRef(null);
  const [modal, setModal] = useState(null);
  const [dimensions, setDimensions] = useState({width: 0, height: 0});
  const [videoStarted, setVideoStarted] = useState(false);
  const [faceDetectionRunning, setFaceDetectionRunning] = useState(false);
  const [faceDirection, setFaceDirection] = useState({
    left: false,
    right: false,
    forward: false,
  });
  const [instructions, setInstructions] = useState("");
  const [isDetectingDone, setIsDetectingDone] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [isFacialDataExist, setIsFacialDataExist] = useState(false);
  const user = isLogin.data;

  // Untuk merekam video
  const mediaRecorder = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [stream, setStream] = useState(null);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [videoChunks, setVideoChunks] = useState([]);
  const mimeType = "video/webm";

  const getUserProfilePhoto = () => {
    // jika path gambarnya ada di folder img/,
    // maka asumsinya adalah gambar tersebut digunakan untuk seeder
    if (user.image?.includes("img/")) {
      return user.image?.replace("storage/", "");
    }

    return user.image;
  };

  const startVideo = async () => {
    const constraints = {video: true};

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setStream(stream);
    }).catch((error) => {
      console.error(error, "Error getting video stream");
    });
  }

  const stopVideo = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
    }
  }

  const startRecording = async () => {
    setRecordingStatus("recording");

    mediaRecorder.current = new MediaRecorder(stream, {mimeType});

    mediaRecorder.current.start();

    let localVideoChunks = [];

    mediaRecorder.current.ondataavailable = (event: any) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      localVideoChunks.push(event.data);
    };

    setVideoChunks(localVideoChunks);
  };

  const stopRecording = () => {
    setRecordingStatus("inactive");
    mediaRecorder.current.stop();

    mediaRecorder.current.onstop = () => {
      const videoBlob = new Blob(videoChunks, {type: mimeType});
      const videoFile = new File(
        [videoBlob],
        `${_.snakeCase(isLogin.data.name)}_face_data.webm`,
        {type: mimeType}
      );

      setRecordedVideo(videoFile);
      setVideoChunks([]);
    };
  };

  const loadModels = async () => {
    await faceapi.loadFaceDetectionModel(import.meta.env.VITE_API_URL + '/models');
    await faceapi.loadFaceLandmarkModel(import.meta.env.VITE_API_URL + '/models');
  }

  const handleLaunchModal = async () => {
    modal.show();
    setVideoStarted(true);
    await startVideo();
  }

  const handleCloseModal = () => {
    modal.hide();
    setVideoStarted(false);
    stopVideo();
    setFaceDetectionRunning(false);
  }

  function getTop(l) {
    return l.map((a) => a.y).reduce((a, b) => Math.min(a, b));
  }

  function getMeanPosition(l) {
    return l.map((a) => [a.x, a.y]).reduce((a, b) => [a[0] + b[0], a[1] + b[1]]).map((a) => a / l.length);
  }

  const detectFaceDirection = async (detections: WithFaceLandmarks<any>, lastDirection: any) => {
    let right_eye = getMeanPosition(detections["landmarks"].getRightEye());
    let left_eye = getMeanPosition(detections["landmarks"].getLeftEye());
    let nose = getMeanPosition(detections["landmarks"].getNose());
    let mouth = getMeanPosition(detections["landmarks"].getMouth());
    let jaw = getTop(detections["landmarks"].getJawOutline());

    let rx = (jaw - mouth) / detections['detection']["_box"]["_height"];
    let ry = (left_eye[0] + (right_eye[0] - left_eye[0]) / 2 - nose[0]) / detections['detection']["_box"]["_width"];

    let face_val = +ry.toFixed(2);

    console.log(lastDirection, 'last direction')

    if (face_val < -0.06 && !lastDirection.left) {
      lastDirection = {
        ...lastDirection,
        left: true,
      };
    } else if (face_val >= 0.07 && !lastDirection.right) {
      lastDirection = {
        ...lastDirection,
        right: true,
      };
      setInstructions("Move your head to the left");
    } else {
      if (lastDirection.right) {
        setInstructions("Move your head to the left");
      } else if (lastDirection.forward) {
        setInstructions("Move your head to the right");
      }

      lastDirection = {
        ...lastDirection,
        forward: true,
      };
    }

    setFaceDirection(lastDirection);
    return lastDirection;
  }

  const detectFace = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const displaySize = {width: dimensions.width, height: dimensions.height};
    faceapi.matchDimensions(canvas, displaySize);
    console.log(displaySize, 'displaySize');

    let lastDirection = {left: false, right: false, forward: false};

    const intervalId = setInterval(async () => {
      const detections = await faceapi.detectSingleFace(video).withFaceLandmarks();
      if (displaySize.width && displaySize.height && detections) {
        const resizedDetections = faceapi.resizeResults(detections, dimensions);
        canvas.getContext('2d').clearRect(0, 0, dimensions.width, dimensions.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);

        // Jika user sudah mengikuti arahan, maka hentikan deteksi
        if (lastDirection.left && lastDirection.right && lastDirection.forward) {
          canvas.getContext('2d').clearRect(0, 0, dimensions.width, dimensions.height);
          stopRecording();
          setIsDetectingDone(true);
          clearInterval(intervalId);
        }

        lastDirection = await detectFaceDirection(detections, lastDirection);
      }
    }, 1000);
  }

  const uploadFaceData = async (video: any) => {
    const formData = new FormData();
    formData.append("video", video);
    formData.append("name", _.snakeCase(isLogin.data.name));

    setLoadingText("Generating face data...");

    const generate = await fetch(`${import.meta.env.VITE_API_ML_URL}/generate-dataset`, {
      method: "POST",
      body: formData,
    });

    if (!generate.ok) return false;

    const generateData = await generate.json();

    setLoadingText("Training model...");
    const training = await fetch(`${import.meta.env.VITE_API_ML_URL}/training`, {
      method: "POST",
    });

    if (!training.ok) return false;
    const trainingData = await training.json();

    return true;
  }

  const checkFacialData = async () => {
    const username = _.snakeCase(isLogin.data.name);
    const response = await fetch(`${import.meta.env.VITE_API_ML_URL}/check-facial-data/${username}`, {
      method: "GET",
    });

    if (response.status === 409) {
      console.log('nice')
      setIsFacialDataExist(true);
      console.log(isFacialDataExist, 'nice bro')
    }
  }

  useEffect(() => {
    let timeout: string | number | NodeJS.Timeout;

    const handleLoadedMetadata = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        let width = videoRef.current.offsetWidth;
        let height = videoRef.current.offsetHeight;

        setDimensions({
          width: width,
          height: height,
        });

        canvasRef.current.width = width;
        canvasRef.current.height = height;
      }, 100);
    };

    if (videoRef.current) {
      videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
    }

    return () => {
      clearTimeout(timeout);
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
      }
    };
  }, [videoStarted]);

  useEffect(() => {
    if (videoStarted) {
      loadModels();
    }

    return () => {
      stopVideo();
    };
  }, [videoStarted]);

  useEffect(() => {
    if (!videoStarted) return;

    if (recordingStatus === "recording") {
      detectFace();
      setFaceDetectionRunning(true);
    }
  }, [dimensions, faceDetectionRunning, recordingStatus]);

  useEffect(() => {
    if (isDetectingDone && recordedVideo) {
      uploadFaceData(recordedVideo).then((onFulfilled) => {
        if (onFulfilled) {
          handleCloseModal();
          setRecordedVideo(null);
          Alert.success("Success", "Face data added successfully");
        }
      });
    }
  }, [recordedVideo]);

  useEffect(() => {
    setModal(
      new Modal(modalAddFaceData.current)
    );
  }, []);

  useEffect(() => {
    checkFacialData();
  }, [recordedVideo]);

  return (
    <UserLayout>
      <div className="container-fluid px-2 px-md-4">
        <div
          className="page-header min-height-200 border-radius-xl mt-4"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1531512073830-ba890ca4eba2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')",
          }}
        >
          <span className="mask bg-gradient-primary opacity-6"></span>
        </div>
        <div className="card card-body mx-3 mx-md-6 mt-n6">
          <div className="col gx-4 mb-2 mx-3 mx-md-6 mt-n5">
            <div className="d-flex justify-content-center zindex-fixed h-100 mb-3">
              <div className="avatar avatar-xl position-relative zindex-fixed h-100">
                <img
                  src={getUserProfilePhoto()}
                  alt="profile_image"
                  className="shadow w-100 rounded-circle"
                />
              </div>
            </div>
            <div className="my-auto">
              <div className="h-100 d-flex justify-content-center text-lg">
                <h5 className="mb-1">{isLogin.data.name}</h5>
              </div>
            </div>
            <div className="my-auto">
              <div className="h-100 d-flex justify-content-center ">
                <p className="mb-0 font-weight-bold text-lg">
                  {_.startCase(_.camelCase(isLogin.data.role.name))}
                </p>
              </div>
            </div>
          </div>

          <div className="row d-flex justify-content-center">
            <div className="col-12 col-xl-4">
              <div className="card card-plain h-100">
                <div className="card-body p-0 d-flex justify-content-center">
                  <ul className="list-group">
                    <li className="list-group-item border-0 p-0 mb-2 text-lg d-flex justify-content-center">
                      {isLogin.data.phone || "No phone number"}
                    </li>
                    <li className="list-group-item border-0 p-0 text-lg mb-2 d-flex justify-content-center">
                      {isLogin.data.email || "No email"}
                    </li>
                    {isLogin.data.role_id === 3 ||
                      (isLogin.data.role_id === 4 && (
                        <li className="list-group-item border-0 p-0 text-lg mb-2 d-flex justify-content-center">
                          {isLogin.data.role_id === 3
                            ? isLogin.data?.lecturer?.address
                            : isLogin.data?.student?.class.name}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center gap-3">
            <button
              className={`btn mb-0 rounded-pill ${isFacialDataExist ? 'bg-gradient-danger' : 'bg-gradient-dark'}`}
              onClick={!isFacialDataExist ? handleLaunchModal : null}
            >
              <span className="p-1">{isFacialDataExist ? "Delete Facial Data" : "Add Facial Data"}</span>
            </button>

            <button
              className="btn btn-primary mb-0 rounded-pill"
              style={{
                height: "50px",
              }}
              onClick={() => {
                if (isLogin.data.role_id === 3) {
                  return history.push(`/profile/edit/${isLogin.data.id}`);
                } else {
                  return history.push(
                    `/profile/edit-request/${isLogin.data.id}`
                  );
                }
              }}
            >
              <span className="p-1">
                {isLogin.data.role_id === 3
                  ? "Edit Profile"
                  : "Edit Profile Request"}
              </span>
            </button>
          </div>
        </div>

        <div className="modal fade z-3" ref={modalAddFaceData}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title font-weight-normal" id="exampleModalLabel">Add Facial Data</h5>
                <button type="button" className="btn-close text-dark" onClick={handleCloseModal} aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {!isDetectingDone ? (
                  <p className="text-center">{instructions}</p>
                ) : (
                  <>
                    {!loadingText ? (
                      <p className="text-center">Face detection done</p>
                    ) : (
                      <p className="text-center">{loadingText}</p>
                    )}
                  </>
                )}

                <div className="d-flex align-items-center position-relative">
                  <video src="" crossOrigin="anonymous" ref={videoRef} autoPlay={true} width="100%"
                         height="100%"></video>
                  <canvas ref={canvasRef} width="100%"
                          className="position-absolute top-50 start-50 translate-middle"></canvas>
                </div>
                {recordingStatus === "inactive" ? (
                  <button type="button"
                          className={`btn bg-gradient-primary w-100 mt-3 ${isDetectingDone ? 'disabled' : ''}`}
                          onClick={startRecording}>
                    Start
                  </button>
                ) : null}

                {recordingStatus === "recording" ? (
                  <button type="button"
                          className="btn bg-gradient-danger w-100 mt-3 d-flex justify-content-center align-items-center">
                    <span className="blinking-icon me-2"></span>
                    <span>Recording</span>
                  </button>
                ) : null}

                {/*{recordedVideo ? (*/}
                {/*  <div className="recorded-player">*/}
                {/*    <a download href={recordedVideo}>*/}
                {/*      Download Recording*/}
                {/*    </a>*/}
                {/*  </div>*/}
                {/*) : null}*/}
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};
