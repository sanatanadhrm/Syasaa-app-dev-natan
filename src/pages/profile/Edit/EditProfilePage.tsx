import { useEffect, useState } from "react";
import { UserLayout } from "../../../components/Layout/Layout";
import fetchAPI from "../../../fetch";
import Cookies from "js-cookie";
import Alert from "../../../components/Alert";
import { ErrorMessage } from "../../../components/ErrorMessage";
import { useHistory } from "react-router";

export const EditProfilePage = () => {
  const [selectedOption, setSelectedOption] = useState("name");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    image: null,
  });

  const history = useHistory();

  const [errors, setErrors] = useState({});

  const UserLogin = JSON.parse(localStorage.getItem("user"));

  const options = [
    { value: "name", label: "Information" },
    { value: "image", label: "Image" },
  ];

  const handleChangeOptions = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files : value,
    });
  };

  const onFinish = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    console.log(form, "form");
    try {
      if (selectedOption === "image") {
        formData.append("image", form.image);
        formData.append("_method", "PUT");
        formData.delete("name");
        formData.delete("email");
        formData.delete("phone");
        formData.delete("address");

        const response = await fetchAPI("/user/profile-photo", {
          method: "POST",
          body: formData,
          credentials: "include",
          "Content-Type": "multipart/form-data",
          headers: {
            Accept: "application/json",
            "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
          },
        });
        const data = await response.json();
        if (response.ok) {
          Alert.success("Success", data.message);
          history.go(0);
          history.push("/profile");
        } else {
          setErrors(data.errors);
        }
      } else {
        formData.append("address", form.address);
        formData.append("name", form.name);
        formData.append("email", form.email);
        formData.append("phone", form.phone);
        formData.append("_method", "PUT");
        formData.delete("image");
        const response = await fetchAPI("/user/profile-information", {
          method: "POST",
          body: formData,
          credentials: "include",
          headers: {
            Accept: "application/json",

            "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
          },
        });
        const data = await response.json();
        if (response.ok) {
          Alert.success("Success", data.message);
          history.push("/profile");
          // location.href = "/profile";
        } else {
          setErrors(data.errors);
        }
      }
    } catch (error) {
      console.error(error, "Error");
    }
  };
  useEffect(() => {
    if (!UserLogin) {
      history.push("/login");
    } else {
      setForm((prev) => {
        return {
          ...prev,
          name: UserLogin?.name || "",
          email: UserLogin?.email || "",
          phone: UserLogin?.phone || "",
          address: UserLogin?.lecturer.address || "",
        };
      });
    }
  }, []);
  return (
    <UserLayout>
      <button
        onClick={() => history.push("/profile")}
        className="ms-auto mb-0 p-0 px-4 text-bold"
        title="Go Back"
      >
        <h2 className="text-bold">
          <i className="bi bi-arrow-left col-5 text-bold"></i>
        </h2>
      </button>
      <div className="row">
        <div className="col-12 col-lg-6 m-auto">
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3 d-flex justify-content-between">
                <h6 className="text-white text-capitalize ps-3">
                  Edit Profile
                </h6>
              </div>
              <div className="card-body">
                <form onSubmit={onFinish}>
                  <div className="input-group input-group-static mb-4 has-validation">
                    <label>Change Data</label>
                    <select
                      name="changeField"
                      className="form-control"
                      onChange={handleChangeOptions}
                      value={selectedOption}
                    >
                      {options.map((item, i) => (
                        <option key={i} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedOption === "name" ? (
                    <>
                      <div className="input-group input-group-static has-validation mb-3">
                        <label className="mb-1">Name</label>
                        <input
                          className="form-control form-control-sm"
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                        />
                        <ErrorMessage field="name" errors={errors} />
                      </div>
                      <div className="input-group input-group-static has-validation mb-3">
                        <label className="mb-1">Email</label>
                        <input
                          className="form-control form-control-sm"
                          value={form.email}
                          type="text"
                          name="email"
                          onChange={handleChange}
                        />
                        <ErrorMessage field="email" errors={errors} />
                      </div>
                      <div className="input-group input-group-static has-validation mb-3">
                        <label className="mb-1">Phone</label>
                        <input
                          className="form-control form-control-sm"
                          type="text"
                          value={form.phone}
                          name="phone"
                          onChange={handleChange}
                        />
                        <ErrorMessage field="phone" errors={errors} />
                      </div>
                      <div className="input-group input-group-static has-validation mb-3">
                        <label className="mb-1">Address</label>
                        <input
                          className="form-control form-control-sm"
                          type="text"
                          name="address"
                          value={form.address}
                          onChange={handleChange}
                        />
                        <ErrorMessage field="address" errors={errors} />
                      </div>
                    </>
                  ) : (
                    <div className="input-group input-group-static mb-4 has-validation">
                      <label className="mb-1">Change Image</label>
                      <input
                        name="image"
                        type="file"
                        className="form-control form-control-sm"
                        onChange={handleChange}
                      />
                      <ErrorMessage field="image" errors={errors} />
                    </div>
                  )}
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
      </div>
    </UserLayout>
  );
};
