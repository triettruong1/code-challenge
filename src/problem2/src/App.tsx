import { useEffect, useMemo, useState } from "react";
import SwapArrowIcon from "./arrow-swap-svgrepo-com.svg?react";

type CurrencyData = {
  currency: string;
  date: Date;
  price: number;
};

type CurrencyObject = {
  date: Date;
  price: number;
};
const SVG_ACCESS_URL = "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/";

const nonNumberRegex = /[^0-9]/g;

function App() {
  const [amountToSend, setAmountToSend] = useState(0);
  const [amountToReceive, setAmountToReceive] = useState(0);
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");

  const [currencyCodes, setCurrencyCodes] = useState<string[]>([]);
  const [currencyData, setCurrencyData] = useState<Map<string, CurrencyObject>>(new Map());
  const [exchangeRate, setExchangeRate] = useState(0);

  useEffect(() => {
    const fetchPrices = async () => {
      const response = await fetch("https://interview.switcheo.com/prices.json");

      if (!response.ok) {
        throw new Error(`Failed to fetch prices status: ${response.status}`);
      }
      const data = await response.json();
      const currencies = new Map<string, CurrencyObject>();
      const currencyCodes: string[] = [];

      data.forEach((currencyObject: CurrencyData) => {
        const { currency: currencyCode, price, date } = currencyObject;

        if (currencies.has(currencyCode)) {
          const { date: existedDataDate } = currencies.get(currencyCode) as CurrencyObject;

          if (new Date(existedDataDate) <= new Date(date)) {
            currencies.set(currencyCode, { price, date });
          }
        } else {
          currencies.set(currencyCode, { price, date });
          currencyCodes.push(currencyCode);
        }
      });

      setCurrencyCodes(currencyCodes);
      setCurrencyData(currencies);
      setFromCurrency(currencyCodes[0]);
      setToCurrency(currencyCodes[0]);
    };

    fetchPrices();
  }, []);

  const handleCalculateExchange = () => {
    if (currencyData.size > 0) {
      const { price: fromCurrencyPrice } = currencyData.get(fromCurrency) as CurrencyObject;
      const { price: toCurrencyPrice } = currencyData.get(toCurrency) as CurrencyObject;

      const exchangeRate = fromCurrencyPrice / toCurrencyPrice;
      setExchangeRate(exchangeRate);
      setAmountToReceive(amountToSend * exchangeRate);
    }
  };

  const sanitizeInput = (value: string): number => {
    return parseFloat(value.replace(nonNumberRegex, ""));
  };

  useEffect(() => {
    handleCalculateExchange();
  }, [amountToSend, fromCurrency, toCurrency]);

  const fromCurrencyDataDate = useMemo(() => {
    if (currencyData.size) {
      const fromCurrencyData = currencyData.get(fromCurrency);

      if (fromCurrencyData) {
        const { date } = fromCurrencyData;

        return new Date(date).toLocaleDateString();
      } else {
        throw new Error("Error: Data not found");
      }
    }
  }, [currencyData, fromCurrency]);

  const handleSwapCurrency = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setAmountToReceive(amountToSend);
    setAmountToSend(amountToReceive);
  };

  const fromCurrencySVG = SVG_ACCESS_URL + fromCurrency + ".svg";
  const toCurrencySVG = SVG_ACCESS_URL + toCurrency + ".svg";

  return (
    <div className="container flex-center">
      <h1>Currency Converter</h1>
      <div className="form flex flex-center flex-auto">
        <div className="flex flex-col">
          <div className="flex align-center">
            <img src={fromCurrencySVG} />
            <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
              {currencyCodes?.map((currencyCode) => (
                <option key={`${currencyCode}_from`} value={currencyCode}>
                  {currencyCode}
                </option>
              ))}
            </select>
          </div>
          <input
            value={amountToSend}
            onChange={(e) => {
              const enteredNumber = sanitizeInput(e.target.value || "0");
              setAmountToSend(enteredNumber);
            }}
          />
        </div>
        <SwapArrowIcon onClick={handleSwapCurrency} />
        <div className="flex flex-col">
          <div className="flex align-center">
            <img src={toCurrencySVG} />
            <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
              {currencyCodes?.map((currencyCode) => (
                <option key={`${currencyCode}_to`} value={currencyCode}>
                  {currencyCode}
                </option>
              ))}
            </select>
          </div>
          <input value={amountToReceive} readOnly />
        </div>
      </div>
      <div className="container">
        <p>
          Current exchange rate (as of {fromCurrencyDataDate}):{" "}
          <span className="font-clr-accent">
            1 {fromCurrency} ~ {exchangeRate} {toCurrency}
          </span>
        </p>
      </div>
    </div>
  );
}

export default App;
