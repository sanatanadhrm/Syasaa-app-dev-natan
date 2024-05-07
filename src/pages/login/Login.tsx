import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../context/Auth";
import fetchAPI from "../../fetch";

export const LoginPage = () => {
  const history = useHistory();

  const { isLogin, setIsLogin } = useContext(AuthContext);

  const [form, setFrom] = useState({
    email: "",
    password: "",
    remember: 0,
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    remember: 0,
  });

  // Handle form change
  const handleChange = (event: any) => {
    const { name, value } = event.target;

    setFrom({
      ...form,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  // Handle form submission
  const onFinish = async (event: any) => {
    event.preventDefault();
    try {
      const response = await fetchAPI("/sanctum/csrf-cookie", {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 204) {
        const response = await fetchAPI("/login", {
          method: "POST",
          body: JSON.stringify(form),
        });

        const message = await response.json();

        if (response.ok) {
          // Redirect to dashboard
          history.push("/dashboard");
          setIsLogin({
            isLogin: true,
            isPending: false,
          });
        } else {
          console.log("Login failed");

          setErrors({
            ...errors,
            email: message.errors.email ? message.errors.email[0] : "",
            password: message.errors.password
              ? message.errors.password[0]
              : "",
          });
        }
      }
    } catch (error) {
      console.log(error, "Error");
    }
  };

  const appName = import.meta.env.VITE_APP_NAME;

  return (
    <div className="container my-auto mt-5">
      <div className="row">
        <div className="col-lg-4 col-md-8 col-12 mx-auto">
          <div className="card z-index-0 fadeIn3 fadeInBottom">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-primary shadow-primary border-radius-lg py-3 pe-1">
                <h4 className="text-white font-weight-bolder text-center mt-2 mb-0">
                  {appName}
                </h4>
              </div>
            </div>
            <div className="card-body">
              <form onSubmit={onFinish} noValidate={true}>
                <div className="input-group input-group-static mb-4">
                  <label>Email</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    className="form-control"
                    placeholder="syasa@example.com"
                    aria-label="email"
                  />
                </div>
                {errors.email && (
                  <span className="text-danger text-s">{errors.email}</span>
                )}
                <div className="input-group input-group-static mb-4">
                  <label>Password</label>
                  <input
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    type="password"
                    className="form-control"
                    placeholder="********"
                    aria-label="Password"
                    aria-describedby="basic-addon2"
                  />
                </div>
                {errors.password && (
                  <span className="text-danger text-s">{errors.password}</span>
                )}
                <div className="form-check form-switch d-flex align-items-center my-4">
                  <input
                    name="remember"
                    className="form-check-input"
                    type="checkbox"
                    id="rememberMe"
                  />
                  <label className="form-check-label mb-0 ms-3">
                    Remember me
                  </label>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn bg-gradient-dark w-100 mb-0 text-white"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
