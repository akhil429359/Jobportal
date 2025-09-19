import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

function ProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`users/${id}/public_profile/`);
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, [id]);

  if (!profile) return <p>Loading profile...</p>;

  const avatar = profile.profile_image ? (
    <img
      src={profile.profile_image}
      alt={profile.username}
      style={{
        width: 120,
        height: 120,
        borderRadius: "50%",
        objectFit: "cover",
      }}
    />
  ) : (
    <div
      style={{
        width: 120,
        height: 120,
        borderRadius: "50%",
        background: "#4CAF50",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: "bold",
        fontSize: 48,
        textTransform: "uppercase",
      }}
    >
      {profile.username.charAt(0)}
    </div>
  );

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "20px auto",
        padding: 20,
        border: "1px solid #ddd",
        borderRadius: 8,
        textAlign: "center",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        {avatar}
      </div>
      <h2>{profile.username}</h2>
      <p><strong>First Name:</strong> {profile.first_name}</p>
      <p><strong>Last Name:</strong> {profile.last_name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      {profile.role && <p><strong>Role:</strong> {profile.role}</p>}
    </div>
  );
}

export default ProfilePage;
