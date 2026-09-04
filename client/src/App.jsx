import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./components/auth/RegistrationForm";
import Login from "./pages/Registration/login";
import Home from "./pages/Home/Home";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import EmailConfirmed from "./components/auth/EmailConfirmed";
import VerifyEmail from "./components/auth/VerifyEmail";
import AccountCreated from "./components/auth/AccountCreated";
import Profile from "./components/common/Profile";

import Roomies from "./pages/Roomies/Roomies";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route path="/email-confirmed" element={<EmailConfirmed />} />

        <Route
          path="/account-created"
          element={
            <AccountCreated
              name={sessionStorage.getItem("registrationFullName")}
              onContinue={() => {
                sessionStorage.removeItem("registrationFullName");
                sessionStorage.removeItem("registrationEmail");
                window.location.href = "/";
              }}
            />
          }
        />

        <Route path="/login" element={<Login />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/roomies"
          element={
           <ProtectedRoute>
             <Roomies />
            </ProtectedRoute>
           }
        />
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
