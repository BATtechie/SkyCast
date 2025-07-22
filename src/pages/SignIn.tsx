import { useState, useEffect } from "react";
import "./SignIn.css";
import { Eye, EyeClosed } from "lucide-react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogin && confirmPassword) {
      setPasswordMismatch(password !== confirmPassword);
    } else {
      setPasswordMismatch(false);
    }
  }, [password, confirmPassword, isLogin]);

  const handleSubmit = async () => {
    setAuthError("");
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setAuthError(error.message);
      } else {
        navigate("/dashboard"); // redirect on success
      }
    } else {
      if (passwordMismatch || !isEmailValid) return;

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (error) {
        setAuthError(error.message);
      } else {
        alert("Check your email for verification link.");
        setIsLogin(true);
        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    }

    setLoading(false);
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
        <p className="subtext">
          {isLogin
            ? "Log in to access your weather dashboard"
            : "Sign up to start using the weather dashboard"}
        </p>

        <div className="auth-toggle">
          <div className={`slider ${isLogin ? "left" : "right"}`} />
          <button
            className={isLogin ? "active" : ""}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={!isLogin ? "active" : ""}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        {!isLogin && (
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
        )}

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              const value = e.target.value;
              setEmail(value);

              if (value.trim() === "") {
                setIsEmailValid(true);
              } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                setIsEmailValid(emailRegex.test(value));
              }
            }}
          />
          {email.trim() !== "" && !isEmailValid && (
            <p className="warning-text">Enter a valid email address</p>
          )}
        </div>

        <div className="form-group password-input">
          <label>Password</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="eye-toggle"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
          </button>
        </div>

        {!isLogin && (
          <div className="form-group password-input">
            <label>Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="eye-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
            </button>
          </div>
        )}
        {passwordMismatch && (
          <p className="warning-text">Passwords do not match</p>
        )}
        {authError && <p className="warning-text">{authError}</p>}

        <button
          className="signin-submit"
          disabled={loading || (!isLogin && (passwordMismatch || !isEmailValid))}
          onClick={handleSubmit}
        >
          {loading
            ? "Processing..."
            : isLogin
            ? "Sign In"
            : "Sign Up"}
        </button>
      </div>
    </div>
  );
};

export default SignIn;
