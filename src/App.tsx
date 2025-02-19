import { Navigate, Route, Routes } from "react-router";

// Pages
import { Welcome } from "./pages/Welcome";
import { Login, Register } from "./pages/Auth";
import { Home } from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route index element={<Navigate to="welcome" />} />
      <Route path="welcome" element={<Welcome />} />

      <Route path="auth">
        <Route index element={<Navigate to="login" />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      <Route path="home">
        <Route index element={<Home />} />
        {/* <Route element={<MainLayout />} /> */}
        <Route path=":boardId" />
      </Route>
    </Routes>
  );
}

export default App;
