export const formatCurrencyForFrontend = (amount: number | string): string => {
    if (typeof amount === "string") {
        amount = parseFloat(amount);
    }

    let digits: string[] = amount.toFixed(0).toString().split("").reverse();

    let res = "";
    for (let i = 0; i < digits.length; i++) {
        res += digits[i];
        if ((i + 1) % 3 === 0 && i !== digits.length - 1) {
            res += ".";
        }
    }

    return res.split("").reverse().join("");
};

export const currencySymbol = "₫";
