import { useEffect, useState } from "react";
import { UserLayout } from "../../../components/Layout/Layout";
import { useHistory } from "react-router";
import Cookies from "js-cookie";
import fetchAPI from "../../../fetch";
import { ErrorMessage } from "../../../components/ErrorMessage";
import ReactSelect from "react-select";
import makeAnimated from "react-select/animated";
import Alert from "../../../components/Alert";

interface IOptions {
  label: string;
  value: number;
}

export const AddRolePage = () => {
  const history = useHistory();
  const [form, setForm] = useState({
    name: "",
    permissions: [{ label: "", values: 0 }],
  });
  const [options, setOptions] = useState<Array<IOptions>>([]);
  const [errors, setErrors] = useState({});
  const animatedComponents = makeAnimated();

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    console.log(event.target.name);
    setForm((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const getPermissions = async () => {
    try {
      const response = await fetchAPI("/api/v1/permissions", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
        },
      });

      const data = await response.json();

      if (data) {
        setOptions(
          data.data.map((item: any) => ({ label: item.name, value: item.id }))
        );
      }
      console.log(data, "data roles");
    } catch (error) {
      console.log(error, "error");
    }
  };

  const onFinish = async (event: any) => {
    event.preventDefault();
    try {
      const body = {
        name: form.name,
        permissions: form.permissions.map((item: any) => item.value),
      };

      console.log(body, "body");

      const response = await fetchAPI("/api/v1/roles", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      console.log(data, "data role");

      if (!response.ok) {
        setErrors(data.errors);
      } else {
        history.goBack();
        Alert.success("Success", data.message);
      }
    } catch (error) {
      console.log(error, "Error");
    }
  };

  const handleSelectNew = (selectedOptions) => {
    // Dapatkan nilai dari options yang dipilih dan konversi ke format yang sesuai dengan state form
    const newPermissions = selectedOptions.map((option) => ({
      label: option.label,
      value: option.value,
    }));

    // Perbarui state form dengan menambahkan nilai baru ke dalam array permissions
    setForm((prevForm) => ({
      ...prevForm,
      permissions: newPermissions,
    }));
  };

  useEffect(() => {
    getPermissions();
  }, []);

  console.log(form, "form");

  return (
    <UserLayout>
      <div className="row">
        <div className="col-12 col-lg-8 m-auto">
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div
                className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3 d-flex justify-content-between">
                <h6 className="text-white text-capitalize ps-3">Add Role</h6>
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
                    placeholder="Role Name"
                    aria-label="Role Name"
                    aria-describedby="role name"
                  />
                  <ErrorMessage field="name" errors={errors}/>
                </div>
                <div className="mt-3 mb-4 w-100">
                  <ReactSelect
                    className={`form-control ${
                      errors["permissions"] ? "is-invalid" : ""
                    } w-100`}
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    isMulti
                    options={options}
                    onChange={handleSelectNew}
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
