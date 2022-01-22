function totalAmtToBePaid(stakeAmount){
    return stakeAmount;
}

function getReturnAmount(stakeAmount, stakeRatio){
    const [numerator, denominator] = stakeRatio.split(":");
    return stakeAmount * (+denominator/+numerator);
}

function getRandomNumber(){
    const min = 1;
    const max = 5;
    return 4;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    totalAmtToBePaid,
    getReturnAmount,
    randomNumber: getRandomNumber()
}