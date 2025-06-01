import { useEffect, useState } from "react";
import { ethers } from "ethers";
import CreditScoreABI from "./CreditScoreABI.json";

function AskLoan() {
  const [loanList, setLoanList] = useState([]);
  const [amount, setAmount] = useState("");
  const [interest, setInterest] = useState("");
  const [creditScore, setCreditScore] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [installments, setInstallments] = useState(false);
  const [numInstallments, setNumInstallments] = useState("");

  const contractAddress = "0x24EF60e36437A86Bd0cf24FB70d85d8A1Bd1E7c6";

  // Obtener préstamos de la API
  useEffect(() => {
    fetch("http://localhost:8000/api/ask_loan/")
      .then((res) => res.json())
      .then((data) => {
        setLoanList(data.data);
      });
  }, []);

  // Obtener score desde blockchain
  useEffect(() => {
    const fetchScore = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          setWalletAddress(address);

          const contract = new ethers.Contract(contractAddress, CreditScoreABI, provider);
          const score = await contract.getScore(address);
          setCreditScore(Number(score));
        }
      } catch (err) {
        console.error("Error obtaining blockchain score:", err);
      }
    };

    fetchScore();
  }, []);

  // Crear préstamo nuevo en blockchain + backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, CreditScoreABI, signer);

      const ethAmount = ethers.parseEther(amount);
      const intRate = parseInt(interest);
      const installmentsCount = installments ? parseInt(numInstallments) : 1;
      const deadline = Math.floor(Date.now() / 1000) + 24 * 60 * 60; // 1 día

      // 1. Solicitar préstamo en blockchain
      const tx = await contract.requestLoan(ethAmount, intRate, installmentsCount, deadline);
      await tx.wait();

      // 2. Guardar en backend
      const studentData = JSON.parse(localStorage.getItem("userData"));
      const response = await fetch("http://localhost:8000/api/ask_loan/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: studentData.student_id,
          wallet_address: await signer.getAddress(),
          amount: parseFloat(amount),
          interest: parseFloat(interest),
          credit_score: creditScore,
          installments: installments,
          num_installments: installments ? parseInt(numInstallments) : null,
        }),
      });

      const result = await response.json();
      if (result.status === "success") {
        alert("Loan successfully requested on-chain and off-chain ✅");
        window.location.reload();
      } else {
        alert("Error saving loan to backend");
      }

    } catch (error) {
      console.error("Error requesting loan:", error);
      alert("Error requesting loan");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Available Loans</h2>
      {loanList.map((loan) => (
        <div key={loan.id} className="border rounded p-3 mb-2">
          <p><strong>Amount:</strong> {loan.amount} ETH</p>
          <p><strong>Interest rate:</strong> {loan.interest}%</p>
          <p><strong>Score:</strong> {loan.credit_score}</p>
          <p><strong>Installments:</strong> {loan.installments ? "Yes" : "No"}</p>
          {loan.installments && loan.num_installments && (
            <p><strong>Number of Installments:</strong> {loan.num_installments}</p>
          )}
          <button className="bg-green-600 text-white px-2 py-1 mt-2 rounded">
            Accept
          </button>
        </div>
      ))}

      <hr className="my-6" />

      <h2 className="text-xl font-bold mb-4">Ask for a Loan</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Amount (ETH)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded w-full text-black"
        />
        <input
          type="text"
          placeholder="Interest (%)"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          className="border p-2 rounded w-full text-black"
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={installments}
            onChange={(e) => setInstallments(e.target.checked)}
          />
          <span className="text-white">Pay with installments?</span>
        </label>
        {installments && (
          <input
            type="number"
            placeholder="Number of Installments"
            value={numInstallments}
            onChange={(e) => setNumInstallments(e.target.value)}
            className="border p-2 rounded w-full text-black"
            min="1"
          />
        )}
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Ask Loan
        </button>
      </form>
    </div>
  );
}

export default AskLoan;
