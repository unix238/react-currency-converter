import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const Form = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('AED');
  const [toCurrency, setToCurrency] = useState('AED');
  const [amount, setAmount] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const getAllCurrencies = async () => {
    setIsLoading(true);
    const options = {
      method: 'GET',
      url: 'https://api.apilayer.com/fixer/symbols',
      redirect: 'follow',
      headers: {
        apikey: 'FSzLKozU5G9i0rGlq8LdkLA20PYwj9yM',
      },
    };

    const response = await axios(options);
    if (response.status === 200) {
      setCurrencies(response.data.symbols);
    }
  };

  useEffect(() => {
    try {
      getAllCurrencies();
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateOptions = (curr) => {
    const allCurrencies = [];
    for (let key in curr) {
      allCurrencies.push({ value: key, name: curr[key] });
    }

    return allCurrencies;
  };

  const handleSelectFrom = (e) => {
    setFromCurrency(e.target.value);
  };

  const handleSelectTo = (e) => {
    setToCurrency(e.target.value);
  };

  const convert = async (to, from, amount) => {
    const myHeaders = new Headers();
    myHeaders.append('apikey', 'FSzLKozU5G9i0rGlq8LdkLA20PYwj9yM');

    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders,
    };
    fetch(
      `https://api.apilayer.com/fixer/convert?to=${to}&from=${from}&amount=${amount}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => setConvertedAmount(result.result))
      .catch((error) => console.log('error', error));
  };

  const handleConvertedAmount = (e) => {
    //
  };
  const handleAmount = (e) => {
    if (e.target.value >= 0) {
      setAmount(e.target.value);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    convert(toCurrency, fromCurrency, amount);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <p className='title'>Currency Converter</p>
      <div className='selects'>
        <select name='' id='' onChange={handleSelectFrom} value={fromCurrency}>
          {!isLoading ? (
            generateOptions(currencies).map((currency) => {
              return (
                <option key={currency.value + 'in'} value={currency.value}>
                  {currency.value}
                </option>
              );
            })
          ) : (
            <option value=' '>Error</option>
          )}
        </select>
        <select name='' id='' onChange={handleSelectTo} value={toCurrency}>
          {!isLoading ? (
            generateOptions(currencies).map((currency) => {
              return (
                <option key={currency.value + 'ou'} value={currency.value}>
                  {currency.value}
                </option>
              );
            })
          ) : (
            <option value=' '>Error</option>
          )}
        </select>
      </div>
      <div className='inputs'>
        <input type='num' value={amount} onChange={handleAmount} />
        <input
          type='num'
          value={convertedAmount}
          onChange={handleConvertedAmount}
          disabled
        />
      </div>

      <button type='submit' className='btn'>
        Convert
      </button>
    </form>
  );
};
