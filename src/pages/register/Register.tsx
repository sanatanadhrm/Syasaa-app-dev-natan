import { Button, Card, Form, Input } from "antd";
import styles from "./register.module.css";
import { IonItem } from "@ionic/react";
import { useState } from "react";
import Cookies from "js-cookie";
import { Redirect, useHistory } from "react-router";

export const RegisterPage = () => {
  const [form, setFrom] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
    role_id: "0",
  });
  const history = useHistory();
  const handleChange = (event: any) => {
    const { name, value } = event.target;
    console.log(event.target.name);
    setFrom({
      ...form,
      [name]: value,
    });
  };
  const onFinish = async (event: any) => {
    event.preventDefault();
    console.log("Received values of form: ", JSON.stringify(form));
    try {
      const response = await fetch(
        "http://localhost:8000/sanctum/csrf-cookie",
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = response.status;
      console.log(Cookies.get("XSRF-TOKEN"));
      console.log(form, "asdasd");
      if (data === 204) {
        const response = await fetch("http://localhost:8000/register", {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
            "Content-Type": "application/json", // Add this line
          },
          body: JSON.stringify(form), // Convert form to JSON
        });
        const data = await response.json();
        console.log(data, "data");
        if (data) {
          history.push("/dashboard");
          console.log(data, "data");
        }
      }
    } catch (error) {
      console.log(error, "Error");
    }
  };
  return (
    <div className="container my-auto mt-5">
      <div className="row">
        <div className="col-lg-4 col-md-8 col-12 mx-auto">
          <div className="card z-index-0 fadeIn3 fadeInBottom">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-primary shadow-primary border-radius-lg py-3 pe-1 mt-3">
                <h4 className="text-white font-weight-bolder text-center mt-2 mb-0">
                  Sign Up Syasa
                </h4>
              </div>
            </div>
            <div className="card-body">
              <form onSubmit={onFinish}>
                <div className="input-group input-group-dynamic mb-4">
                  <span className="input-group-text" id="basic-addon0">
                    <i className="bi bi-person-fill"></i>
                  </span>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    type="text"
                    className="form-control"
                    placeholder="Username"
                    aria-label="Username"
                    aria-describedby="basic-addon0"
                  />
                </div>
                <div className="input-group input-group-dynamic mb-4">
                  <span className="input-group-text" id="basic-addon1">
                    <i className="bi bi-person-fill"></i>
                  </span>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    className="form-control"
                    placeholder="email"
                    aria-label="email"
                    aria-describedby="basic-addon1"
                  />
                </div>
                <div className="input-group input-group-dynamic mb-4">
                  <span className="input-group-text" id="basic-addon2">
                    <i className="bi bi-person-lock"></i>
                  </span>
                  <input
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    type="password"
                    className="form-control"
                    placeholder="password"
                    aria-label="Password"
                    aria-describedby="basic-addon2"
                  />
                </div>
                <div className="input-group input-group-dynamic mb-4">
                  <span className="input-group-text" id="basic-addon3">
                    <i className="bi bi-key-fill"></i>
                  </span>
                  <input
                    name="password_confirmation"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    type="password"
                    className="form-control"
                    placeholder="Confirm Password"
                    aria-label="Confirm Password"
                    aria-describedby="basic-addon3"
                  />
                </div>
                <div className="input-group input-group-static mb-4">
                  <label htmlFor="exampleFormControlSelect1" className="ms-0">
                    Example select
                  </label>
                  <select
                    name="role_id"
                    value={form.role_id}
                    className="form-control"
                    id="exampleFormControlSelect1"
                    onChange={handleChange}
                  >
                    <option value={1}>Admin</option>
                    <option value={2}>Staff</option>
                    <option value={3}>Lecture</option>
                    <option value={4}>Mahasiswa</option>
                  </select>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn bg-primary w-100 my-4 mb-2 text-white"
                  >
                    Sign up
                  </button>
                </div>
                <p className="mt-4 text-sm text-center">
                  have an account?
                  <IonItem
                    className="text-primary  font-weight-bold"
                    routerLink="/login"
                  >
                    Sign in
                  </IonItem>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
