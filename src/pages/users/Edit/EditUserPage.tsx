import { UserLayout } from "../../../components/Layout/Layout";
import { useHistory, useParams } from "react-router";
import { useEffect, useState } from "react";
import { ErrorMessage } from "../../../components/ErrorMessage";
import { FilterRole } from "../components/FilterRole";
import * as _ from "lodash";
import Alert from "../../../components/Alert";
import fetchAPI from "../../../fetch";

export const EditUserPage = () => {
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
    role_id: 1,
    lecturer: { address: "" },
    student: { class_id: null },
    faculty_staff: { faculty_id: null },
  });

  const [rolesOptions, setRolesOptions] = useState({
    faculty_id: 1,
    class_id: 1,
    address: "",
  });

  const [roles, setRoles] = useState<Array<any>>([]);
  const [errors, setErrors] = useState({});

  const history = useHistory();

  const handleChange = (event: any) => {
    const { name, value } = event.target;

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
    const { name, value } = event.target;
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

  const getUserDataById = async () => {
    try {
      const response = await fetchAPI(`/api/v1/users/${id}`, { method: "GET" });

      const data = await response.json();
      if (response.ok) {
        setForm(data.data);
        setRolesOptions({
          faculty_id: data.data?.faculty_staff?.faculty_id || "",
          class_id: data.data?.student?.class_id || "",
          address: data.data?.lecturer?.address || "",
        });
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const getRoles = async () => {
    try {
      const response = await fetchAPI("/api/v1/roles", { method: "GET" });

      const data = await response.json();

      if (data) {
        setRoles(data.data);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const onFinish = async (event: any) => {
    event.preventDefault();

    const body = {
      id: id,
      name: form.name,
      email: form.email,
      password: form.password,
      password_confirmation: form.password_confirmation,
      phone: form.phone,
      role_id: form.role_id,
      _method: "PUT",
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
      console.log(body, "body123123");
      const response = await fetchAPI(`/api/v1/users/${id}`, {
        method: "POST",
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if (response.ok) {
        console.log(data, "data123123");
        Alert.success("Success", data.message);
        history.goBack();
      } else {
        setErrors(data.errors);
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

  useEffect(() => {
    getUserDataById();
  }, []);

  return (
    <UserLayout>
      <div className="row">
        <div className="col-12 col-lg-8 m-auto">
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div
                className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3 d-flex justify-content-between">
                <h6 className="text-white text-capitalize ps-3">Edit User</h6>
              </div>
            </div>
            <div className="card-body">
              <form onSubmit={onFinish}>
                <div className="input-group input-group-dynamic mb-4">
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
                  />
                  <ErrorMessage field="name" errors={errors}/>
                </div>
                <div className="input-group input-group-dynamic mb-4">
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    className={`form-control ${
                      errors["email"] ? "is-invalid" : ""
                    }`}
                    placeholder="email"
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
                <div className="input-group input-group-dynamic mb-4">
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
                  />
                  <ErrorMessage field="password" errors={errors}/>
                </div>
                <div className="input-group input-group-dynamic mb-4">
                  <input
                    name="password_confirmation"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    type="password"
                    className={`form-control ${
                      errors["password_confirmation"] ? "is-invalid" : ""
                    }`}
                    placeholder="Confirm Password"
                    aria-label="Confirm Password"
                  />
                  <ErrorMessage
                    field="password_confirmation"
                    errors={errors}
                  />
                </div>
                <div className="input-group input-group-static mb-4">
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
