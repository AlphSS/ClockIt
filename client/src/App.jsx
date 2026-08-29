import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

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
