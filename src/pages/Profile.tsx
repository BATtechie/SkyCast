// src/components/Profile.tsx
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { ArrowLeft, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./Profile.css";

interface UserProfile {
  fullName: string;
  email: string;
  role: string;
  joinedDate: string;
}

const Profile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);

        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          setError("You are not signed in.");
          setUser(null);
          return;
        }

        const fullName = user.user_metadata?.full_name || "SkyCast User";
        const role = user.user_metadata?.role || "user";
        const joinedDate = new Date(user.created_at).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        );

        setUser({
          fullName,
          email: user.email ?? "No email",
          role,
          joinedDate,
        });
      } catch (err) {
        console.error("Error loading user profile:", err);
        setError("Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleBack = () => {
    window.history.back();
  };
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/signin");
  };

  if (loading) {
    return (
      <div className="profile-page-wrapper">
        <div
          className="profile-container"
          style={{ textAlign: "center", color: "#ccc", fontSize: "1.2em" }}
        >
          Loading profile...
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="profile-page-wrapper">
        <div
          className="profile-container"
          style={{ textAlign: "center", color: "#ff6b6b", fontSize: "1.2em" }}
        >
          {error}
          <button
            className="back-button"
            onClick={handleBack}
            style={{ marginTop: "20px" }}
          >
            <ArrowLeft size={20} /> Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page-wrapper">
      <div className="profile-container">
        <div className="profile-header-card">
          <div className="profile-avatar">
            {user.fullName.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="profile-details-card">
          <h3 className="details-title">Profile Details</h3>
          <div className="details-grid">
            <div className="detail-item">
              <label className="detail-label">Full Name</label>
              <p className="detail-value">{user.fullName}</p>
            </div>
            <div className="detail-item">
              <label className="detail-label">Email</label>
              <p className="detail-value">{user.email}</p>
            </div>

            <div className="detail-item">
              <label className="detail-label">Joined Date</label>
              <p className="detail-value">{user.joinedDate}</p>
            </div>
          </div>

          <div className="profile-buttons">
            <button className="back-button" onClick={handleBack}>
              <ArrowLeft size={20} /> Back
            </button>
            <button className="logout-button-inline" onClick={handleLogout}>
              <LogOut size={18} style={{ marginRight: "6px" }} /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
