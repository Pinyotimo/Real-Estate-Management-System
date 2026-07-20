const Button = ({ label = "Button", ...props }) => (
  <button type="button" {...props}>
    {label}
  </button>
);

export default Button;
