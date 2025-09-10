import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

function ProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // If you store profile info in user model itself:
        const res = await api.get(`users/${id}/public_profile/`);  
        setProfile(res.data);

        // If you want extended profile fields:
        // const res = await api.get(`user-profiles/${id}/`);
        // setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [id]);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div style={{ maxWidth: 600, margin: "20px auto", padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
      <h2>{profile.username}</h2>
      <p><strong>First Name:</strong> {profile.first_name}</p>
      <p><strong>Last Name:</strong> {profile.last_name}</p>
      <p><strong>Role:</strong> {profile.role}</p>
    </div>
  );
}

export default ProfilePage;
