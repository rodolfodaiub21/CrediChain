import React, { useState, useRef } from "react";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    studentID: "",
    password: "",
    photo: null
  });

  const [statusMessage, setStatusMessage] = useState("");
  const [registered, setRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    if (e.target.name === "photo") {
      setFormData({ ...formData, photo: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage("");

    const formDataToSend = new FormData();
    formDataToSend.append("full_name", formData.fullName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("student_id", formData.studentID);
    formDataToSend.append("password", formData.password);
    if (formData.photo) {
      formDataToSend.append("student_id_photo", formData.photo);
    }

    try {
      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        body: formDataToSend
      });
      console.log("Status: ",response.staus)
      console.log("FUCKING RESPONSE",response)

      if (response.status === 201) {
        setRegistered(true);
        setStatusMessage("Complete Register now is under verification.");
        setFormData({
          fullName: "",
          email: "",
          studentID: "",
          password: "",
          photo: null
        });
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        const result = await response.json().catch(() => ({}));
        
        if (result.student_id) {
          setStatusMessage("Este student ID ya está registrado.");
        } else if (result.email) {
          setStatusMessage("Este correo ya está registrado.");
        } else {
          setStatusMessage(result.message || "Error desconocido al registrar.");
        }
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      setStatusMessage("Error al conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="min-h-screen bg-[#1A1D20] flex items-center justify-center text-white px-4">
        <div className="bg-[#2B2E31] p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to CrediChain!</h2>
          <p className="text-green-300">
            Your register was submitted and now is under verification. This could last a day or two.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1D20] flex items-center justify-center text-white px-4">
      <form
        className="bg-[#2B2E31] p-8 rounded-lg shadow-md w-full max-w-md space-y-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center mb-4">Register - Credichain</h2>

        <div>
          <label htmlFor="fullName" className="block text-sm text-gray-400 mb-1">Full name</label>
          <input 
            id="fullName"
            type="text" 
            name="fullName" 
            className="w-full p-2 rounded bg-gray-800" 
            required
            value={formData.fullName} 
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm text-gray-400 mb-1">Email</label>
          <input 
            id="email"
            type="email" 
            name="email" 
            className="w-full p-2 rounded bg-gray-800" 
            required
            value={formData.email} 
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm text-gray-400 mb-1">Password</label>
          <input 
            id="password"
            type="password" 
            name="password" 
            className="w-full p-2 rounded bg-gray-800" 
            required
            value={formData.password} 
            onChange={handleChange}
            minLength="6"
          />
        </div>

        <div>
          <label htmlFor="studentID" className="block text-sm text-gray-400 mb-1">Student ID</label>
          <input 
            id="studentID"
            type="text" 
            name="studentID" 
            className="w-full p-2 rounded bg-gray-800" 
            required
            value={formData.studentID} 
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="photo" className="block text-sm text-gray-400 mb-1">Student ID photo</label>
          <input 
            id="photo"
            type="file" 
            name="photo"
            ref={fileInputRef}
            accept="image/*"
            className="w-full p-2 bg-gray-800 text-white"
            required 
            onChange={handleChange}
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-green-400 text-black py-2 rounded hover:bg-green-300 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Submit"}
        </button>

        {statusMessage && (
          <p className={`text-sm text-center mt-2 ${
            statusMessage.includes("Complete") ? "text-green-400" : "text-red-400"
          }`}>
            {statusMessage}
          </p>
        )}
      </form>
    </div>
  );
}