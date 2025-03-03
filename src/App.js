import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";

import AdminDashboard from "../src/Components/Admin/AdminDashboard";
import AdminLogin from "./Components/Admin/AdminLogin";
import AuthForm from "./Components/AuthForm";
import ProfileKYCForm from "./Components/ProfileKYCForm";
import VerificationInProgress from "./Components/VerificationInProgress";
import ConnectAccounts from "./Components/ConnectAccounts";
import ApplyForLoan from "./Components/ApplyForLoan";
import UsersLoanList from "./Components/Admin/UsersLoanList";
import LoanConfirmation from "./Components/LoanConfirmation";
import ForgotPasswordForm from "./Components/ForgotPasswordForm";
import ResetPasswordForm from "./Components/ResetPasswordForm";
import Home from "./Components/Home";
import Notification from "./Components/Notification";
import TransactionHistory from "./Components/TransactionHistory";
import LoanDetailHome from "./Components/LoanDetailHome";
import Profile from "./Components/Profile";
import ContactSupport from "./Components/ContactSupport";
import FAQ from "./Components/Faq";
import UserList from "./Components/Admin/UserList";
import NotFoundPage from "./Components/NotFound";
import ProtectedRoute from "./Components/ProtectedRoute"; // Import the ProtectedRoute component
import EditAdminProfile from "./Components/Admin/EditAdminProfile";
import AdminForgotPass from "../src/Components/Admin/AdminForgotPass";
import AdminResetPasswordForm from "./Components/Admin/AdminResetPasswordForm";
import PlaidLink from "./Components/plaidLinkAccount";
import { getUserProfile } from "./API/apiServices";
import { toast } from "react-toastify";
import TermsAndConditions from "./Components/TermsAndConditions";
import UserBankDetails from "./Components/BankDetails";
import Payment from "./Components/Payment";
import ContactRecord from "./Components/ContactRecord";
import AdminGraph from "./Components/Admin/AdminGraph";
import AdminAnalytics from "./Components/Admin/AdminAnalytics";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phylloSDKLoaded, setPhylloSDKLoaded] = useState(false);
  const [image, setImage] = useState(null);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  useEffect(() => {
    const loadPhylloSDK = () => {
      if (!window.PhylloSDK) {
        const script = document.createElement("script");
        script.src = "https://cdn.getphyllo.com/connect/v2/phyllo-connect.js";
        script.onload = () => {
          console.log("Phyllo SDK loaded successfully");
          setPhylloSDKLoaded(true);
        };
        script.onerror = () => {
          console.error("Failed to load Phyllo SDK");
        };
        document.head.appendChild(script);
      } else {
        setPhylloSDKLoaded(true);
      }
    };

    loadPhylloSDK();
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Authentication Route */}
          <Route
            exact
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/kyc-profile" />
              ) : (
                <AuthForm onLogin={handleLogin} />
              )
            }
          />

          {/* KYC Profile Route */}
          <Route
            exact
            path="/kyc-profile"
            element={
              <ProtectedRoute>
                <ProfileKYCForm Image={image} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />

          <Route path="/plaid-link" element={<PlaidLink />} />

          <Route
            path="/transaction-history"
            element={
              <ProtectedRoute>
                <TransactionHistory Image={image} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notification"
            element={
              <ProtectedRoute>
                <Notification />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile setIsAuthenticated={setIsAuthenticated} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/loandetail"
            element={
              <ProtectedRoute>
                <LoanDetailHome />
              </ProtectedRoute>
            }
          />

          {/* Verification In Progress Route */}
          <Route
            path="/verification"
            element={<VerificationInProgress Image={image} />}
          />
          <Route
            path="/socialaccount"
            element={<ConnectAccounts Image={image} />}
          />
          <Route
            path="/forgot-password"
            element={<ForgotPasswordForm Image={image} />}
          />

          {/* Reset Password Route */}
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordForm />}
          />

          <Route
            path="admin/reset-password/:token"
            element={<AdminResetPasswordForm />}
          />

          <Route
            path="/applyforloan"
            element={
              <ProtectedRoute>
                <ApplyForLoan Image={image} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/loanconfirmation"
            element={
              <ProtectedRoute>
                <LoanConfirmation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/terms-conditions"
            element={
              <ProtectedRoute>
                <TermsAndConditions Image={image} />
              </ProtectedRoute>
            }
          />

          <Route path="/home" element={<Home />} />
          <Route path="/admin" element={<AdminLogin />} />

          {/* Admin Routes - Apply adminOnly flag */}
          <Route
            path="/admin/userlist"
            element={
              <ProtectedRoute adminOnly={true}>
                <UserList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/forgot-password"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminForgotPass />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/contact-record"
            element={
              <ProtectedRoute adminOnly={true}>
                <ContactRecord />
              </ProtectedRoute>
            }
          />

          <Route
            path="admin/editprofile"
            element={
              <ProtectedRoute adminOnly={true}>
                <EditAdminProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="admin/visual-representation"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminGraph />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminAnalytics />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bank-details"
            element={
              <ProtectedRoute>
                <UserBankDetails Image={image} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/userloanlist/:id"
            element={
              <ProtectedRoute adminOnly={true}>
                <UsersLoanList />
              </ProtectedRoute>
            }
          />
          <Route path="/contact" element={<ContactSupport Image={image} />} />
          <Route path="/faq" element={<FAQ Image={image} />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
