import { useState, useContext } from "react";
import axios from "axios";
import UserContext from "../context/UserContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);

  const user = useContext(UserContext);

  const loginUser = (event) => {
    event.preventDefault();
    const data = { email: email, password: password };
    axios
      .post("http://localhost:8000/login", data, {
        withCredentials: true,
      })
      .then((response) => {
        user.setEmail(response.data.email);
        setEmail("");
        setPassword("");
        setLoginError(false);
      })
      .catch(() => {
        setLoginError(true);
      });
  };

  return (
    <form
      onSubmit={(event) => loginUser(event)}
      className="w-screen flex flex-col justify-center items-center gap-[20px]"
    >
      <h2>Login</h2>
      <input
        type="text"
        className="w-[280px] h-[35px] border border-blue-400"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <input
        type="password"
        className="w-[280px] h-[35px] border border-blue-400"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <button type="submit" className="w-[280px] h-[35px] bg-blue-400">
        Login
      </button>
      {loginError && <div>Login error. Check email or password.</div>}
    </form>
  );
}

export default Login;
