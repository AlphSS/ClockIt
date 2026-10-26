import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./components/auth/RegistrationForm";
import Login from "./pages/Registration/login";
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
import Home from "./pages/Home/Home";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import EmailConfirmed from "./components/auth/EmailConfirmed";
import VerifyEmail from "./components/auth/VerifyEmail";
import AccountCreated from "./components/auth/AccountCreated";
import Profile from "./components/common/Profile";
<<<<<<< Updated upstream
=======

import Roomies from "./pages/Roomies/Roomies";
import GoToTop from "./components/common/GoToTop";
import About from "./pages/About/About";
import CreateListing from "./pages/Roomies/CreateListing";
>>>>>>> Stashed changes

import Marketplace from "./pages/Marketplace/Marketplace";
import ProductDetails from "./pages/Marketplace/ProductDetails";
import MyListings from "./pages/Marketplace/MyListing";
import EditProduct from "./pages/Marketplace/EditProduct";
import AddProduct from "./pages/Marketplace/AddProduct";

import Navbar from "./components/common/NavBar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Authentication */}
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

<<<<<<< Updated upstream
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

        {/* Marketplace */}
        <Route path="/marketplace" element={<Marketplace />} />

        <Route
          path="/marketplace/product/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/marketplace/my-listings"
          element={<MyListings />}
        />

        <Route
          path="/marketplace/product/:id/edit"
          element={<EditProduct />}
        />

        <Route
          path="/marketplace/add"
          element={<AddProduct />}
        />

        {/* Home */}
=======
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

>>>>>>> Stashed changes
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
<<<<<<< Updated upstream
=======

        {/* Stays Routes */}
        <Route path="/stays" element={<StaysHome />} />
        <Route path="/stay" element={<StaysHome />} />
        <Route
          path="/stays/post"
          element={
            <ProtectedRoute>
              <PostStay />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stays/create"
          element={
            <ProtectedRoute>
              <PostStay />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stays/my-listings"
          element={
            <ProtectedRoute>
              <MyListings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stays/saved"
          element={
            <ProtectedRoute>
              <SavedStays />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stays/inquiries"
          element={
            <ProtectedRoute>
              <MyInquiries />
            </ProtectedRoute>
          }
        />
        <Route path="/stays/:id" element={<StayDetails />} />
        <Route
          path="/stays/:id/edit"
          element={
            <ProtectedRoute>
              <EditStay />
            </ProtectedRoute>
          }
        />

        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/marketplace/product/:id" element={<ProductDetails />} />

        <Route path="/marketplace/my-listing" element={<MyListing />} />

        <Route path="/marketplace/product/:id/edit" element={<EditProduct />} />

        <Route path="/marketplace/add" element={<AddProduct />} />
        <Route
          path="/roomies"
          element={
            <ProtectedRoute>
              <Roomies />
            </ProtectedRoute>
          }
        />
>>>>>>> Stashed changes
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
<<<<<<< Updated upstream
=======

        <Route path="/about" element={<About />} />

        <Route path="/roomies/create" element={<CreateListing />} />
>>>>>>> Stashed changes
      </Routes>

    </BrowserRouter>
  );
}

export default App;