export const Select = ({ name, options, handleChange, nameForm, value }) => {
  return (
    <div className="input-group input-group-static mb-4 has-validation">
      <label htmlFor={nameForm} className="ms-0">
        {name}
      </label>
      <select
        name={nameForm}
        className="form-control"
        id={nameForm}
        onChange={handleChange}
        value={value ?? ""}
      >
        {options.map((data, i) => (
          <option key={i} value={data.value}>
            {data.label}
          </option>
        ))}
      </select>
    </div>
  );
};
