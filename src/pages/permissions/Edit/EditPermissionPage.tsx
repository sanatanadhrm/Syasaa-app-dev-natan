import { useEffect, useState } from "react";
import { UserLayout } from "../../../components/Layout/Layout";
import { useHistory, useParams } from "react-router";
import Cookies from "js-cookie";
import fetchAPI from "../../../fetch";
import Swal from "sweetalert2";
import { ErrorMessage } from "../../../components/ErrorMessage";
import Alert from "../../../components/Alert";

export const EditPermissionPage = () => {
  const [form, setForm] = useState({
    name: "",
  });
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const [errors, setErrors] = useState({});

  const getPermissionsById = async () => {
    try {
      const response = await fetchAPI(`/api/v1/permissions/${id}`, {method: "GET"});
      const data = await response.json();
      if (data) {
        setForm(data.data);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    console.log(event.target.name);
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
        _method: "PUT",
      };

      const response = await fetchAPI(`/api/v1/permissions/${id}`, {
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

  useEffect(() => {
    getPermissionsById();
  }, []);

  return (
    <UserLayout>
      <div className="row">
        <div className="col-12 col-lg-6 m-auto">
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div
                className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                <h6 className="text-white text-capitalize ps-3">
                  Edit Permission
                </h6>
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
                    className={`form-control ${errors['name'] ? "is-invalid" : ""}`}
                    placeholder="Permissions Name"
                    aria-label="Permissions Name"
                  />
                  <ErrorMessage field="name" errors={errors}/>
                </div>
                <div className="button-row d-flex mt-4">
                  <button className="btn bg-gradient-dark ms-auto mb-0" type="submit">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};
