import { useHistory, useParams } from "react-router";
import { UserLayout } from "../../../components/Layout/Layout";
import { useEffect, useState } from "react";
import fetchAPI from "../../../fetch";
import makeAnimated from "react-select/animated";
import ReactSelect from "react-select";
import Alert from "../../../components/Alert";
import { ErrorMessage } from "../../../components/ErrorMessage";

interface IOptions {
  label: string;
  value: number;
}

export const EditRolePage = () => {
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState({
    name: "",
    permissions: [
      {
        label: "",
        values: 0,
      },
    ],
  });
  const animatedComponents = makeAnimated();
  const [errors, setErrors] = useState({});
  const [options, setOptions] = useState<Array<IOptions>>([]);
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

  const getRoles = async () => {
    try {
      const response = await fetchAPI(
        `/api/v1/roles/${id}?includePermissions=${id}`,
        {method: "GET"}
      );

      const data = await response.json();

      if (response.ok) {
        setForm({
          name: data.data.name,
          permissions: data.data.permissions.map((permission: any) => ({
            label: permission.name,
            value: permission.id,
          })),
        });
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const onFinish = async (event: any) => {
    event.preventDefault();

    try {
      const payload = {
        name: form.name,
        permissions: form.permissions.map(
          (permission: any) => permission.value
        ),
        _method: "PUT",
      };

      const response = await fetchAPI(`/api/v1/roles/${id}`, {
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
      console.log(error, "Error");
    }
  };

  const getPermissions = async () => {
    try {
      const response = await fetchAPI("/api/v1/permissions", {method: "GET"});
      const data = await response.json();
      if (response.ok) {
        setOptions(
          data.data.map((item: any) => ({ label: item.name, value: item.id }))
        );
      }
    } catch (error) {
      console.log(error, "error");
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
    getRoles();
    getPermissions();
  }, [id]);

  console.log(options, "options");
  console.log(form, "form");
  return (
    <UserLayout>
      <div className="row">
        <div className="col-12 col-lg-8 m-auto">
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div
                className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3 d-flex justify-content-between">
                <h6 className="text-white text-capitalize ps-3">
                  Edit Role
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
                    className={`form-control ${
                      errors["name"] ? "is-invalid" : ""
                    }`}
                    placeholder="Role Name"
                    aria-label="Role Name"
                    aria-describedby="basic-addon0"
                  />
                  <ErrorMessage field="name" errors={errors}/>
                </div>
                <div className="mt-3 mb-4 w-100">
                  <ReactSelect
                    className={`form-control ${
                      errors["permissions"] ? "is-invalid" : ""
                    } w-100`}
                    closeMenuOnSelect={false}
                    value={form.permissions}
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
