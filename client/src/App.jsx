import "./App.css";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Register from "./Components/Register";
import Login from "./Components/Login";

function App() {
  return (
    <BrowserRouter>
      <nav className="h-[50px] px-[50px] border-b border-gray-600 mb-[40px] flex flex-row gap-[24px] justify-between items-center">
        <NavLink to={"/login"}>Login</NavLink>
        <NavLink to={"/register"}>Register</NavLink>
      </nav>
      <Routes>
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
