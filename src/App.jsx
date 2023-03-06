import "./App.css";
import Login from "./Routes/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Routes/Register";
import Chat from "./Routes/Chat";
import PrivateRoute from "./utils/PrivateRoute";
import PublicRoute from "./utils/PublicRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route element={<Chat />} path="/" exact />
        </Route>
        <Route element={<PublicRoute />}>
          <Route element={<Login />} path="/login" exact />
          <Route element={<Register />} path="/register" exact />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
