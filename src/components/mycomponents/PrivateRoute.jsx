import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = ({auth}) => {
  return (auth === true ? <Outlet /> : <Navigate to="/login" replace/>)
};

// const ProtectedRoute = ({auth}) => {
    
//     return (auth === true ? <Outlet /> : <Navigate to="/" replace/>)
// }
// export default ProtectedRoute;
