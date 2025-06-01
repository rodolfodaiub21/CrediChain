# user/tasks.py
from web3 import Web3
import json
from user.models import UserWalletInfo  # Asegurate que el modelo tenga wallet_address

ganache_url = "http://127.0.0.1:7545"
web3 = Web3(Web3.HTTPProvider(ganache_url))

owner_address = "0xaFe59DE1db28f44f7c883D1b6cb33753080e4dd9"
private_key = "8c6266ee3102abb0ed88d58a7c4fddb529bd368e1b10ac38456f6b308d5fbc48"
contract_address = "0x24EF60e36437A86Bd0cf24FB70d85d8A1Bd1E7c6"

with open("user/CreditScoreABI.json") as f:
    abi = json.load(f)

contract = web3.eth.contract(address=contract_address, abi=abi)

def calculate_score(loans):
    score = 20
    for loan in loans:
        if loan["isRepaid"]:
            score += 10
            if loan["paymentsMade"] == loan["numInstallments"]:
                score += 5
        else:
            score += loan["paymentsMade"] * 2
    return min(score, 100)

def get_loans_by_user(address):
    raw_loans = contract.functions.getLoansByUser(address).call()
    loans = []
    for loan in raw_loans:
        loans.append({
            "id": loan[0],
            "borrower": loan[1],
            "amount": loan[2],
            "interest": loan[3],
            "isFunded": loan[4],
            "isInstallment": loan[5],
            "numInstallments": loan[6],
            "installmentAmount": loan[7],
            "lender": loan[8],
            "isRepaid": loan[9],
            "deadline": loan[10],
            "amountRepaid": loan[11],
            "lastPaymentTimestamp": loan[12],
            "paymentsMade": loan[13],
        })
    return loans

def update_all_scores():
    print("🕒 Verificando credit scores...")
    for user in UserWalletInfo.objects.exclude(walletaddress__isnull=True).exclude(walletaddress=""):
        try:
            loans = get_loans_by_user(user.walletaddress)
            new_score = calculate_score(loans)
            nonce = web3.eth.get_transaction_count(owner_address)
            txn = contract.functions.setScore(user.walletaddress, new_score).build_transaction({
                "chainId": 1337,
                "gas": 300000,
                "gasPrice": web3.to_wei("2", "gwei"),
                "nonce": nonce
            })
            signed_txn = web3.eth.account.sign_transaction(txn, private_key=private_key)
            tx_hash = web3.eth.send_raw_transaction(signed_txn.raw_transaction)
            print(f"✅ Score updated at {user.walletaddress}: {new_score} (TX: {web3.to_hex(tx_hash)})")
        except Exception as e:
            print(f"⚠️ Error  {user.walletaddress}: {e}")
