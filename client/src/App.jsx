import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import EmailConfirmed from "./components/auth/EmailConfirmed";
import VerifyEmail from "./components/auth/VerifyEmail";
import AccountCreated from "./components/auth/AccountCreated";
import Profile from "./components/common/Profile";

// Auth / Registration
import Register from "./components/auth/RegistrationForm";
import Home from "./pages/Home/Home";

// Login — our full-featured login (Stays module)
import Login from "./pages/Login/Login";

// Stays
import StaysHome from "./pages/stays/StaysHome";
import StayDetails from "./pages/stays/StayDetails";
import PostStay from "./pages/stays/PostStay";
import MyListings from "./pages/stays/MyListings";
import SavedStays from "./pages/stays/SavedStays";
import MyInquiries from "./pages/stays/MyInquiries";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
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

          {/* Profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Home (protected) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Stays module */}
          <Route path="/stays" element={<StaysHome />} />
          <Route path="/stays/post" element={<PostStay />} />
          <Route path="/stays/my-listings" element={<MyListings />} />
          <Route path="/stays/saved" element={<SavedStays />} />
          <Route path="/stays/inquiries" element={<MyInquiries />} />
          <Route path="/stays/:id" element={<StayDetails />} />

          {/* Placeholder routes for Deals and Roomies (other teams) */}
          <Route path="/deals" element={<div className="min-h-screen flex items-center justify-center text-gray-400">Deals module — coming soon</div>} />
          <Route path="/roomies" element={<div className="min-h-screen flex items-center justify-center text-gray-400">Roomies module — coming soon</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
