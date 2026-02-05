import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import Api from "../../api";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/authSlice";
import { useNavigate } from "react-router";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errorMsg, setErrorMsg] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: async (userData) => {
      const res = await Api.post("/api/register", userData);
      return res.data;
    },
    onSuccess: (data) => {
      dispatch(setUser({ user: data.user, token: data.token }));
      setErrorMsg({});
      navigate("/login");
    },
    onError: (error) => {
      const msg = error.response?.data || error.response?.data?.message;
      setErrorMsg(msg);
    },
  });
  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setErrorMsg({ password: ["Password doesn't match"] });
      return;
    }
    registerMutation.mutate({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });
  };
  return (
    <>
      <div className="container mt-5">
        <div className="row align=items-center justify-content-center d-flex ">
          <div className="col-md-6 ">
            <div className="card shadow rounded-3">
              <div className="card-body">
                <h5 className="card-title text-center fw-bold">Register</h5>
                <form onSubmit={handleRegister} method="post">
                  <div className="mb-3">
                    <label htmlFor="" className="form-label fw-bold">
                      Nama
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Masukkan nama..."
                      className="form-control"
                    />
                    {errorMsg?.name?.[0] && (
                      <div className="alert alert-danger mt-1">
                        {errorMsg.name[0]}
                      </div>
                    )}
                  </div>
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
                  </div>
                  <div className="mb-3">
                    <label htmlFor="" className="form-label fw-bold">
                      Password Confirmation
                    </label>
                    <input
                      type="text"
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      placeholder="Masukkan password..."
                      className="form-control"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary rounded-5 shadow border-0"
                    disabled={registerMutation.isLoading}
                  >
                    {registerMutation.isLoading ? "Loading..." : "Registrasi"}
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
