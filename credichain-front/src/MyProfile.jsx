import { useEffect, useState } from "react";
import { ethers } from "ethers";
import CreditScoreABI from "./CreditScoreABI.json";

function MyProfile() {
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [connected, setConnected] = useState(false);
  const [creditScore, setCreditScore] = useState(null);
  const [myLoans, setMyLoans] = useState([]);
  const [lentLoans, setLentLoans] = useState([]);
  const [canPay, setCanPay] = useState({});

  const contractAddress = "0x24EF60e36437A86Bd0cf24FB70d85d8A1Bd1E7c6";
  const INSTALLMENT_INTERVAL = 10 * 60; // 10 minutos en segundos

  const getContract = (providerOrSigner) => {
    return new ethers.Contract(contractAddress, CreditScoreABI, providerOrSigner);
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      const ethBalance = ethers.formatEther(balance);

      setWalletAddress(address);
      setBalance(ethBalance);
      setConnected(true);
      localStorage.setItem("walletAddress", address);

      const contract = getContract(provider);
      const score = await contract.getScore(address);
      setCreditScore(Number(score));

      const userLoans = await contract.getLoansByUser(address);
      const fundedLoans = await contract.getLentLoansByUser(address);
      setMyLoans(userLoans);
      setLentLoans(fundedLoans);

      const block = await provider.getBlock("latest");
      const now = block.timestamp;

      const newCanPay = {};
      userLoans.forEach((loan) => {
        const lastPaid = Number(loan.lastPaymentTimestamp);
        const nextAllowed = lastPaid + INSTALLMENT_INTERVAL;
        newCanPay[loan.id] = loan.paymentsMade === 0 || now >= nextAllowed;
      });
      setCanPay(newCanPay);

      const userData = JSON.parse(localStorage.getItem("userData"));
      await fetch("http://localhost:8000/api/user_wallet_info/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: userData.student_id,
          wallet_address: address,
          balance: ethBalance,
          credit_score: Number(score),
        }),
      });

    } catch (err) {
      console.error("Error connecting wallet:", err);
    }
  };

  const autoConnect = async () => {
    const storedAddress = localStorage.getItem("walletAddress");
    if (storedAddress && window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = getContract(provider);

      const balance = await provider.getBalance(storedAddress);
      const ethBalance = ethers.formatEther(balance);
      const score = await contract.getScore(storedAddress);
      const userLoans = await contract.getLoansByUser(storedAddress);
      const fundedLoans = await contract.getLentLoansByUser(storedAddress);

      setWalletAddress(storedAddress);
      setBalance(ethBalance);
      setCreditScore(Number(score));
      setMyLoans(userLoans);
      setLentLoans(fundedLoans);
      setConnected(true);

      const block = await provider.getBlock("latest");
      const now = block.timestamp;

      const newCanPay = {};
      userLoans.forEach((loan) => {
        const lastPaid = Number(loan.lastPaymentTimestamp);
        const nextAllowed = lastPaid + INSTALLMENT_INTERVAL;
        newCanPay[loan.id] = loan.paymentsMade === 0 || now >= nextAllowed;
      });
      setCanPay(newCanPay);
    }
  };

  const repayInstallment = async (loanId, amount) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getContract(signer);

      const tx = await contract.repayInstallment(loanId, {
        value: amount.toString()
      });

      await tx.wait();
      alert("Installment Paid");
      autoConnect();
    } catch (error) {
      console.error("❌ Error al pagar cuota:", error);
      alert("Error al pagar cuota.");
    }
  };

  useEffect(() => {
    autoConnect();
  }, []);

  return (
    <div>
      {!connected ? (
        <button onClick={connectWallet} className="bg-green-600 text-white px-4 py-2 rounded">
          Connect MetaMask
        </button>
      ) : (
        <div>
          <p><strong>Wallet:</strong> {walletAddress}</p>
          <p><strong>Balance:</strong> {balance} ETH</p>
          <p><strong>Credit Score:</strong> {creditScore ?? "Loading..."}</p>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white">My Loans</h3>
            <ul className="list-disc ml-6">
              {myLoans.length === 0 ? (
                <li>No loans requested</li>
              ) : (
                myLoans.map((loan, idx) => (
                  <li key={idx}>
                    {ethers.formatEther(loan.amount)} ETH | Interest: {loan.interest}% | 
                    Paid: {ethers.formatEther(loan.amountRepaid)} ETH | 
                    {loan.paymentsMade}/{loan.numInstallments} installments | 
                    {loan.paymentsMade === loan.numInstallments ? " Paid" : " Ongoing ..."}
                    {!loan.isRepaid && loan.isFunded && loan.paymentsMade < loan.numInstallments && (
  <>
    <button
      disabled={!canPay[loan.id]}
      className={`ml-2 px-3 py-1 text-white rounded ${
        canPay[loan.id] ? "bg-green-600" : "bg-gray-400 cursor-not-allowed"
      }`}
      onClick={() => repayInstallment(loan.id, loan.installmentAmount)}
    >
      Pagar Cuota
    </button>
    {!canPay[loan.id] && (
      <span className="ml-2 text-green-500 text-sm">
        Wait 10 minutes before next payment...
      </span>
    )}
  </>
)}
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white">Loans You Funded</h3>
            <ul className="list-disc ml-6">
              {lentLoans.length === 0 ? (
                <li>No loans funded</li>
              ) : (
                lentLoans.map((loan, idx) => (
                  <li key={idx}>
                    To: {loan.borrower} | {ethers.formatEther(loan.amount)} ETH | Interest: {loan.interest}% | 
                    {loan.isRepaid ? "✅ Repaid" : "⏳ Ongoing"}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyProfile;
