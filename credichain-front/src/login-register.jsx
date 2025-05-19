import {Link} from "react-router-dom"
export default function AuthMenu() {
  return (
    <div className="min-h-screen bg-[#1A1D20] flex items-center justify-center text-white">
      <div className="bg-[#2B2E31] p-8 rounded-lg shadow-md w-full max-w-sm">
        <div className="text-center mb-6">
          <img src="/credichain_logo_white_and_green.png" alt="Logo" className="mx-auto mt-10 w-32" />
          <h1 className="text-2xl font-bold">Credichain</h1>
          <p className="text-gray-400 text-sm mt-1">Decentralized Credit Platform</p>
        </div>

        <div className="space-y-4">
          <button className="w-full bg-green-400 text-black py-2 rounded hover:bg-green-300">
            Login
          </button>
          <Link to="/registerform">
          <button className="w-full border border-gray-600 py-2 rounded hover:bg-gray-800 mt-4">
            Register
          </button>
          </Link>
            <p className="text-green-400 text-sm text-center hover:underline cursor-pointer">Forgot Password ?</p>
            <p className="text-green-400 text-sm text-center hover:underline cursor-pointer">Support</p>
          <div className="border-t border-gray-700 my-4"></div>
        </div>
      </div>
    </div>
  );
}
