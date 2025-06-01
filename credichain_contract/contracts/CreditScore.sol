// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CreditScore {
    // --- CREDIT SCORE ---
    mapping(address => uint8) public scores;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only backend can update");
        _;
    }

    function setScore(address user, uint8 score) public onlyOwner {
        require(score <= 100, "Score must be between 0 and 100");
        scores[user] = score;
    }

    function getScore(address user) public view returns (uint8) {
        return scores[user];
    }

    // --- LOANS ---
    struct Loan {
        uint id;
        address borrower;
        uint amount;
        uint interest; // porcentaje
        bool isFunded;
        bool isInstallment;
        uint numInstallments; // número de cuotas == meses (simulados)
        uint installmentAmount;
        address lender;
        bool isRepaid;
        uint deadline;
        uint amountRepaid;
        uint lastPaymentTimestamp;
        uint paymentsMade;
    }

    Loan[] public loans;

    uint constant INSTALLMENT_INTERVAL = 600; // 10 minutos entre cuotas

    event LoanRequested(uint id, address borrower, uint amount, uint interest);
    event LoanFunded(uint id, address lender);
    event LoanInstallmentPaid(uint id, address borrower, uint amountPaid);
    event LoanFullyRepaid(uint id, address borrower, uint totalPaid);

    // Solicitar préstamo mensual (simulado)
    function requestLoan(
        uint amount,
        uint interest,
        uint numInstallments,
        uint deadline
    ) public {
        require(numInstallments > 0, "Installments must be at least 1");
        bool isInstallment = true;
        uint totalToRepay = amount + (amount * interest / 100);
        uint installmentAmount = totalToRepay / numInstallments;

        loans.push(
            Loan({
                id: loans.length,
                borrower: msg.sender,
                amount: amount,
                interest: interest,
                isFunded: false,
                isInstallment: isInstallment,
                numInstallments: numInstallments,
                installmentAmount: installmentAmount,
                lender: address(0),
                isRepaid: false,
                deadline: deadline,
                amountRepaid: 0,
                lastPaymentTimestamp: 0,
                paymentsMade: 0
            })
        );

        emit LoanRequested(loans.length - 1, msg.sender, amount, interest);
    }

    // Fondear préstamo
    function fundLoan(uint loanId) public payable {
        require(loanId < loans.length, "Invalid loan ID");
        Loan storage loan = loans[loanId];
        require(!loan.isFunded, "Loan already funded");
        require(msg.value == loan.amount, "Incorrect ETH amount");

        loan.isFunded = true;
        loan.lender = msg.sender;

        payable(loan.borrower).transfer(msg.value);

        emit LoanFunded(loanId, msg.sender);
    }

    // Pagar una cuota (simulada cada 10 min)
    function repayInstallment(uint loanId) public payable {
        require(loanId < loans.length, "Invalid loan ID");
        Loan storage loan = loans[loanId];

        require(msg.sender == loan.borrower, "Only borrower can repay");
        require(loan.isFunded, "Loan not funded");
        require(!loan.isRepaid, "Already repaid");
        require(loan.isInstallment, "Loan is not in installments");

        uint totalDue = loan.amount + (loan.amount * loan.interest / 100);
        uint installment = totalDue / loan.numInstallments;

        // Tiempo mínimo entre pagos (10 minutos)
        if (loan.paymentsMade > 0) {
            require(
                block.timestamp >= loan.lastPaymentTimestamp + INSTALLMENT_INTERVAL,
                "Wait 10 minutes between installments"
            );
        }

        require(msg.value == installment, "Incorrect installment amount");

        loan.amountRepaid += msg.value;
        loan.lastPaymentTimestamp = block.timestamp;
        loan.paymentsMade++;

        payable(loan.lender).transfer(msg.value);

        emit LoanInstallmentPaid(loanId, msg.sender, msg.value);

        if (loan.amountRepaid >= totalDue) {
            loan.isRepaid = true;
            emit LoanFullyRepaid(loanId, msg.sender, loan.amountRepaid);
        }
    }

    // Ver préstamos disponibles (no fondeados)
    function getAvailableLoans() public view returns (Loan[] memory) {
        uint count = 0;
        for (uint i = 0; i < loans.length; i++) {
            if (!loans[i].isFunded) {
                count++;
            }
        }

        Loan[] memory available = new Loan[](count);
        uint index = 0;

        for (uint i = 0; i < loans.length; i++) {
            if (!loans[i].isFunded) {
                available[index] = loans[i];
                index++;
            }
        }

        return available;
    }

    // Préstamos solicitados por un usuario
    function getLoansByUser(address user) public view returns (Loan[] memory) {
        uint count = 0;
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].borrower == user) {
                count++;
            }
        }

        Loan[] memory userLoans = new Loan[](count);
        uint index = 0;

        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].borrower == user) {
                userLoans[index] = loans[i];
                index++;
            }
        }

        return userLoans;
    }

    // Préstamos fondeados por un usuario
    function getLentLoansByUser(address user) public view returns (Loan[] memory) {
        uint count = 0;
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].lender == user) {
                count++;
            }
        }

        Loan[] memory lentLoans = new Loan[](count);
        uint index = 0;

        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].lender == user) {
                lentLoans[index] = loans[i];
                index++;
            }
        }

        return lentLoans;
    }
}
