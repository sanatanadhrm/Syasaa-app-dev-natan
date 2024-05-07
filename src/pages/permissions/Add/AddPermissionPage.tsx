import { useState } from "react";
import { UserLayout } from "../../../components/Layout/Layout";
import { useHistory } from "react-router";
import { ErrorMessage } from "../../../components/ErrorMessage";
import fetchAPI from "../../../fetch";
import Alert from "../../../components/Alert";

export const AddPermissionPage = () => {
  const history = useHistory();
  const [form, setForm] = useState({name: "",});
  const [errors, setErrors] = useState({});

  const handleChange = (event: any) => {
    const {name, value} = event.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const onFinish = async (event: any) => {
    try {
      event.preventDefault();
      const response = await fetchAPI("/api/v1/permissions", {
        method: "POST",
        body: JSON.stringify(form),
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

  return (
    <UserLayout>
      <div className="row">
        <div className="col-12 col-lg-6 m-auto">
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div
                className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3 d-flex justify-content-between">
                <h6 className="text-white text-capitalize ps-3">
                  Add Permission
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
                    placeholder="Permission Name"
                    aria-label="Permissions Name"
                  />
                  <ErrorMessage field="name" errors={errors}/>
                </div>
                <div className="button-row d-flex mt-4">
                  <button className="btn bg-gradient-dark ms-auto mb-0" type="submit" title="Send">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};
