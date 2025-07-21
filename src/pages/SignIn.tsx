import React, { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

interface FormData {
  email: string;
  password: string;
  confirmPassword?: string;
  fullName?: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  fullName?: string;
}

const SignIn= () => {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (activeTab === "signup") {
      if (!formData.fullName) {
        newErrors.fullName = "Full name is required";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (activeTab === "signin") {
        console.log("Signing in with:", {
          email: formData.email,
          password: formData.password,
          rememberMe,
        });
        alert("Sign in successful! (Demo)");
      } else {
        console.log("Signing up with:", {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        });
        alert("Account created successfully! (Demo)");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab: "signin" | "signup") => {
    setActiveTab(tab);
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
    });
    setErrors({});
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Signing in with ${provider}`);
    alert(`${provider} login clicked! (Demo)`);
  };

  return (
    <div style={{ padding: "32px 0", minHeight: "calc(100vh - 80px)" }}>
      <div
        className="container"
        style={{ maxWidth: "1200px", margin: "0 auto", padding: " 0 20px" }}
      >
        <div style={{ maxWidth: "440px", margin: "0 auto" }}>
          <div
            className="card"
            style={{
              background: "rgba(24, 24, 24, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "24px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
            }}
          >
            {/* <div className="card-header text-center"> */}
              {/* <div
                style={{
                  width: "80px",
                  height: "80px",
                  background:
                    "linear-gradient(135deg, #2a2a2a 0%, #4a4a4a 100%)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                  fontSize: "32px",
                  border: "2px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.5)",
                }}
              >
                👤
              </div> */}
              {/* <h2
                className="card-title"
                style={{
                  fontSize: "28px",
                  marginBottom: "8px",
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #b0b0b0 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {activeTab === "signin" ? "Welcome Back" : "Create Account"}
              </h2>
              <p style={{ color: "#a0a0a0", fontSize: "16px" }}>
                {activeTab === "signin"
                  ? "Sign in to access your weather dashboard"
                  : "Join WeatherWise for personalized forecasts"}
              </p> */}
            {/* </div> */}

            <div className="card-content" style={{ padding: "32px" }}>
              <div className="card-header text-center">
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  background:
                    "linear-gradient(135deg, #2a2a2a 0%, #4a4a4a 100%)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                  fontSize: "32px",
                  border: "2px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.5)",
                }}
              >
                👤
              </div>
              <div style={{margin:"10px"}}>
                <h2
                className="card-title"
                style={{
                  fontSize: "28px",
                  marginBottom: "8px",
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #b0b0b0 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {activeTab === "signin" ? "Welcome Back" : "Create Account"}
              </h2>
              <p style={{ color: "#a0a0a0", fontSize: "16px" }}>
                {activeTab === "signin"
                  ? "Sign in to access your weather dashboard"
                  : "Join SkyCast for personalized forecasts"}
              </p>
              </div>
            </div>
              {/* Tab Navigation */}
              <div
                style={{
                  display: "flex",
                  borderRadius: "12px",
                  background: "rgba(20, 20, 20, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  overflow: "hidden",
                  marginBottom: "32px",
                  padding: "4px",
                }}
              >
                <button
                  onClick={() => handleTabChange("signin")}
                  style={{
                    flex: 1,
                    padding: "12px 24px",
                    border: "none",
                    borderRadius: "8px",
                    background:
                      activeTab === "signin"
                        ? "linear-gradient(135deg, #2a2a2a 0%, #4a4a4a 100%)"
                        : "transparent",
                    color: activeTab === "signin" ? "#ffffff" : "#a0a0a0",
                    fontWeight: activeTab === "signin" ? "600" : "400",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    fontSize: "14px",
                  }}
                >
                  Login
                </button>
                <button
                  onClick={() => handleTabChange("signup")}
                  style={{
                    flex: 1,
                    padding: "12px 24px",
                    border: "none",
                    borderRadius: "8px",
                    background:
                      activeTab === "signup"
                        ? "linear-gradient(135deg, #2a2a2a 0%, #4a4a4a 100%)"
                        : "transparent",
                    color: activeTab === "signup" ? "#ffffff" : "#a0a0a0",
                    fontWeight: activeTab === "signup" ? "600" : "400",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    fontSize: "14px",
                  }}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Full Name (Sign Up Only) */}
                {activeTab === "signup" && (
                  <div style={{ marginBottom: "24px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#ffffff",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="input"
                      style={{
                      width: "100%",
                      padding: "16px 20px",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      borderRadius: "12px",
                      background:
                        "linear-gradient(135deg, rgba(10, 10, 10, 0.8) 0%, rgba(20, 20, 20, 0.7) 50%, rgba(30, 30, 30, 0.6) 100%)",
                      color: "#ffffff",
                      fontSize: "15px",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.03)",
                      borderColor: errors.fullName
                          ? "#ff6b6b"
                          : "rgba(255, 255, 255, 0.1)",
                    }}
                    />
                    {errors.fullName && (
                      <span
                        style={{
                          color: "#ff6b6b",
                          fontSize: "12px",
                          marginTop: "4px",
                          display: "block",
                        }}
                      >
                        {errors.fullName}
                      </span>
                    )}
                  </div>
                )}

                {/* Email */}
                <div style={{ marginBottom: "24px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    style={{
                      width: "100%",
                      padding: "16px 20px",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      borderRadius: "12px",
                      background:
                        "linear-gradient(135deg, rgba(10, 10, 10, 0.8) 0%, rgba(20, 20, 20, 0.7) 50%, rgba(30, 30, 30, 0.6) 100%)",
                      color: "#ffffff",
                      fontSize: "15px",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.03)",
                    }}
                  />
                  {errors.email && (
                    <span
                      style={{
                        color: "#ff6b6b",
                        fontSize: "12px",
                        marginTop: "4px",
                        display: "block",
                      }}
                    >
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Password */}
                <div style={{ marginBottom: "24px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder={
                        activeTab === "signin"
                          ? "Enter your password"
                          : "Create a password"
                      }
                      style={{
                        width: "100%",
                        padding: "16px 20px",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                        borderRadius: "12px",
                        background:
                          "linear-gradient(135deg, rgba(10, 10, 10, 0.8) 0%, rgba(20, 20, 20, 0.7) 50%, rgba(30, 30, 30, 0.6) 100%)",
                        color: "#ffffff",
                        fontSize: "15px",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.03)",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: "#a0a0a0",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}

                    </button>
                  </div>
                  {errors.password && (
                    <span
                      style={{
                        color: "#ff6b6b",
                        fontSize: "12px",
                        marginTop: "4px",
                        display: "block",
                      }}
                    >
                      {errors.password}
                    </span>
                  )}
                </div>

                {/* Confirm Password (Sign Up Only) */}
                {activeTab === "signup" && (
                  <div style={{ marginBottom: "24px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#ffffff",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      className="input"
                      style={{
                      width: "100%",
                      padding: "16px 20px",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      borderRadius: "12px",
                      background:
                        "linear-gradient(135deg, rgba(10, 10, 10, 0.8) 0%, rgba(20, 20, 20, 0.7) 50%, rgba(30, 30, 30, 0.6) 100%)",
                      color: "#ffffff",
                      fontSize: "15px",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.03)",
                      borderColor: errors.fullName
                          ? "#ff6b6b"
                          : "rgba(255, 255, 255, 0.1)",
                    }}
                    />
                    {errors.confirmPassword && (
                      <span
                        style={{
                          color: "#ff6b6b",
                          fontSize: "12px",
                          marginTop: "4px",
                          display: "block",
                        }}
                      >
                        {errors.confirmPassword}
                      </span>
                    )}
                  </div>
                )}

                {/* Remember Me (Sign In Only) */}
                {activeTab === "signin" && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "24px",
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "#a0a0a0",
                        fontSize: "14px",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        style={{
                          width: "16px",
                          height: "16px",
                          accentColor: "#4a4a4a",
                        }}
                      />
                      Remember me
                    </label>
                    <button
                      type="button"
                      style={{
                        background: "none",
                        border: "none",
                        color: "#6a6a6a",
                        fontSize: "14px",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      onClick={() => alert("Password reset clicked! (Demo)")}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary"
                  style={{
                    width: "100%",
                    padding: "16px",
                    fontSize: "16px",
                    fontWeight: "600",
                    background: isLoading
                      ? "rgba(74, 74, 74, 0.5)"
                      : "linear-gradient(135deg, #2a2a2a 0%, #4a4a4a 100%)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    marginBottom: "24px",
                  }}
                >
                  {isLoading ? (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                    >
                      <span>⏳</span>
                      {activeTab === "signin"
                        ? "Signing In..."
                        : "Creating Account..."}
                    </span>
                  ) : activeTab === "signin" ? (
                    "Sign In"
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              {/* Divider */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "24px",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    background: "rgba(255, 255, 255, 0.1)",
                  }}
                />
                <span style={{ color: "#a0a0a0", fontSize: "14px" }}>or</span>
                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    background: "rgba(255, 255, 255, 0.1)",
                  }}
                />
              </div>

              {/* Social Login */}
              <div
                style={{ display: "flex", gap: "12px", marginBottom: "32px" }}
              >
                <button
                  type="button"
                  onClick={() => handleSocialLogin("Google")}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "rgba(20, 20, 20, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    color: "#ffffff",
                    cursor: "pointer",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(40, 40, 40, 0.8)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(20, 20, 20, 0.8)";
                  }}
                >
                  🔍 Google
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin("GitHub")}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "rgba(20, 20, 20, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    color: "#ffffff",
                    cursor: "pointer",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(40, 40, 40, 0.8)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(20, 20, 20, 0.8)";
                  }}
                >
                  🐙 GitHub
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
