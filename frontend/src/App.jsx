import {Routes,Route}from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import { Navigate } from "react-router-dom";

const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
};

function App(){

const token = localStorage.getItem("token");
const storedUser = JSON.parse(localStorage.getItem("user") || "null");
const decodedUser = token ? decodeToken(token) : null;
const role = localStorage.getItem("role") || storedUser?.role || decodedUser?.role;

return(

<>

<Navbar/>


<Routes>

<Route

path="/"

element={<Home/>}

/>


<Route

path="/login"

element={<Login/>}

/>



<Route

path="/admin"

element={

role === "admin"

?

<Admin/>

:

<Navigate to="/" />

}

/>


</Routes>

</>

);

}

export default App;
