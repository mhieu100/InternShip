import { useSelector } from "react-redux";
import PermissionPage from "../pages/error/permission";

const AccessDenied = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  if (user?.role !== "ADMIN") {
    return <PermissionPage />;
  }
  return children;
};

export default AccessDenied;
