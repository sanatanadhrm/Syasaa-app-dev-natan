import { useEffect, useState } from "react";
import { ErrorMessage } from "../../../components/ErrorMessage";
import { UserLayout } from "../../../components/Layout/Layout";
import fetchAPI from "../../../fetch";
import { useHistory, useParams } from "react-router";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import Alert from "../../../components/Alert";

export const EditCoursePage = () => {
  const [errors, setErrors] = useState({} as any);
  const [form, setForm] = useState({
    name: "",
    description: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams<{ id: string }>();

  const history = useHistory();

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setForm((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const getCourseDataById = async () => {
    try {
      const response = await fetchAPI(`/api/v1/courses/${id}`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
        },
      });

      const data = await response.json();
      console.log(response, "data");
      if (response.ok) {
        setForm(data.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCourseDataById();
  }, []);

  console.log(form, "form");

  const onFinish = async (e: any) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        description: form.description ?? null,
        _method: "PUT",
      };

      const response = await fetchAPI(`/api/v1/courses/${id}`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        history.goBack();
        Alert.success("Success", data.message);
      } else {
        setErrors(data.errors);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };
  console.log(form, "form");

  return (
    <UserLayout>
      <div className="row">
        <div className="col-12 col-lg-6 m-auto">
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div
                className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3 d-flex justify-content-between">
                <h6 className="text-white text-capitalize ps-3">Edit Course</h6>
              </div>
            </div>
            <div className="card-body">
              <form onSubmit={onFinish}>
                <div className="input-group input-group-dynamic mb-4 has-validation">
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    type="text"
                    className={`form-control ${
                      errors["name"] ? "is-invalid" : ""
                    }`}
                    placeholder="Course Name"
                    aria-label="Course Name"
                    aria-describedby="course name"
                  />
                  <ErrorMessage field="name" errors={errors}/>
                </div>
                <div className="input-group input-group-dynamic mt-3 mb-4 w-100">
                    <textarea
                      name="description"
                      className="form-control"
                      value={form.description ?? ""}
                      rows={5}
                      placeholder="Description Course"
                      spellCheck="false"
                      onChange={handleChange}
                    />
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
    </UserLayout>
  );
};
