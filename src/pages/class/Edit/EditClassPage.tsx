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

export const EditClassPage = () => {
  const [form, setForm] = useState({
    name: "",
    lat: "",
    lng: "",
    major_id: null,
  });
  const [errors, setErrors] = useState({});
  const [majors, setMajors] = useState<Array<OptionsData>>([]);

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
      const confirmed = await Alert.confirm(
        "Update Confirmation!",
        "Are you sure you want to update this major?",
        "Yes, update it!"
      );

      if (!confirmed) return;

      const response = await fetchAPI(`/api/v1/major-classes/${id}`, {
        method: "POST",
        body: JSON.stringify({ ...form, _method: "PUT" }),
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

  const getClassData = async () => {
    try {
      const response = await fetchAPI(`/api/v1/major-classes/${id}`, {
        method: "GET",
      });
      const data = await response.json();
      console.log("ini data", data);
      if (response.ok) {
        setForm({
          name: data.data.name,
          lat: data.data.lat,
          lng: data.data.lng,
          major_id: data.data.major_id,
        });
      }
    } catch (error) {
      console.error(error, "Error");
    }
  };

  useEffect(() => {
    getClassData();
  }, []);

  const getMajorsData = async () => {
    try {
      const response = await fetchAPI("/api/v1/majors", { method: "GET" });
      const data = await response.json();
      if (response.ok) {
        setMajors(data.data);
      }
    } catch (error) {
      console.error(error, "Error");
    }
  };

  useEffect(() => {
    getMajorsData();
  }, []);

  return (
    <UserLayout>
      <div className="row">
        <div className="col-12 col-lg-6 m-auto">
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3 d-flex justify-content-between">
                <h6 className="text-white text-capitalize ps-3">Edit Class</h6>
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
                    placeholder="Name"
                    aria-label="Name"
                  />
                  <ErrorMessage field="name" errors={errors} />
                </div>
                <div className="input-group input-group-dynamic mb-4 has-validation">
                  <input
                    name="lat"
                    value={form.lat}
                    onChange={handleChange}
                    type="text"
                    className={`form-control ${
                      errors["lat"] ? "is-invalid" : ""
                    }`}
                    placeholder="Latitude"
                    aria-label="Latitude"
                  />
                  <ErrorMessage field="lat" errors={errors} />
                </div>
                <div className="input-group input-group-dynamic mb-4 has-validation">
                  <input
                    name="lng"
                    value={form.lng}
                    onChange={handleChange}
                    type="text"
                    className={`form-control ${
                      errors["lng"] ? "is-invalid" : ""
                    }`}
                    placeholder="Longitude"
                    aria-label="Longitude"
                  />
                  <ErrorMessage field="lng" errors={errors} />
                </div>
                <div className="input-group input-group-static mb-4">
                  <label htmlFor="majors" className="ms-0">
                    Major
                  </label>
                  <select
                    name="major_id"
                    className="form-control"
                    id="majors"
                    onChange={handleChange}
                    value={form.major_id}
                  >
                    {majors.map((major) => (
                      <option key={major.id} value={major.id}>
                        {major.name}
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
