import { useEffect, useState } from "react";
import { ErrorMessage } from "../../../components/ErrorMessage";
import { UserLayout } from "../../../components/Layout/Layout";
import { useHistory, useParams } from "react-router";
import fetchAPI from "../../../fetch";
import Alert from "../../../components/Alert";
import Cookies from "js-cookie";

export const EditAttancanceRequest = () => {
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
    course_class_id: "",
    student_image: "",
    evidence: "present",
    description: "",
  });

  const [CourseClass, setCourseClass] = useState([]);

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const { id } = useParams<{ id: string }>();

  const [student, setStudent] = useState<any>({});

  const history = useHistory();

  //   const getUserData = async () => {
  //     try {
  //       const response = await fetchAPI(`/api/v1/users/${id}?includeRole=1`, {
  //         method: "GET",
  //       });
  //       const data = await response.json();
  //       if (response.ok) {
  //         setStudent(data.data);
  //         getCourseClass(data.data.student.class_id);
  //       }
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };

  const getCourseClass = async (class_id) => {
    console.log(class_id, "class_id");
    setLoading(true);
    try {
      const response = await fetchAPI(
        `/api/v1/course-classes?includeCourse=1&class_id=${class_id}`
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
        setCourseClass(data.data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error, "Error");
    }
  };

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

  const getAttandanceRequestData = async () => {
    try {
      const response = await fetchAPI(`/api/v1/attendance-requests/${id}`, {
        method: "GET",
      });
      const data = await response.json();
      if (response.ok) {
        setForm((prev) => {
          return {
            ...prev,
            course_class_id: data.data.course_class_id,
            evidence: data.data.evidence,
            description: data.data.description,
          };
        });
        setStudent(data.data.student);
        getCourseClass(data.data.student.class_id);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getAttandanceRequestData();
  }, []);

  const onFinish = async (event) => {
    event.preventDefault();

    try {
      console.log(form, "form");

      const formData = new FormData();
      formData.append("student_id", student.id);
      formData.append("course_class_id", form.course_class_id);
      formData.append("evidence", form.evidence);
      formData.append("description", form.description);
      formData.append("student_image", form.student_image);
      formData.append("_method", "PUT");
      const response = await fetch(
        `http://localhost:8000/api/v1/attendance-requests/${id}`,
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
      console.log(data, "data");
      if (response.ok) {
        Alert.success("Success", data.message);
        history.push("/attendance-requests");
      } else {
        setErrors(data.errors);
      }
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <UserLayout>
      <div className="row">
        <div className="col-12 col-lg-6 m-auto">
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3 d-flex justify-content-between">
                <h6 className="text-white text-capitalize ps-3">
                  Edit Attandance Request
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
                          <option key={i} value={item.id}>
                            {item.course.name}
                          </option>
                        );
                      })}
                    </select>
                    <ErrorMessage field="course_class_id" errors={errors} />
                  </div>
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
