import React, { useState } from "react";
import Button from "../../components/common/Button";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+2348012345678",
  });

  const handleUpdate = () => {
    alert("Profile updated!");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Your Profile</h2>

      <div className="bg-white shadow rounded-lg p-6 max-w-md">
        <div className="flex flex-col gap-4">
          <label className="flex flex-col">
            Name
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="px-3 py-2 border rounded-md focus:outline-none"
            />
          </label>

          <label className="flex flex-col">
            Email
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="px-3 py-2 border rounded-md focus:outline-none"
            />
          </label>

          <label className="flex flex-col">
            Phone
            <input
              type="text"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="px-3 py-2 border rounded-md focus:outline-none"
            />
          </label>

          <Button label="Update Profile" onClick={handleUpdate} variant="primary" />
        </div>
      </div>
    </div>
  );
}
