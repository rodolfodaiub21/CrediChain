import React, { useState } from "react";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "", 
    studentID: "",
    wallet: "",
    photo: null
  });

  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (e) => {
    if (e.target.name === "photo") {
      setFormData({ ...formData, photo: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("full_name", formData.fullName);
    formDataToSend.append("student_id", formData.studentID);
    formDataToSend.append("wallet_address", formData.wallet);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("student_id_photo", formData.photo);

    try {
      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        body: formDataToSend
      });

      const result = await response.json();
      if (response.ok) {
        setStatusMessage("Correct register. It will be reveiwed by admin.");
        setFormData({
          fullName: "",
          email: "",
          studentID: "",
          wallet: "",
          photo: null
        });
      } else {
        if (result.student_id){
          setStatusMessage("This studentid is already registered");
        }else if (result.wallet_address){
          setStatusMessage("This wallet address is already registered");
        }
      }
    } catch (error) {
      console.error("Error al registrar:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1D20] flex items-center justify-center text-white px-4">
      <form
        className="bg-[#2B2E31] p-8 rounded-lg shadow-md w-full max-w-md space-y-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center mb-4">Register - Credichain</h2>

        <input type="text" name="fullName" placeholder="Full name"
          className="w-full p-2 rounded bg-gray-800" required
          value={formData.fullName} onChange={handleChange}
        />

        <input type="email" name="email" placeholder="Email"
          className="w-full p-2 rounded bg-gray-800"
          value={formData.email} onChange={handleChange}
        />

        <input type="text" name="studentID" placeholder="Student ID"
          className="w-full p-2 rounded bg-gray-800" required
          value={formData.studentID} onChange={handleChange}
        />

        <input type="text" name="wallet" placeholder="Wallet address"
          className="w-full p-2 rounded bg-gray-800" required
          value={formData.wallet} onChange={handleChange}
        />

        <label className="block text-sm text-gray-400">Student ID photo</label>
        <input type="file" name="photo"
          accept="image/*"
          className="w-full p-2 bg-gray-800 text-white"
          required onChange={handleChange}
        />

        <button type="submit"
          className="w-full bg-green-400 text-black py-2 rounded hover:bg-green-300">
          Submit
        </button>

        {statusMessage && (
          <p className="text-sm text-center text-green-300 mt-2">{statusMessage}</p>
        )}
      </form>
    </div>
  );
}
