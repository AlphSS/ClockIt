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
import Marketplace from "./pages/Marketplace/Marketplace";
import GoToTop from "./components/common/GoToTop";
import About from "./pages/About/About";
import CreateListing from "./pages/Roomies/CreateListing";
import AddProduct from "./pages/Marketplace/AddProduct";

// Stays Pages
import StaysHome from "./pages/stays/StaysHome";
import StayDetails from "./pages/stays/StayDetails";
import PostStay from "./pages/stays/PostStay";
import EditStay from "./pages/stays/EditStay";
import MyListings from "./pages/stays/MyListings";
import SavedStays from "./pages/stays/SavedStays";
import MyInquiries from "./pages/stays/MyInquiries";

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

        {/* Stays Routes */}
        <Route path="/stays" element={<StaysHome />} />
        <Route path="/stay" element={<StaysHome />} />
        <Route path="/stays/post" element={<ProtectedRoute><PostStay /></ProtectedRoute>} />
        <Route path="/stays/create" element={<ProtectedRoute><PostStay /></ProtectedRoute>} />
        <Route path="/stays/my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
        <Route path="/stays/saved" element={<ProtectedRoute><SavedStays /></ProtectedRoute>} />
        <Route path="/stays/inquiries" element={<ProtectedRoute><MyInquiries /></ProtectedRoute>} />
        <Route path="/stays/:id" element={<StayDetails />} />
        <Route path="/stays/:id/edit" element={<ProtectedRoute><EditStay /></ProtectedRoute>} />

        <Route path="/marketplace" element={<Marketplace />} />
        <Route
          path="/marketplace/add"
          element={<AddProduct />}
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

        <Route path="/about" element={<About />} />

        <Route
          path="/roomies/create"
          element={<CreateListing />}
        />

      </Routes>

      <GoToTop />

    </BrowserRouter>
  );
}

export default App;
