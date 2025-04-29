import React, { useEffect, useState } from "react";
import axios from "axios";

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [filters, setFilters] = useState({ name: "", address: "" });
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token is missing");
          return;
        }

        
        const response = await axios.get("http://localhost:5001/api/admin/stores", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStores(response.data);
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };

    const fetchUserRatings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token is missing");
          return;
        }

        const response = await axios.get("http://localhost:5001/api/ratings/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ratings = response.data.reduce((acc, rating) => {
          acc[rating.storeId] = rating;
          return acc;
        }, {});
        setUserRatings(ratings);
      } catch (error) {
        console.error("Error fetching user ratings:", error);
      }
    };

    fetchStores();
    fetchUserRatings();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleRatingSubmit = async (storeId, ratingValue) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing");
        return;
      }

      const existingRating = userRatings[storeId];
      if (existingRating) {
        await axios.put(
          `http://localhost:5001/api/ratings/${existingRating.id}`,
          { rating: ratingValue },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          "http://localhost:5001/api/ratings",
          { storeId, rating: ratingValue },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      const response = await axios.get("http://localhost:5001/api/ratings/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ratings = response.data.reduce((acc, rating) => {
        acc[rating.storeId] = rating;
        return acc;
      }, {});
      setUserRatings(ratings);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      store.address.toLowerCase().includes(filters.address.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-600">User Dashboard</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-300 text-sm"
          >
            Logout
          </button>
        </div>

        
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Search Stores</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Filter by Name"
              value={filters.name}
              onChange={handleFilterChange}
              className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="address"
              placeholder="Filter by Address"
              value={filters.address}
              onChange={handleFilterChange}
              className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

       
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Store List</h3>
          <table className="table-auto w-full border-collapse border border-gray-300 bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-blue-100">
                <th className="border border-gray-300 p-3 text-left">Store Name</th>
                <th className="border border-gray-300 p-3 text-left">Address</th>
                <th className="border border-gray-300 p-3 text-left">Overall Rating</th>
                <th className="border border-gray-300 p-3 text-left">Your Rating</th>
                <th className="border border-gray-300 p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStores.map((store) => (
                <tr key={store.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 p-3">{store.name}</td>
                  <td className="border border-gray-300 p-3">{store.address}</td>
                  <td className="border border-gray-300 p-3">
                    {store.averageRating || "No Ratings"}
                  </td>
                  <td className="border border-gray-300 p-3">
                    {userRatings[store.id]?.rating || "Not Rated"}
                  </td>
                  <td className="border border-gray-300 p-3">
                    <select
                      value={userRatings[store.id]?.rating || ""}
                      onChange={(e) => handleRatingSubmit(store.id, parseInt(e.target.value))}
                      className="p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="" disabled>
                        Rate
                      </option>
                      {[1, 2, 3, 4, 5].map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        
        <div className="mb-8 mt-8">
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

export default UserDashboard;
