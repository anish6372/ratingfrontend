import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [filters, setFilters] = useState({ name: "", email: "", address: "", role: "" });

  const fetchData = async () => {
    try {
      const [usersRes, storesRes, ratingsRes] = await Promise.all([
        axios.get("http://localhost:5001/api/admin/users", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        axios.get("http://localhost:5001/api/admin/stores", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        axios.get("http://localhost:5001/api/admin/ratings", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);
      setUsers(usersRes.data);
      setStores(storesRes.data);
      setRatings(ratingsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; 
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  
  
  const handleAddUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newUser = Object.fromEntries(formData.entries());
    try {
      const res = await axios.post("http://localhost:5001/api/admin/user", newUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  
      const createdUser = res.data.user; 
  
      setUsers((prevUsers) => [...prevUsers, createdUser]);
      e.target.reset();
    } catch (error) {
      console.error("Error adding user:", error.response?.data?.message || error.message);
    }
  };
  
  const handleAddStore = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newStore = Object.fromEntries(formData.entries()); 
    try {
      const res = await axios.post("http://localhost:5001/api/admin/stores", newStore, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const createdStore = res.data.store;
      setStores((prevStores) => [...prevStores, createdStore]);
      e.target.reset();
    } catch (error) {
      console.error("Error adding store:", error.response?.data?.message || error.message);
    }
  };
  
  
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      user.email.toLowerCase().includes(filters.email.toLowerCase()) &&
      user.address.toLowerCase().includes(filters.address.toLowerCase()) &&
      user.role.toLowerCase().includes(filters.role.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-600">Admin Dashboard</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={fetchData}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 text-sm"
            >
              Refresh Data
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-300 text-sm"
            >
              Logout
            </button>
          </div>
        </div>

       
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-blue-100 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
            <p className="text-2xl font-bold text-blue-600">{users.length}</p>
          </div>
          <div className="p-4 bg-green-100 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Stores</h3>
            <p className="text-2xl font-bold text-green-600">{stores.length}</p>
          </div>
          <div className="p-4 bg-yellow-100 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Ratings</h3>
            <p className="text-2xl font-bold text-yellow-600">{ratings.length}</p>
          </div>
        </div>

    
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Add New User</h3>
          <form onSubmit={handleAddUser} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              required
            />
            <select
              name="role"
              className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              required
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="STORE_OWNER">STORE OWNER</option>
            </select>
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 w-full"
            >
              Add User
            </button>
          </form>
        </div>

       
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Add New Store</h3>
          <form onSubmit={handleAddStore} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Store Name"
              className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Store Email"
              className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Store Address"
              className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              required
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-300 w-full"
            >
              Add Store
            </button>
          </form>
        </div>

        
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Filters</h3>
          <div className="grid grid-cols-4 gap-4">
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
              name="email"
              placeholder="Filter by Email"
              value={filters.email}
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
            <input
              type="text"
              name="role"
              placeholder="Filter by Role"
              value={filters.role}
              onChange={handleFilterChange}
              className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

     
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">User List</h3>
          <table className="table-auto w-full border-collapse border border-gray-300 bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-blue-100">
                <th className="border border-gray-300 p-3 text-left">Name</th>
                <th className="border border-gray-300 p-3 text-left">Email</th>
                <th className="border border-gray-300 p-3 text-left">Address</th>
                <th className="border border-gray-300 p-3 text-left">Role</th>
                <th className="border border-gray-300 p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-100">

                  <td className="border border-gray-300 p-3">{user.name}</td>
                  <td className="border border-gray-300 p-3">{user.email}</td>
                  <td className="border border-gray-300 p-3">{user.address}</td>
                  <td className="border border-gray-300 p-3">{user.role}</td>
                 
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Store List</h3>
          <table className="table-auto w-full border-collapse border border-gray-300 bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-blue-100">
                <th className="border border-gray-300 p-3 text-left">Name</th>
                <th className="border border-gray-300 p-3 text-left">Email</th>
                <th className="border border-gray-300 p-3 text-left">Address</th>
                <th className="border border-gray-300 p-3 text-left">Rating</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => (
                <tr key={store.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 p-3">{store.name}</td>
                  <td className="border border-gray-300 p-3">{store.email}</td>
                  <td className="border border-gray-300 p-3">{store.address}</td>
                  <td className="border border-gray-300 p-3">
                    {ratings.filter((r) => r.storeId === store.id).length}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
