import React, { useState, useEffect } from "react";
import MyProfile from "./MyProfile";
import AskLoan from "./AskLoan";
import Lend from "./Lend"

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("ask");
  const [username, setUsername] = useState("User");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData?.username) {
      setUsername(userData.username);
    }
  }, []);


  const renderTab = () => {
    if (activeTab === "ask") return <AskLoan />;
    if (activeTab === "lend") return <Lend />;
    return <MyProfile />;
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-green-400">Credichain</h1>
        <p className="text-gray-400 mt-2">
          Welcome, <span className="text-white font-semibold">{username}</span>
        </p>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <button onClick={() => setActiveTab("ask")} className={`px-4 py-2 rounded ${activeTab === "ask" ? "bg-green-600" : "bg-gray-800"}`}>Ask a Loan</button>
        <button onClick={() => setActiveTab("lend")} className={`px-4 py-2 rounded ${activeTab === "lend" ? "bg-green-600" : "bg-gray-800"}`}>Lend</button>
        <button onClick={() => setActiveTab("profile")} className={`px-4 py-2 rounded ${activeTab === "profile" ? "bg-green-600" : "bg-gray-800"}`}>My Profile</button>
      </div>

      <div className="bg-[#1A1D20] p-6 rounded shadow-lg">
        {renderTab()}
      </div>
    </div>
  );
}
