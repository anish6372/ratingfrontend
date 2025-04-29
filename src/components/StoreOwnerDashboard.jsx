import React, { useEffect, useState } from "react";
import axios from "axios";

const StoreOwnerDashboard = () => {
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token is missing");
          return;
        }

        
        const storeResponse = await axios.get("http://localhost:5001/api/admin/stores", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStore(storeResponse.data);

        
        const ratingsResponse = await axios.get(
          `http://localhost:5001/api/ratings/store/${storeResponse.data.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRatings(ratingsResponse.data);

        // Calculate average rating
        const totalRating = ratingsResponse.data.reduce((sum, rating) => sum + rating.rating, 0);
        setAverageRating(
          ratingsResponse.data.length > 0 ? (totalRating / ratingsResponse.data.length).toFixed(1) : 0
        );
      } catch (error) {
        console.error("Error fetching store data:", error);
      }
    };

    fetchStoreData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; 
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setPasswordError("Token is missing. Please log in again.");
        return;
      }

      console.log("Token being sent:", token); 

      await axios.put(
        "http://localhost:5001/api/auth/update-password",
        { oldPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPasswordSuccess("Password updated successfully.");
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      setPasswordError(error.response?.data?.message || "Error updating password.");
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-600">Store Owner Dashboard</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-300 text-sm"
          >
            Logout
          </button>
        </div>

        {store && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Store Details</h3>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <p className="text-lg"><strong>Name:</strong> {store.name}</p>
              <p className="text-lg"><strong>Address:</strong> {store.address}</p>
              <p className="text-lg"><strong>Average Rating:</strong> {averageRating}</p>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Ratings Submitted by Users</h3>
          <table className="table-auto w-full border-collapse border border-gray-300 bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-blue-100">
                <th className="border border-gray-300 p-3 text-left">User Name</th>
                <th className="border border-gray-300 p-3 text-left">Rating</th>
                <th className="border border-gray-300 p-3 text-left">Comment</th>
              </tr>
            </thead>
            <tbody>
              {ratings.map((rating) => (
                <tr key={rating.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 p-3">{rating.user.name}</td>
                  <td className="border border-gray-300 p-3">{rating.rating}</td>
                  <td className="border border-gray-300 p-3">{rating.comment || "No Comment"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Update Password</h3>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            {passwordError && <p className="text-red-500">{passwordError}</p>}
            {passwordSuccess && <p className="text-green-500">{passwordSuccess}</p>}
            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 w-full"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;
