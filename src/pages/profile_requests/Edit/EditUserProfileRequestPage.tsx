import { useEffect, useState } from "react";
import { ErrorMessage } from "../../../components/ErrorMessage";
import { UserLayout } from "../../../components/Layout/Layout";
import { useHistory, useParams } from "react-router";
import fetchAPI from "../../../fetch";
import _, { set } from "lodash";
import Cookies from "js-cookie";
import Alert from "../../../components/Alert";

export const EditUserProfileRequestPage = () => {
  const [form, setForm] = useState({
    new_value: "",
    changeField: "name",
    description: "",
    image: null,
  });

  const [old_value, setOldValue] = useState("");

  const [student, setStudent] = useState<any>({});

  const [user, setUser] = useState<any>({});

  const [errors, setErrors] = useState({});

  const options = [
    { value: "name", label: "Name" },
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone" },
    { value: "image", label: "Image" },
  ];

  const history = useHistory();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const { id } = useParams<{ id: string }>();

  const getData = async () => {
    try {
      const response = await fetchAPI(`/api/v1/update-profile-requests/${id}`, {
        method: "GET",
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data, "data");

        setForm((prev) => {
          return {
            ...prev,
            changeField: data.data.changed_data,
            description: data.data.description,
            new_value: data.data.new_value ?? "",
          };
        });
        getUser(data.data.student.user_id);
        setStudent(data.data.student);
        setOldValue(data.data.old_value);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async (id) => {
    try {
      const response = await fetchAPI(`/api/v1/users/${id}?includeRole=1`, {
        method: "GET",
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.data);
        console.log(data, "dat12312312");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onFinish = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("changed_data", form.changeField);
    formData.append("description", form.description);
    formData.append("status", "pending");
    formData.append("student_id", student.id);
    formData.append("_method", "PUT");

    if (form.changeField === "image") {
      console.log("salah masuk sini");
      formData.append("image", form.image);
      formData.delete("old_value");
    } else {
      console.log("masuk sini");
      formData.append("new_value", form.new_value);
      formData.append("old_value", user[form.changeField]);
    }

    console.log("data form ", form);

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/update-profile-requests/${id}`,
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
      console.log(data, "response");

      if (response.ok) {
        Alert.success("Success", data.message);
        history.push("/profile-requests");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <UserLayout>
      <div className="row">
        <div className="col-12 col-lg-6 m-auto">
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3 d-flex justify-content-between">
                <h6 className="text-white text-capitalize ps-3">
                  Edit Profile Request
                </h6>
              </div>
              <div className="card-body">
                <form onSubmit={onFinish}>
                  <div className="input-group input-group-static mb-4 has-validation">
                    <label>Changed Data</label>
                    <select
                      name="changeField"
                      className="form-control"
                      onChange={handleChange}
                      value={form.changeField}
                    >
                      {options.map((item, i) => (
                        <option key={i} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                    <ErrorMessage field="changed_data" errors={errors} />
                  </div>
                  {form.changeField === "image" ? (
                    <div className="input-group input-group-static has-validation mb-3">
                      <label className="mb-1">Change Image</label>
                      <input
                        className="form-control form-control-sm"
                        id="formFileSm"
                        type="file"
                        name="image"
                        onChange={handleChange}
                      />
                      <ErrorMessage field="image" errors={errors} />
                    </div>
                  ) : (
                    <div className="input-group input-group-static mb-4 has-validation">
                      <label className="mb-1">
                        New {_.startCase(form.changeField)}
                      </label>
                      <input
                        name="new_value"
                        value={form.new_value || ""}
                        onChange={handleChange}
                        type="text"
                        className={`form-control ${
                          errors["new_value"] ? "is-invalid" : ""
                        }`}
                        placeholder={`New ${_.startCase(form.changeField)}`}
                      />
                      <ErrorMessage field="new_value" errors={errors} />
                    </div>
                  )}

                  <div className="input-group input-group-static has-validation mt-3 mb-4 w-100">
                    <label>Description</label>
                    <textarea
                      name="description"
                      className="form-control"
                      rows={5}
                      placeholder="Description"
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
      </div>
    </UserLayout>
  );
};
