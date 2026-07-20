import { Navigate } from "react-router-dom";

const AgentRoute = ({ children, isAgent }) => {
  if (!isAgent) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AgentRoute;
