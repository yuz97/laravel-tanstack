import { Link, useNavigate } from "react-router";
import RoutesIndex from "./routes";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "./features/authSlice";

function App() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = () => {
    dispatch(logoutUser());
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
        <div className="container">
          <Link to="/" className="navbar-brand">
            HOME
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {user && (
                <li className="nav-item">
                  <Link to="/products" className="nav-link active">
                    PRODUCTS
                  </Link>
                </li>
              )}
            </ul>

            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item dropdown">
                <a
                  className="btn btn-success rounded-5"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {user?.name ?? "SANTRI KODING"}
                </a>
                <ul className="dropdown-menu">
                  {user ? (
                    <>
                      <li>
                        <button
                          onClick={handleLogOut}
                          className="dropdown-item"
                        >
                          Logout
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link to={"/login"} className="dropdown-item">
                          Login
                        </Link>
                      </li>
                      <li>
                        <Link to={"/register"} className="dropdown-item">
                          Registrasi
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <RoutesIndex />
    </>
  );
}

export default App;
