import { useNavigate, Outlet, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Verification from "./EmailSignUp/Verification";
import { useDispatch } from "react-redux";
import React from "react";

const PrivateRoute = () => {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const [verified, setVerified] = React.useState(false);
  const [email, setEmail] = React.useState(null);


  const location = useLocation();

  React.useEffect(() => {
    const verifyEmail = async () => {
      try {
        const id = userInfo._id;
        const response = await fetch("/api/users/verify-Check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (response.ok) {
          const data = await response.json();

          if (data.isVerified) {
            setVerified(true);
            setEmail(data.email);
          }
        } else {
          console.error("Verification failed. Please request a new link.");
        }
      } catch (error) {
        console.log("Verification error:", error);
        alert("An error occurred. Please try again.");
      }
    };

    if (userInfo) {
      verifyEmail();
    }
  }, []);

  if (!userInfo) {
    return <Navigate to="/signin" replace />;
  }

  if (location.pathname === "/verify-email") {
    return <Outlet />;
  }

  if (!verified) {
    const styles = {
      height: "400px",
      fontSize: "1.3em", // Latest value for font-size takes precedence
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "#61605e",
      fontWeight: 200,
      padding: "10px",
    };

    return (
      <h1 style={styles}>
        Please verify your email by clicking the link sent to {userInfo.email}
      </h1>
    );
  }

  return <Outlet />;
};

export default PrivateRoute;
