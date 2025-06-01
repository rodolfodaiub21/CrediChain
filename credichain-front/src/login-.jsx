import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // ✅ usa el hook de navegación

export default function LoginForm() {
  const [formData, setFormData] = useState({
    studentID: "",
    password: ""
  });

  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();  // ✅ hook para redirección

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage("");

    // ✅ Validación admin local
    if (formData.studentID === "root" && formData.password === "root") {
      navigate("/AdminPanel");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        setStatusMessage("Login successful.");
        localStorage.setItem("userData", JSON.stringify(result));
        navigate("/UserDashboard");  // ✅ cambia a tu ruta real
      } else {
        const result = await response.json();
        setStatusMessage(result.message || "Invalid credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setStatusMessage("User or incorrect password");
    } finally {
      setIsLoading(false);
    }
    
  };

  return (
    <div className="min-h-screen bg-[#1A1D20] flex items-center justify-center text-white px-4">
      <form
        className="bg-[#2B2E31] p-8 rounded-lg shadow-md w-full max-w-md space-y-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center mb-4">Login - Credichain</h2>

        <input
          type="text"
          name="studentID"
          placeholder="Student ID"
          className="w-full p-2 rounded bg-gray-800"
          required
          value={formData.studentID}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 rounded bg-gray-800"
          required
          value={formData.password}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-green-400 text-black py-2 rounded hover:bg-green-300 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        {statusMessage && (
          <p className={`text-sm text-center mt-2 ${statusMessage.includes("success") ? "text-green-400" : "text-red-400"}`}>
            {statusMessage}
          </p>
        )}
      </form>
    </div>
  );
}
