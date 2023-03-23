import "./App.css";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import UserContext from "./context/UserContext";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_CLIENT_URL}/user`, {
        withCredentials: true,
      })
      .then((response) => {
        setEmail(response.data.email);
      });
  }, []);

  const logoutUser = () => {
    axios
      .post(
        `${process.env.REACT_APP_CLIENT_URL}/logout`,
        {},
        { withCredentials: true }
      )
      .then(() => {
        setEmail("");
      });
  };

  return (
    <UserContext.Provider value={{ email, setEmail }}>
      <BrowserRouter>
        <nav className="h-[50px] px-[50px] border-b border-gray-600 mb-[40px] flex flex-row gap-[24px] justify-between items-center">
          <NavLink to={"/"}>Home</NavLink>
          <div>
            {!!email && (
              <div className="flex flex-row gap-[24px]">
                <h2>Welcome {email}</h2>
                <button onClick={() => logoutUser()}>Logout</button>
              </div>
            )}
            {!email && (
              <div className="flex flex-row gap-[24px]">
                <NavLink to={"/login"}>Login</NavLink>
                <NavLink to={"/register"}>Register</NavLink>
              </div>
            )}
          </div>
        </nav>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
