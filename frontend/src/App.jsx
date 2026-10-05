import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";


import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Listings from "./pages/Listings";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import SwapRequests from "./pages/SwapRequests";
import Dashboard from "./pages/Dashboard";
import Favorites from "./pages/Favorites";
import ListingDetails from "./pages/ListingDetails";
import Chat from "./pages/Chat";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/listings" element={<Listings />} />
        
        <Route
          path="/chat/:swapRequestId"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/listings/:id"
          element={<ListingDetails />}
        />
        <Route path="/edit-listing/:id" element={<EditListing />} />
        <Route
          path="/create-listing"
          element={
            <ProtectedRoute>
              <CreateListing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/swap-requests"
          element={
            <ProtectedRoute>
              <SwapRequests />
            </ProtectedRoute>
          }
        />
                
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
              <ProtectedRoute>
                  <AdminDashboard />
              </ProtectedRoute>
          }
        />
                
      </Routes>

    </BrowserRouter>
  );
}

export default App;