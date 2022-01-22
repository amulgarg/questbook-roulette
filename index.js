const figlet = require('figlet');
const inquirer = require('inquirer');

const { getReturnAmount, totalAmtToBePaid, randomNumber } = require('./helper');
const { getWalletKeys, airDropSol, getWalletBalance, transferSol } = require('./solana');


figlet('Stake SOL', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const gameExecution = async () => {

    const stakeQuestions = [
        {
            type: 'input',
            name: 'stake_amount',
            message: "What's the amount of SOL you want to stake?",
        },
        {
            type: 'input',
            name: 'stake_ratio',
            message: "What's the ratio of your staking?"
        }
        
    ];

    /* already loaded treasury wallet */

    const treasuryWalletPublicKey = 'DAVZQnXkswcptmc8ZvDfpPCZFcSdjTT9wMgEBBJ2jYF';
    const treasuryWalletPrivateKey = Uint8Array.from([
        152,  99, 116, 185, 237, 234, 228, 232, 240,  88, 217,
        199, 108, 231, 173, 142,  44, 173, 187, 103, 195, 130,
        147,  74, 138, 146,  45,  89, 208, 134, 125, 166,   3,
         29, 179, 234,  43, 107, 212,  32,  88, 133, 159,  77,
        143, 106,  55,  19, 208, 239, 135, 209, 194, 139,  18,
        109,   1, 220, 215,  39,  39, 146,  45, 116
    ]);


    console.log('Treasury Wallet Address: ', treasuryWalletPublicKey);

    const [ userWalletPublicKey, userWalletPrivateKey ] = getWalletKeys();

    console.log('User Wallet Address: ', userWalletPublicKey);

    await airDropSol(userWalletPrivateKey); // airdrop 2 SOLs to user wallet
    
    console.log('User wallet balance: ', await getWalletBalance(userWalletPrivateKey));

    console.log(`Max bidding amount is 2 SOL here`); // not able to airdrop more than 2 SOLs

    const stakeAnswers = await inquirer.prompt(stakeQuestions);

    const amountToPayTreasury = totalAmtToBePaid(stakeAnswers.stake_amount);
    const returnAmount = getReturnAmount(stakeAnswers.stake_amount, stakeAnswers.stake_ratio);

    console.log(`You need to pay *${amountToPayTreasury}* SOL to move forward`);
    console.log(`You will get ${returnAmount} if you guess the number correctly`);
    
    const guessQuestions = [
        {
            type: 'input',
            name: 'guess',
            message: "Guess a number from 1 to 5, both 1 and 5 are included"
        }
    ]

    const guessAnswers = await inquirer.prompt(guessQuestions);

    const feesSignature = await transferSol(userWalletPublicKey, treasuryWalletPublicKey, userWalletPrivateKey, amountToPayTreasury); // transfer the staked amount to treasuryWallet

    console.log('Signature of payment for playing the game: ', feesSignature);

    if(guessAnswers.guess == randomNumber){ // if the guess is right, transfer stake_amount * stake_ratio to user account
        console.log('Your guess is correct!')
        const prizeSignature = await transferSol(treasuryWalletPublicKey, userWalletPublicKey, treasuryWalletPrivateKey, returnAmount);
        console.log('Signature of prize transaction: ', prizeSignature);
    }

}

gameExecution();