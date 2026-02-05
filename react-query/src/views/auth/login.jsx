import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Api from "../../api";
import { setUser } from "../../features/authSlice";
import { useNavigate } from "react-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // login mutation
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await Api.post("/api/login", {
        email,
        password,
      });
      return res.data;
    },
    onSuccess: (data) => {
      dispatch(setUser({ user: data.user, token: data.token }));
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/products");
    },
    onError: (error) => {
      const msg = error.response?.data || error.response?.data?.message;
      setErrorMsg(msg);
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
    setErrorMsg("");
  };

  return (
    <>
      <div className="container mt-5">
        <div className="row align=items-center justify-content-center d-flex ">
          <div className="col-md-6 ">
            <div className="card shadow rounded-3">
              <div className="card-body">
                <h5 className="card-title text-center fw-bold">Login</h5>
                <form onSubmit={handleLogin} method="post">
                  <div className="mb-3">
                    <label htmlFor="" className="form-label fw-bold">
                      Email
                    </label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Masukkan email..."
                      className="form-control"
                    />
                    {errorMsg?.email?.[0] && (
                      <div className="alert alert-danger mt-1">
                        {errorMsg.email[0]}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="" className="form-label fw-bold">
                      Password
                    </label>
                    <input
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password..."
                      className="form-control"
                    />
                    {errorMsg?.password?.[0] && (
                      <div className="alert alert-danger mt-1">
                        {errorMsg.password[0]}
                      </div>
                    )}

                    {errorMsg?.message && (
                      <div className="alert alert-danger mt-1">
                        {errorMsg.message}
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary rounded-5 shadow border-0"
                  >
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
