import { useEffect, useState } from "react";
import { Select } from "./Select";
import { ErrorMessage } from "../../../components/ErrorMessage";
import fetchAPI from "../../../fetch";

export const FilterRole = ({ role, onChange, value, errors }) => {
  const [options, setOptions] = useState<Array<any>>([]);
  console.log(typeof role, "value");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (role === 2) {
          const response = await fetchAPI("/api/v1/faculties", {
            method: "GET",
          });

          const data = await response.json();

          if (data) {
            setOptions(
              data.data.map((item: any) => ({
                label: item.name,
                value: item.id,
              }))
            );
          }
          console.log(data, "data roles");
        }

        if (role === 4) {
          const response = await fetchAPI(
            "/api/v1/major-classes?paginate=false",
            { method: "GET" }
          );

          const data = await response.json();

          if (data) {
            setOptions(
              data.data.map((item: any) => ({
                label: item.name,
                value: item.id,
              }))
            );
          }
          console.log(data, "data roles");
        }
      } catch (error) {
        console.log(error, "error");
      }
    };
    fetchData();
  }, [role]);

  if (role === 1) {
    return <div></div>;
  } else if (role === 2) {
    return (
      <Select
        options={options}
        name={"Faculty"}
        nameForm={"faculty_id"}
        handleChange={onChange}
        value={value.faculty_id}
      />
    );
  } else if (role === 3) {
    return (
      <div className="input-group input-group-dynamic mb-4 has-validation d-flex flex-column">
        <label htmlFor="selectRoles" className="ms-0 mx-0 my-0">
          Address
        </label>
        <input
          name="address"
          value={value.address}
          onChange={onChange}
          type="text"
          className={`form-control ${
            errors["address"] ? "is-invalid" : ""
          } w-100`}
          placeholder="Address"
          aria-label="Address"
        />
        <ErrorMessage field="address" errors={errors} />
      </div>
    );
  } else if (role === 4) {
    return (
      <Select
        options={options}
        name={"Class"}
        nameForm={"class_id"}
        handleChange={onChange}
        value={value.class_id}
      />
    );
  } else {
    return <div>Not Found</div>;
  }
};
