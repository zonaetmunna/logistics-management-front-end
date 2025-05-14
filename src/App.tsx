import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import InventoryDetail from './pages/InventoryDetail';
import InventoryForm from './pages/InventoryForm';
import Login from './pages/Login';

// Import placeholder components for routes that don't have full implementations yet
const Orders = () => <div className="p-4"><h1 className="text-2xl font-bold">Order Management</h1><p className="mt-4">Order management functionality coming soon.</p></div>;
const Suppliers = () => <div className="p-4"><h1 className="text-2xl font-bold">Supplier Management</h1><p className="mt-4">Supplier management functionality coming soon.</p></div>;
const Customers = () => <div className="p-4"><h1 className="text-2xl font-bold">Customer Management</h1><p className="mt-4">Customer management functionality coming soon.</p></div>;
const Warehouses = () => <div className="p-4"><h1 className="text-2xl font-bold">Warehouse Management</h1><p className="mt-4">Warehouse management functionality coming soon.</p></div>;
const Shipments = () => <div className="p-4"><h1 className="text-2xl font-bold">Shipment Management</h1><p className="mt-4">Shipment management functionality coming soon.</p></div>;
const Reports = () => <div className="p-4"><h1 className="text-2xl font-bold">Reports</h1><p className="mt-4">Reporting functionality coming soon.</p></div>;
const Settings = () => <div className="p-4"><h1 className="text-2xl font-bold">Settings</h1><p className="mt-4">Settings functionality coming soon.</p></div>;
const Profile = () => <div className="p-4"><h1 className="text-2xl font-bold">User Profile</h1><p className="mt-4">User profile functionality coming soon.</p></div>;

/**
 * RequireAuth component
 * 
 * A wrapper component that checks if the user is authenticated,
 * and redirects to the login page if not.
 */
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login, but save the current location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

/**
 * Main App Component
 * 
 * Configures routing for the application with authentication protection
 */
const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes within MainLayout */}
          <Route
            path="/"
            element={
              <RequireAuth>
                <MainLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="inventory/new" element={<InventoryForm />} />
            <Route path="inventory/:id" element={<InventoryDetail />} />
            <Route path="inventory/:id/edit" element={<InventoryForm />} />
            <Route path="orders" element={<Orders />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="customers" element={<Customers />} />
            <Route path="warehouses" element={<Warehouses />} />
            <Route path="shipments" element={<Shipments />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          
          {/* Catch all route - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
