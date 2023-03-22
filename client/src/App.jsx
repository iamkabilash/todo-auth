import "./App.css";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import UserContext from "./context/UserContext";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/user", { withCredentials: true })
      .then((response) => {
        setEmail(response.data.email);
      });
  }, []);

  const logoutUser = () => {
    axios
      .post("http://localhost:8000/logout", {}, { withCredentials: true })
      .then(() => setEmail(""));
  };

  return (
    <UserContext.Provider value={{ email, setEmail }}>
      <BrowserRouter>
        <nav className="h-[50px] px-[50px] border-b border-gray-600 mb-[40px] flex flex-row gap-[24px] justify-between items-center">
          <NavLink to={"/login"}>Login</NavLink>
          <div>
            {!!email && (
              <div>
                <h2>Logged in as {email}</h2>
                <button onClick={() => logoutUser()}>Logout</button>
              </div>
            )}
            {!email && <h2>Not logged in</h2>}
          </div>
          <NavLink to={"/register"}>Register</NavLink>
        </nav>
        <Routes>
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
