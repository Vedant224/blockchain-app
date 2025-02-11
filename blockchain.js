const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(`Block ${this.index} mined: ${this.hash}`);
        // Object.freeze(this);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.pendingTransactions = [];
        this.difficulty = 4;
    }

    createGenesisBlock() {
        return new Block(0, "01/01/2017", "Genesis block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    minePendingTransactions(minerAddress) {
        this.addTransaction({ sender: "System", receiver: minerAddress, amount: 10 }); 

        let block = new Block(this.chain.length, new Date().toISOString(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        this.chain.push(block);
        this.pendingTransactions = [];
    }

    isChainValid() {
        try {
            for (let i = 1; i < this.chain.length; i++) {
                const currentBlock = this.chain[i];
                const previousBlock = this.chain[i - 1];
    
                if (currentBlock.hash !== currentBlock.calculateHash()) {
                    console.log(`Blockchain integrity compromised! Block ${i} has been tampered!`);
                    return false;
                }
    
                if (currentBlock.previousHash !== previousBlock.hash) {
                    console.log(`Blockchain integrity compromised! Block ${i} has an invalid previous hash!`);
                    return false;
                }
    
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

let intercoin = new Blockchain();

intercoin.addTransaction({ sender: "Alice", receiver: "Bob", amount: 50 });
intercoin.addTransaction({ sender: "Charlie", receiver: "Dave", amount: 20 });

console.log('Mining pending transactions...');
intercoin.minePendingTransactions("Miner1");

console.log('Is blockchain valid? ' + intercoin.isChainValid());

console.log("\nTampering with Block 1...");
intercoin.chain[1].data = { sender: "Hacker", amount: 100 };
console.log('Is blockchain valid after tampering? ' + intercoin.isChainValid());

console.log("\n🔍 Blockchain Data:");
console.log(JSON.stringify(intercoin, null, 4));
