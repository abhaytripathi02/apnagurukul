// This will prevent non-authenticated users from accessing this route
import { Navigate } from "react-router-dom"

function PrivateRoute({ children }) {
  // const { token } = useSelector((state) => state.auth)
  const token = JSON.parse(localStorage.getItem('token'));
  

  

  if (token !== null) {
    return children
  } else {
    return <Navigate to="/login" />
  }
}

export default PrivateRoute
