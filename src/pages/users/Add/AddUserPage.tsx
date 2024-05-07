import { UserLayout } from "../../../components/Layout/Layout";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import fetchAPI from "../../../fetch";
import { ErrorMessage } from "../../../components/ErrorMessage";
import Alert from "../../../components/Alert";
import { FilterRole } from "../components/FilterRole";
import * as _ from "lodash";

interface IForm {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  role_id: number;
}

export const AddUserPage = () => {
  const [form, setForm] = useState<IForm>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
    role_id: 1,
  });

  const [rolesOptions, setRolesOptions] = useState({
    faculty_id: 1,
    address: "",
    class_id: 1,
  });

  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState<Array<any>>([]);

  const history = useHistory();

  // Handle form change
  const handleChange = (event: any) => {
    const {name, value} = event.target;

    if (name === "role_id") {
      setForm({
        ...form,
        [name]: parseInt(value),
      });
      return;
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleRoleOptionsChange = (event: any) => {
    const {name, value} = event.target;
    console.log(event.target, "event.target.value");
    if (name === "faculty_id" || name === "class_id") {
      setRolesOptions({
        ...rolesOptions,
        [name]: parseInt(value),
      });
    } else {
      setRolesOptions({
        ...rolesOptions,
        [name]: value,
      });
    }
  };

  const getRoles = async () => {
    try {
      const response = await fetchAPI("/api/v1/roles", {
        method: "GET",
      });

      const data = await response.json();

      if (data) {
        setRoles(data.data);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  // Handle form submit
  const onFinish = async (event: any) => {
    event.preventDefault();
    const body = {
      name: form.name,
      email: form.email,
      password: form.password,
      password_confirmation: form.password_confirmation,
      phone: form.phone,
      role_id: form.role_id,
      ...rolesOptions,
    };

    if (form.role_id === 2) {
      delete body.class_id;
      delete body.address;
    } else if (form.role_id === 3) {
      delete body.faculty_id;
      delete body.class_id;
    } else if (form.role_id === 4) {
      delete body.faculty_id;
      delete body.address;
    }

    try {
      const response = await fetchAPI("/api/v1/users", {
        method: "POST",
        body: JSON.stringify(body),
      });

      const data = await response.json();

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

  const formatRoleName = (name: string) => {
    return _.startCase(_.snakeCase(_.replace(name, "_", " ")));
  };

  useEffect(() => {
    getRoles();
  }, []);

  return (
    <UserLayout>
      <div className="row">
        <div className="col-12 col-lg-8 m-auto">
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div
                className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3 d-flex justify-content-between">
                <h6 className="text-white text-capitalize ps-3">Add User</h6>
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
                    placeholder="Username"
                    aria-label="Username"
                    aria-describedby="basic-addon0"
                  />
                  <ErrorMessage field="name" errors={errors}/>
                </div>
                <div className="input-group input-group-dynamic mb-4 has-validation">
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    className={`form-control ${
                      errors["email"] ? "is-invalid" : ""
                    }`}
                    placeholder="Email"
                    aria-label="email"
                  />
                  <ErrorMessage field="email" errors={errors}/>
                </div>
                <div className="input-group input-group-dynamic mb-4 has-validation">
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    type="tel"
                    className={`form-control ${
                      errors["phone"] ? "is-invalid" : ""
                    }`}
                    placeholder="Phone"
                    aria-label="phone"
                  />
                  <ErrorMessage field="phone" errors={errors}/>
                </div>
                <div className="input-group input-group-dynamic mb-4 has-validation">
                  <input
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    type="password"
                    className={`form-control ${
                      errors["password"] ? "is-invalid" : ""
                    }`}
                    placeholder="Password"
                    aria-label="Password"
                    aria-describedby="password"
                  />
                  <ErrorMessage field="password" errors={errors}/>
                </div>
                <div className="input-group input-group-dynamic mb-4 has-validation">
                  <input
                    name="password_confirmation"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    type="password"
                    className={`form-control ${
                      errors["confirm_password"] ? "is-invalid" : ""
                    }`}
                    placeholder="Confirm Password"
                    aria-label="Confirm Password"
                    aria-describedby="confirm-password"
                  />
                  <ErrorMessage field="confirm_password" errors={errors}/>
                </div>
                <div className="input-group input-group-static mb-4 has-validation">
                  <label htmlFor="selectRoles" className="ms-0">
                    Role
                  </label>
                  <select
                    name="role_id"
                    value={form.role_id}
                    className={`form-control ${
                      errors["role_id"] ? "is-invalid" : ""
                    }`}
                    id="selectRoles"
                    onChange={handleChange}
                  >
                    {roles.map((role, i) => (
                      <option key={i} value={role.id}>
                        {formatRoleName(role.name)}
                      </option>
                    ))}
                  </select>
                  <ErrorMessage field="role_id" errors={errors}/>
                </div>
                <FilterRole
                  role={form.role_id}
                  onChange={handleRoleOptionsChange}
                  value={rolesOptions}
                  errors={errors}
                />
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
