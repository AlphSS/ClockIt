import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./components/auth/RegistrationForm";
import Login from "./pages/Registration/login";
import Home from "./pages/Home/Home";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
