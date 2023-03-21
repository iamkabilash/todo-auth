import { useState } from "react";
import axios from "axios";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = (event) => {
    event.preventDefault();
    axios.post("url", "{data}");
  };

  return (
    <form
      onSubmit={(event) => registerUser(event)}
      className="w-screen flex flex-col justify-center items-center gap-[20px]"
    >
      <h2>Register</h2>
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
        Register
      </button>
    </form>
  );
}

export default Register;
