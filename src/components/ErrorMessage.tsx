export const ErrorMessage = ({field, errors}) => {
  if (errors[field]) {
    return <div className="invalid-feedback">{errors[field][0]}</div>;
  }
  return null;
};
