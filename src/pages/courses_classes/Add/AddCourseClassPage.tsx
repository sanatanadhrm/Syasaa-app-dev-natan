import { useEffect, useState } from "react";
import { UserLayout } from "../../../components/Layout/Layout";
import fetchAPI from "../../../fetch";
import { ErrorMessage } from "../../../components/ErrorMessage";
import Cookies from "js-cookie";
import Alert from "../../../components/Alert";
import { useHistory } from "react-router";

export const AddCourseClassPage = () => {
  const [courses, setCourses] = useState([]);

  const [classes, setClasses] = useState([]);

  const [lecturers, setLecturers] = useState([]);

  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    course_id: "",
    class_id: "",
    lecturer_id: "",
    day: "monday",
    start_time: "",
    end_time: "",
  });

  const daysOptions = [
    {
      value: "monday",
      label: "Monday",
    },
    {
      value: "tuesday",
      label: "Tuesday",
    },
    {
      value: "wednesday",
      label: "Wednesday",
    },
    {
      value: "thursday",
      label: "Thursday",
    },
    {
      value: "friday",
      label: "Friday",
    },
    {
      value: "saturday",
      label: "Saturday",
    },
    {
      value: "sunday",
      label: "Sunday",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const getDataCourse = async () => {
    try {
      const response = await fetchAPI(`/api/v1/courses?paginate=false`, {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        setCourses(
          data.data.map((item) => ({ label: item.name, value: item.id }))
        );
        setForm((prev) => ({ ...prev, course_id: data.data[0].id }));
        // console.log(data, "data");
        //   setIsLoading(false);
      }
    } catch (error) {
      // setIsLoading(false);
    }
  };

  const getDataClass = async () => {
    try {
      const response = await fetchAPI(`/api/v1/major-classes?paginate=false`, {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        const mappedData = data.data.map((item: any) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
        // console.log(data, "data");
        setClasses(mappedData);
        setForm((prev) => ({ ...prev, class_id: data.data[0].id }));
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const getDataLecturer = async () => {
    try {
      const response = await fetchAPI("/api/v1/users?includeRole=1", {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        //   setUsers(data);
        console.log(data, "data");
        setLecturers(
          data.data
            .filter((item: any) => item.role_id === 3)
            .map((item) => ({ label: item.name, value: item.lecturer.id }))
        );
        setForm((prev) => ({ ...prev, lecturer_id: data.data[0].id }));
        //   setIsLoading(false);
      }
    } catch (error) {
      console.log(error, "error");
      // setIsLoading(false);
    }
  };

  const history = useHistory();

  const onFinish = async (e) => {
    e.preventDefault();
    const Formdata = new FormData();
    Formdata.append("course_id", form.course_id);
    Formdata.append("class_id", form.class_id);
    Formdata.append("lecturer_id", form.lecturer_id);
    Formdata.append("day", form.day);
    Formdata.append("start_time", form.start_time);
    Formdata.append("end_time", form.end_time);

    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/course-classes",
        {
          method: "POST",
          body: Formdata,
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
        // console.log(data, "data");
        history.push("/schedules");
      } else {
        setErrors(data.errors);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  useEffect(() => {
    getDataLecturer();
    getDataCourse();
    getDataClass();
  }, []);

  console.log(form, "form");
  return (
    <UserLayout>
      <div className="row">
        <div className="col-12 col-lg-8 m-auto">
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3 d-flex justify-content-between">
                <h6 className="text-white text-capitalize ps-3">
                  Add Schedule
                </h6>
              </div>
              <div className="card-body">
                <form onSubmit={onFinish}>
                  <div className="input-group input-group-static has-validation mb-3">
                    <label>Course</label>
                    <select
                      name="course_id"
                      //   className="form-control"
                      className={`form-control ${
                        errors["course_id"] ? "is-invalid" : ""
                      }`}
                      // id={name_form}
                      value={form.course_id}
                      onChange={handleChange}
                      //   disabled={courses.length === 0}
                    >
                      {courses.map((item, i) => {
                        return (
                          <option key={i} value={item.value}>
                            {item.label}
                          </option>
                        );
                      })}
                    </select>
                    <ErrorMessage field="course_id" errors={errors} />
                  </div>
                  <div className="input-group input-group-static has-validation mb-3">
                    <label>Class</label>
                    <select
                      name="class_id"
                      //   className="form-control"
                      className={`form-control ${
                        errors["class_id"] ? "is-invalid" : ""
                      }`}
                      // id={name_form}
                      value={form.class_id}
                      onChange={handleChange}
                      //   disabled={courses.length === 0}
                    >
                      {classes.map((item, i) => {
                        return (
                          <option key={i} value={item.value}>
                            {item.label}
                          </option>
                        );
                      })}
                    </select>
                    <ErrorMessage field="class_id" errors={errors} />
                  </div>
                  <div className="input-group input-group-static has-validation mb-3">
                    <label>Lecturer</label>
                    <select
                      name="lecturer_id"
                      //   className="form-control"
                      className={`form-control ${
                        errors["lecturer_id"] ? "is-invalid" : ""
                      }`}
                      // id={name_form}
                      value={form.lecturer_id}
                      onChange={handleChange}
                      //   disabled={courses.length === 0}
                    >
                      {lecturers.map((item, i) => {
                        return (
                          <option key={i} value={item.value}>
                            {item.label}
                          </option>
                        );
                      })}
                    </select>
                    <ErrorMessage field="lecturer_id" errors={errors} />
                  </div>
                  <div className="input-group input-group-static has-validation mb-3">
                    <label>Days</label>
                    <select
                      name="days"
                      //   className="form-control"
                      className={`form-control ${
                        errors["day"] ? "is-invalid" : ""
                      }`}
                      // id={name_form}
                      value={form.day}
                      onChange={handleChange}
                      //   disabled={courses.length === 0}
                    >
                      {daysOptions.map((item, i) => {
                        return (
                          <option key={i} value={item.value}>
                            {item.label}
                          </option>
                        );
                      })}
                    </select>
                    <ErrorMessage field="day" errors={errors} />
                  </div>
                  <div className="input-group input-group-static mb-4 has-validation">
                    <label>Start Time</label>
                    <input
                      name="start_time"
                      value={form.start_time}
                      onChange={handleChange}
                      type="text"
                      //   className="form-control"
                      className={`form-control ${
                        errors["start_time"] ? "is-invalid" : ""
                      }`}
                      placeholder="ex. 08:00"
                      aria-label="ex. 08:00"
                      aria-describedby="ex. 08:00"
                    />
                    <ErrorMessage field="start_time" errors={errors} />
                  </div>
                  <div className="input-group input-group-static mb-4 has-validation">
                    <label>End Time</label>
                    <input
                      name="end_time"
                      value={form.end_time}
                      onChange={handleChange}
                      type="text"
                      //   className="form-control"
                      className={`form-control ${
                        errors["end_time"] ? "is-invalid" : ""
                      }`}
                      placeholder="ex. 08:00"
                      aria-label="ex. 08:00"
                      aria-describedby="ex. 08:00"
                    />
                    <ErrorMessage field="end_time" errors={errors} />
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
