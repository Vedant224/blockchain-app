# Blockchain Simulation

## Overview
This project is a simple blockchain simulation built using **Node.js** and **crypto-js** for hashing. It includes key blockchain functionalities such as block creation, mining, transactions, and chain validation.
Added some extra feature Object.freeze for not allowingg file to change but is commented,also added miner reward and added dockerization

## Features
- **Block Structure:** Each block contains an index, timestamp, transaction data, previous hash, nonce, and its own hash.
- **Hashing:** Uses **SHA-256** to compute the block hash.
- **Mining:** Implements a basic **Proof-of-Work (PoW)** mechanism by requiring a hash with a specific number of leading zeros (difficulty level).
- **Transaction Handling:** Allows adding transactions to the blockchain.
- **Chain Validation:** Ensures blockchain integrity by checking if hashes are correctly linked.
- **Tamper Detection:** Demonstrates how data modification invalidates the blockchain.
- **Mining Rewards:** Miners receive 10 coins as a reward for successfully mining a block.

## Installation
### Prerequisites
Ensure you have **Node.js** installed.

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/Vedant224/blockchain-app.git
   cd blockchain-app
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run the simulation:
   ```sh
   node blockchain.js
   ```

## Usage
### Adding Transactions & Mining
The blockchain starts with a **Genesis Block**. You can add transactions and mine new blocks:
```js
intercoin.addTransaction({ sender: "Alice", receiver: "Bob", amount: 50 });
intercoin.addTransaction({ sender: "Charlie", receiver: "Dave", amount: 20 });
console.log('Mining pending transactions...');
intercoin.minePendingTransactions("Miner1");
```

### Validating the Blockchain
To verify the blockchain’s integrity:
```js
console.log('Is blockchain valid? ' + intercoin.isChainValid());
```

### Tampering & Detection
Demonstrates tampering by modifying a block and checking validity:
```js
console.log("\nTampering with Block 1...");
intercoin.chain[1].data = { sender: "Hacker", amount: 100 };
console.log('Is blockchain valid after tampering? ' + intercoin.isChainValid());
```

## Docker Setup
To run the project in a Docker container:
1. Build the Docker image:
   ```sh
   docker build -t blockchain-app .
   ```
2. Run the container:
   ```sh
   docker run --rm blockchain-app
   ```

## Evaluation Criteria
This project meets the following criteria:
- **Functionality:** Correctly simulates a blockchain.
- **Code Quality:** Clean and well-structured code with comments.
- **Bonus Features:** Includes Proof-of-Work and transaction handling.
- **Dockerization:** Provides a Docker setup for running the project.
