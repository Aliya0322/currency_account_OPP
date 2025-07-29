class CurrencyAccount {
    #balances = new Map();
    constructor(balances) {
        this.#balances = new Map(Object.entries(balances));
    }

    deposit(currency, amount) {
        if(this.#balances.has(currency)) {
            const currentBalance = this.#balances.get(currency);
            let newBalance = currentBalance+amount;
            this.#balances.set(currency, newBalance);
        } else {
            this.#balances.set(currency,amount);
        }
    }

    withdraw(currency, amount) {
        if (this.#balances.has(currency)) {
            if (amount > this.#balances.get(currency)) { 
                throw new Error(`Недостаточно средств в ${currency}`);
            }
            const newBalance = this.#balances.get(currency) - amount;
            this.#balances.set(currency, newBalance);
        } else {
            throw new Error(`Валюта ${currency} не найдена`);
        }
    }

    getBalance(currency) {
        if(this.#balances.has(currency)) {
            return this.#balances.get(currency)
        } else {
            throw new Error(`На балансе нет ${currency}`);
        }
    }

    getBalances() {
        return Object.fromEntries(this.#balances.entries());
    }

    static exchangeRates = {
         "USD:EUR": 0.85,
        }

    static setExchangeRates(rates) {
        const currentRates = Object.entries(rates);

        currentRates.forEach(([currencyPair, rate]) => {
            this.exchangeRates[currencyPair] = rate;
        })     
    }

    transferTo(account, fromCur, toCur, amount) {
        if (amount <= 0) {
        throw new Error("Сумма перевода должна быть положительной");
    }

        const rate = CurrencyAccount.exchangeRates[`${fromCur}:${toCur}`];
        if(!rate) {
            throw new Error(`Нет курса для ${fromCur}:${toCur}`)
        } 
        
        this.withdraw(fromCur, amount);
        const convertedAmount = amount*rate;
        account.deposit(toCur, convertedAmount);
    }
}

const account1 = new CurrencyAccount({ USD: 100 });
const account2 = new CurrencyAccount({ EUR: 0 });


CurrencyAccount.setExchangeRates({ "USD:EUR": 0.85 });


account1.transferTo(account2, "USD", "EUR", 10);

console.log(account1.getBalance("USD")); 
console.log(account2.getBalance("EUR"));

