import { useEffect, useState } from "react";
import { ethers } from "ethers";
import CreditScoreABI from "./CreditScoreABI.json";

function Lend() {
  const [loanList, setLoanList] = useState([]);
  const [walletAddress, setWalletAddress] = useState("");
  const contractAddress = "0x24EF60e36437A86Bd0cf24FB70d85d8A1Bd1E7c6";

  // Conectar wallet
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          setWalletAddress(address.toLowerCase());
        }
      } catch (err) {
        console.error("Blockchain error:", err);
      }
    };

    fetchWallet();
  }, []);

  // Obtener préstamos y credit scores
  useEffect(() => {
    const fetchAvailableLoans = async () => {
      try {
        if (!window.ethereum || !walletAddress) return;

        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, CreditScoreABI, provider);

        const loans = await contract.getAvailableLoans();

        const filtered = loans.filter(
          (loan) => loan.borrower.toLowerCase() !== walletAddress
        );

        // Consultar credit scores
        const loanWithScores = await Promise.all(
          filtered.map(async (loan) => {
            const score = await contract.getScore(loan.borrower);
            return {
              id: Number(loan.id),
              borrower: loan.borrower,
              amount: ethers.formatEther(loan.amount),
              interest: Number(loan.interest),
              isInstallment: loan.isInstallment,
              numInstallments: Number(loan.numInstallments),
              installmentAmount: ethers.formatEther(loan.installmentAmount),
              creditScore: Number(score),
            };
          })
        );

        setLoanList(loanWithScores);
      } catch (err) {
        console.error("Error fetching loans or scores:", err);
      }
    };

    fetchAvailableLoans();
  }, [walletAddress]);

  // Fondear préstamo
  const handleFundLoan = async (loanId, amount) => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, CreditScoreABI, signer);

      const tx = await contract.fundLoan(loanId, {
        value: ethers.parseEther(amount),
      });

      await tx.wait();
      alert("Loan funded successfully ✅");
      window.location.reload();
    } catch (err) {
      console.error("Error funding loan:", err);
      alert("Failed to fund loan");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Loans Available to Lend</h2>
      {loanList.length === 0 ? (
        <p>No active requests from other users.</p>
      ) : (
        loanList.map((loan) => (
          <div key={loan.id} className="border rounded p-3 mb-2">
            <p><strong>Amount:</strong> {loan.amount} ETH</p>
            <p><strong>Interest:</strong> {loan.interest}%</p>
            <p><strong>Credit Score:</strong> {loan.creditScore}</p>
            <p><strong>Installments:</strong> {loan.isInstallment ? "Yes" : "No"}</p>
            {loan.isInstallment && loan.numInstallments > 0 && (
              <p>
                <strong>Plan:</strong> {loan.numInstallments} x {loan.installmentAmount} ETH
              </p>
            )}
            <button
              className="bg-green-700 text-white px-4 py-2 mt-2 rounded"
              onClick={() => handleFundLoan(loan.id, loan.amount)}
            >
              Lend Now
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Lend;
