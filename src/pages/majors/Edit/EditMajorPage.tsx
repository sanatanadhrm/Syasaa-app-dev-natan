import { useEffect, useState } from "react";
import { UserLayout } from "../../../components/Layout/Layout";
import { useHistory, useParams } from "react-router";
import { ErrorMessage } from "../../../components/ErrorMessage";
import fetchAPI from "../../../fetch";
import Alert from "../../../components/Alert";

interface OptionsData {
  id: number;
  name: string;
}

export const EditMajorPage = () => {
  const [form, setForm] = useState({
    name: "",
    faculty_id: 1,
  });
  const [errors, setErrors] = useState({});
  const [faculties, setFaculties] = useState<Array<OptionsData>>([]);

  const { id } = useParams<{ id: string }>();

  const history = useHistory();

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const onFinish = async (event: any) => {
    event.preventDefault();
    try {
      const payload = {
        name: form.name,
        faculty_id: form.faculty_id,
        _method: "PUT",
      };

      const confirmed = await Alert.confirm(
        "Update Confirmation!",
        "Are you sure you want to update this major?",
        "Yes, update it!"
      );

      if (!confirmed) return;

      const response = await fetchAPI(`/api/v1/majors/${id}`, {
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
      console.error(error, "Error");
    }
  };

  const getMajorData = async () => {
    try {
      const response = await fetchAPI(`/api/v1/majors/${id}`, {
        method: "GET",
      });
      const data = await response.json();
      if (response.ok) {
        setForm({
          name: data.data.name,
          faculty_id: data.data.faculty.id,
        });
      }
    } catch (error) {
      console.error(error, "Error");
    }
  };

  useEffect(() => {
    getMajorData();
  }, []);

  const getFacultyData = async () => {
    try {
      const response = await fetchAPI("/api/v1/faculties", { method: "GET" });
      const data = await response.json();
      if (response.ok) {
        setFaculties(data.data);
      }
    } catch (error) {
      console.error(error, "Error");
    }
  };

  useEffect(() => {
    getFacultyData();
  }, []);

  return (
    <UserLayout>
      <div className="row">
        <div className="col-12 col-lg-6 m-auto">
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3 d-flex justify-content-between">
                <h6 className="text-white text-capitalize ps-3">Edit Major</h6>
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
                    placeholder="Major Name"
                    aria-label="Major Name"
                    aria-describedby="basic-addon0"
                  />
                  <ErrorMessage field="name" errors={errors} />
                </div>
                <div className="input-group input-group-static mb-4">
                  <label htmlFor="faculties" className="ms-0">
                    Faculty
                  </label>
                  <select
                    name="faculty_id"
                    className="form-control"
                    id="faculties"
                    onChange={handleChange}
                    value={form.faculty_id}
                  >
                    {faculties.map((faculty) => (
                      <option key={faculty.id} value={faculty.id}>
                        {faculty.name}
                      </option>
                    ))}
                  </select>
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
