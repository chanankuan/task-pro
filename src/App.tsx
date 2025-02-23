import { Navigate, Route, Routes } from "react-router";

import { Auth, Home, Welcome } from "./pages";

function App() {
  return (
    <Routes>
      <Route index element={<Navigate to="welcome" />} />
      <Route path="welcome" element={<Welcome />} />

      <Route path="auth">
        <Route index element={<Navigate to="login" />} />
        <Route path="login" element={<Auth />} />
        <Route path="register" element={<Auth />} />
      </Route>

      <Route path="home">
        <Route index element={<Home />} />
        {/* <Route element={<MainLayout />} /> */}
        <Route path=":boardId" />
      </Route>

      <Route path="*" element={<Navigate to="/home" replace={true} />} />
    </Routes>
  );
}

export default App;
