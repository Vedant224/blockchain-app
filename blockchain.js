const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        // Basic block properties
        this.index = index;          // Position of block in chain
        this.timestamp = timestamp;   // When block was created
        this.data = data;            // Transaction data stored in block
        this.previousHash = previousHash;  // Hash of previous block (creates chain)
        this.nonce = 0;              // Used for mining (Proof of Work)
        this.hash = this.calculateHash();  // Current block's hash
    }

    // Creates a unique hash based on block contents
    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    // Proof of Work: Find a hash with N leading zeros (mining)
    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;  // Increment nonce until we find a valid hash
            this.hash = this.calculateHash();
        }
        console.log(`Block ${this.index} mined: ${this.hash}`);
    }
}

class Blockchain {
    constructor() {
        // Initialize blockchain with genesis block
        this.chain = [this.createGenesisBlock()];
        this.pendingTransactions = [];  // Store transactions before mining
        this.difficulty = 4;  // Number of leading zeros required in hash
    }

    // First block in the chain (hardcoded)
    createGenesisBlock() {
        return new Block(0, "01/01/2017", "Genesis block", "0");
    }

    // Helper method to get most recent block
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Add new transaction to pending list
    addTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    // Mine pending transactions into a new block
    minePendingTransactions(minerAddress) {
        // Reward the miner with some coins
        this.addTransaction({ sender: "System", receiver: minerAddress, amount: 10 }); 

        // Create new block with pending transactions
        let block = new Block(
            this.chain.length,
            new Date().toISOString(),
            this.pendingTransactions,
            this.getLatestBlock().hash
        );
        
        block.mineBlock(this.difficulty);  // Mine the block
        this.chain.push(block);  // Add to chain
        this.pendingTransactions = [];  // Clear pending transactions
    }

    // Verify blockchain integrity
    isChainValid() {
        try {
            for (let i = 1; i < this.chain.length; i++) {
                const currentBlock = this.chain[i];
                const previousBlock = this.chain[i - 1];
    
                // Check if block's hash is valid
                if (currentBlock.hash !== currentBlock.calculateHash()) {
                    console.log(`Blockchain integrity compromised! Block ${i} has been tampered!`);
                    return false;
                }
    
                // Check if block points to correct previous block
                if (currentBlock.previousHash !== previousBlock.hash) {
                    console.log(`Blockchain integrity compromised! Block ${i} has an invalid previous hash!`);
                    return false;
                }
    
                // Check if block was properly mined
                if (currentBlock.hash.substring(0, this.difficulty) !== Array(this.difficulty + 1).join("0")) {
                    console.log(`Block ${i} has not been properly mined!`);
                    return false;
                }
            }
            console.log("Blockchain is valid.");
            return true;
        } catch (error) {
            console.log("Error validating blockchain:", error.message);
            return false;
        }
    }
}

// Test the blockchain
let intercoin = new Blockchain();

// Add some transactions
intercoin.addTransaction({ sender: "Alice", receiver: "Bob", amount: 50 });
intercoin.addTransaction({ sender: "Charlie", receiver: "Dave", amount: 20 });

// Mine the transactions into a block
console.log('Mining pending transactions...');
intercoin.minePendingTransactions("Miner1");

// Verify chain is valid
console.log('Is blockchain valid? ' + intercoin.isChainValid());

// Test tampering detection
console.log("\nTampering with Block 1...");
intercoin.chain[1].data = { sender: "Hacker", amount: 100 };
console.log('Is blockchain valid after tampering? ' + intercoin.isChainValid());

// Display final blockchain state
console.log("\n🔍 Blockchain Data:");
console.log(JSON.stringify(intercoin, null, 4));
