import { useEffect, useRef, useState } from "react";
import { UserLayout } from "../../../components/Layout/Layout";
import fetchAPI from "../../../fetch";
import { useGeoLocation } from "../../../hooks/useGeoLocation";
import { getDistance } from "geolib";
import Alert from "../../../components/Alert";
import { useHistory } from "react-router";
import { ErrorMessage } from "../../../components/ErrorMessage";
import Cookies from "js-cookie";
import WebcamComponent from "../../../components/WebCamComponent";

export const AddAttandanceRequest = () => {
  const getUserLocation = useGeoLocation();
  const evidanceOptions = [
    {
      value: "present",
      label: "Present",
    },
    {
      value: "absent",
      label: "Absent",
    },
    {
      value: "late",
      label: "Late",
    },
    {
      value: "permit",
      label: "Permit",
    },
    {
      value: "sick",
      label: "Sick",
    },
    {
      value: "other",
      label: "Other",
    },
  ];

  const [form, setForm] = useState({
    course_class_id: "No Data",
    student_image: "",
    evidence: "present",
    description: "",
  });

  const [CourseClass, setCourseClass] = useState([]);

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const UserLogin = JSON.parse(localStorage.getItem("user") || "{}");

  const history = useHistory();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const [selectedOption, setSelectedOption] = useState("upload");

  const getCourseClass = async () => {
    setLoading(true);
    try {
      const response = await fetchAPI(
        `/api/v1/course-classes?includeCourse=1&class_id=${UserLogin.student.class_id}`
      );
      const data = await response.json();
      console.log(data, "data123123");
      if (response.ok) {
        if (data.data.length === 0) {
          setErrors({
            course_class_id: ["You don't have any class"],
          });
          setLoading(false);
        }
        const mappedData = data.data.map((item) => {
          return {
            value: item.id,
            label: `${item.course.name} - ${UserLogin.student.class.name}`,
          };
        });
        mappedData.unshift({ value: "No Data", label: "No Data" });
        console.log(mappedData, "mappedData");
        setCourseClass(mappedData);
        setLoading(false);
      }
    } catch (error) {
      console.error(error, "Error");
    }
  };
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

  useEffect(() => {
    getCourseClass();

    // enableCamera();
  }, []);

  const handleChange = (event: any) => {
    const { name, value } = event.target;

    if (name === "student_image") {
      setForm({
        ...form,
        student_image: event.target.files[0],
      });
      return;
    }
    setForm({
      ...form,
      [name]: value,
    });
  };

  const options = [
    { value: "upload", label: "upload Image" },
    { value: "capture", label: "capture Image" },
  ];

  const onFinish = async (event: any) => {
    event.preventDefault();
    console.log(form, "form");
    const confirm = await Alert.confirm(
      "Confirmation",
      "Are you sure you want to submit this request?",
      "Yes, Submit it!"
    );
    if (!confirm) return;
    else {
      try {
        const formData = new FormData();
        formData.append("student_id", UserLogin.student.id);
        formData.append("course_class_id", form.course_class_id);
        formData.append("evidence", form.evidence);
        formData.append("description", form.description);
        formData.append("student_image", form.student_image);
        console.log(formData.get("student_image"), "formdata");

        const response = await fetch(
          "http://localhost:8000/api/v1/attendance-requests",
          {
            method: "POST",
            body: formData,
            credentials: "include",
            headers: {
              Accept: "application/json",
              "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          history.goBack();
          Alert.success("Success", data.message);
        } else {
          console.log(data, "data");
          setErrors(data.errors);
        }
      } catch (error) {
        console.error(error, "Error");
      }
    }
  };

  const handleChangeOptions = (e) => {
    setSelectedOption(e.target.value);
    if (e.target.value === "capture") {
      enableCamera(); // Jika opsi yang dipilih adalah "capture", aktifkan kamera
    } else {
      // Jika opsi yang dipilih adalah "upload", matikan kamera
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    }
  };
  console.log(form, "form");

  return (
    <UserLayout>
      <div className="row">
        <div className="col-12 col-lg-6 m-auto">
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3 d-flex justify-content-between">
                <h6 className="text-white text-capitalize ps-3">
                  Add Attendance Requests
                </h6>
              </div>
              <div className="card-body">
                <form onSubmit={onFinish}>
                  <div className="input-group input-group-static has-validation mb-3">
                    <label>Course Class</label>
                    <select
                      name="course_class_id"
                      // className="form-control"
                      className={`form-control ${
                        errors["course_class_id"] ? "is-invalid" : ""
                      }`}
                      value={form.course_class_id}
                      onChange={handleChange}
                      disabled={CourseClass.length === 0 || loading}
                    >
                      {CourseClass.map((item, i) => {
                        return (
                          <option key={i} value={item.value}>
                            {item.label}
                          </option>
                        );
                      })}
                    </select>
                    <ErrorMessage field="course_class_id" errors={errors} />
                  </div>
                  <div className="input-group input-group-static mb-4 has-validation">
                    <label>Option Image</label>
                    <select
                      name="changeField"
                      className="form-control"
                      onChange={handleChangeOptions}
                      value={selectedOption}
                    >
                      {options.map((item, i) => (
                        <option key={i} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedOption == "upload" ? (
                    <div className="input-group input-group-static has-validation mb-3">
                      <label className="mb-2">Student Image</label>
                      <input
                        name="student_image"
                        className={`form-control form-control-sm ${
                          errors["student_image"] ? "is-invalid" : ""
                        }`}
                        id="formFilesm"
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                      />
                      <ErrorMessage field="student_image" errors={errors} />
                    </div>
                  ) : (
                    <div className="input-group input-group-static has-validation mb-3 d-flex justify-content-center">
                      <div className="d-flex flex-column">
                        {form.student_image == "" ? (
                          <video
                            ref={videoRef}
                            autoPlay
                            muted
                            width={350}
                            height={350}
                          />
                        ) : (
                          <img
                            src={`${
                              form.student_image
                                ? URL.createObjectURL(form.student_image as any)
                                : "https://via.placeholder.com/150"
                            }`}
                            width={380}
                            height={300}
                            className="rounded-3 my-2"
                            alt="none"
                          />
                        )}

                        <canvas ref={canvasRef} style={{ display: "none" }} />

                        <div className="d-flex justify-content-center">
                          <button
                            className="btn bg-gradient-dark ms-auto mb-0 mx-auto"
                            onClick={(e) => {
                              e.preventDefault();
                              const video = videoRef.current;
                              const canvas = canvasRef.current;
                              canvas.width = video.videoWidth;
                              canvas.height = video.videoHeight;
                              canvas
                                .getContext("2d")
                                .drawImage(
                                  video,
                                  0,
                                  0,
                                  canvas.width,
                                  canvas.height
                                );
                              canvas.toBlob((blob) => {
                                const file = new File(
                                  [blob],
                                  "captured_image.jpg",
                                  {
                                    type: "image/jpeg",
                                  }
                                );

                                setForm((prev: any) => {
                                  return {
                                    ...prev,
                                    student_image: file,
                                  };
                                });
                              }, "image/jpeg");
                            }}
                          >
                            Take a Picture
                          </button>
                          <button
                            className="btn bg-gradient-dark ms-auto mb-0 mx-auto"
                            onClick={(e) => {
                              e.preventDefault();
                              enableCamera();
                              setForm((prev: any) => {
                                return {
                                  ...prev,
                                  student_image: "",
                                };
                              });
                            }}
                          >
                            Enable Camera
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="input-group input-group-static has-validation mb-3">
                    <label>Evidence</label>
                    <select
                      name="evidence"
                      className={`form-control ${
                        errors["evidance"] ? "is-invalid" : ""
                      }`}
                      // id={name_form}
                      value={form.evidence}
                      onChange={handleChange}
                      //   disabled={courses.length === 0}
                    >
                      {evidanceOptions.map((item, i) => {
                        return (
                          <option key={i} value={item.value}>
                            {item.label}
                          </option>
                        );
                      })}
                    </select>
                    <ErrorMessage field="evidance" errors={errors} />
                  </div>
                  <div className="input-group input-group-static has-validation mb-3">
                    <label>Description</label>
                    <textarea
                      name="description"
                      className={`form-control ${
                        errors["description"] ? "is-invalid" : ""
                      }`}
                      rows={5}
                      placeholder="Description"
                      value={form.description}
                      spellCheck="false"
                      onChange={handleChange}
                    />
                    <ErrorMessage field="description" errors={errors} />
                  </div>

                  <div className="button-row d-flex mt-4">
                    <button
                      className="btn bg-gradient-dark ms-auto mb-0"
                      type="submit"
                      title="Send"
                      // onClick={onFinish}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};
