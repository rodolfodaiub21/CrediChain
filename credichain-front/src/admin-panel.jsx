import React, { useEffect, useState } from 'react';

export default function AdminPanel() {
  const [pendingUsers, setPendingUsers] = useState([]);

  const fetchPendingUsers = async () => {
    console.log(pendingUsers.student_id_photo)
    try {
      const response = await fetch("http://localhost:8000/api/pending-users/");
      const data = await response.json();
      setPendingUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const approveUser = async (uid) => {
    try {
      const response = await fetch(`http://localhost:8000/api/approve-user/${uid}/`, {
        method: "POST"
      });
      if (response.ok) {
        alert("Usuario aprobado.");
        fetchPendingUsers();  // Refresh the list
      }
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  return (
    <div className="p-4 text-white">
      <h2 className="text-xl font-bold mb-4">User requests</h2>
      <div className="space-y-8">
        {pendingUsers.map((user) => (
          <div key={user.uid} className="bg-gray-800 p-4 rounded">
            <p><strong>Nombre:</strong> {user.full_name}</p>
            <p><strong>Correo:</strong> {user.email}</p>
            <p><strong>ID:</strong> {user.student_id}</p>
            <img src={`http://localhost:8000/${user.student_id_photo}`} alt="Student ID" />

            <button onClick={() => approveUser(user.uid)} className="bg-green-500 px-4 py-2 rounded">Aprobar</button>
          </div>
        ))}
      </div>
    </div>
  );
}