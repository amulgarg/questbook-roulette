const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction
} = require("@solana/web3.js");



const getWalletKeys = () => {
    const wallet = new Keypair();
    return [
        new PublicKey(wallet._keypair.publicKey).toString(),
        wallet._keypair.secretKey
    ];
}

const getWalletBalance = async (secretKey) => {
    try {
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const wallet = Keypair.fromSecretKey(secretKey);
        const walletBalance = await connection.getBalance(
            new PublicKey(wallet.publicKey)
        );
        return `${walletBalance/LAMPORTS_PER_SOL} SOL`;
    } catch (err) {
        console.log(err);
    }
};

const airDropSol = async (secretKey) => {
    try {
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const wallet = Keypair.fromSecretKey(secretKey);

        const fromAirDropSignature = await connection.requestAirdrop(
            new PublicKey(wallet.publicKey),
            2 * LAMPORTS_PER_SOL
        );

        await connection.confirmTransaction(fromAirDropSignature);

        return fromAirDropSignature;

    } catch (err) {
        console.log(err);
    }
};


const transferSol = async (fromPublicKey, toPublicKey, fromSecretKey, solAmount) => {

    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: new PublicKey(fromPublicKey),
            toPubkey: new PublicKey(toPublicKey),
            lamports: solAmount * LAMPORTS_PER_SOL
        })
    );

    const fromWallet = Keypair.fromSecretKey(fromSecretKey);
    
    const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [fromWallet]
    )
    return signature;

}

module.exports = {
    airDropSol,
    getWalletKeys,
    getWalletBalance,
    transferSol
}