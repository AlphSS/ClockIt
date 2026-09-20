import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./components/auth/RegistrationForm";
import Login from "./pages/Registration/login";
import Home from "./pages/Home/Home";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Marketplace from "./pages/Marketplace/Marketplace";
import ProductDetails from "./pages/Marketplace/ProductDetails";
import MyListings from "./pages/Marketplace/MyListing ";
import EditProduct from "./pages/Marketplace/EditProduct";
import AddProduct from "./pages/Marketplace/AddProduct";
import Navbar from "./components/common/NavBar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
<<<<<<< Updated upstream
=======
        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route path="/email-confirmed" element={<EmailConfirmed />} />

        <Route path="/marketplace" element={<Marketplace />} />

        <Route path="/marketplace/product/:id" element={<ProductDetails />} />

        <Route path="/marketplace/my-listings" element={<MyListings />} />

        <Route path="/marketplace/product/:id/edit" element={<EditProduct />} />

        <Route path="/marketplace/add" element={<AddProduct />} />

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

>>>>>>> Stashed changes
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
