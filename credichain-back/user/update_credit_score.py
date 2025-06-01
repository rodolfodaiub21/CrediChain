from web3 import Web3
import json

# Conectarse a Ganache
ganache_url = "http://127.0.0.1:7545"
web3 = Web3(Web3.HTTPProvider(ganache_url))

# Dirección y clave privada del owner
owner_address = "0xaFe59DE1db28f44f7c883D1b6cb33753080e4dd9"
private_key = "8c6266ee3102abb0ed88d58a7c4fddb529bd368e1b10ac38456f6b308d5fbc48"

# Dirección del contrato
contract_address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

# ABI del contrato
with open("CreditScoreABI.json") as f:
    abi = json.load(f)

# Instancia del contrato
contract = web3.eth.contract(address=contract_address, abi=abi)

# --- Ejemplo: actualizar el score de un usuario
user_address = "0xAddressDelUsuario"  # la wallet del usuario
new_score = 85  # el nuevo score que calculaste

# Preparar la transacción
nonce = web3.eth.get_transaction_count(owner_address)
txn = contract.functions.setScore(user_address, new_score).build_transaction({
    "chainId": 1337,  # Ganache
    "gas": 300000,
    "gasPrice": web3.to_wei("2", "gwei"),
    "nonce": nonce
})

# Firmar y enviar
signed_txn = web3.eth.account.sign_transaction(txn, private_key=private_key)
tx_hash = web3.eth.send_raw_transaction(signed_txn.rawTransaction)

print(f"Score updated! TX Hash: {web3.to_hex(tx_hash)}")
