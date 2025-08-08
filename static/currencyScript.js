const leftAmount = document.getElementById('left-amount');
const rightAmount = document.getElementById('right-amount');
const leftCurrency = document.getElementById('left-currency');
const rightCurrency = document.getElementById('right-currency');

let ignoreInputEvent = false;

async function convertAmount(amount, from, to) {
  if (!amount || isNaN(amount)) return 0;

  try {
    const response = await fetch(`/convert?from=${from}&to=${to}&amount=${amount}`);
    const data = await response.json();
    return data.converted_amount;
  } catch (error) {
    console.error('Conversion error:', error);
    return 0;
  }
}

async function onLeftInput() {
  if (ignoreInputEvent) return;
  const amount = parseFloat(leftAmount.value);
  const from = leftCurrency.value;
  const to = rightCurrency.value;

  const converted = await convertAmount(amount, from, to);
  ignoreInputEvent = true;
  rightAmount.value = converted.toFixed(2);
  ignoreInputEvent = false;
}

async function onRightInput() {
  if (ignoreInputEvent) return;
  const amount = parseFloat(rightAmount.value);
  const from = rightCurrency.value;
  const to = leftCurrency.value;

  const converted = await convertAmount(amount, from, to);
  ignoreInputEvent = true;
  leftAmount.value = converted.toFixed(2);
  ignoreInputEvent = false;
}

function addEventListeners() {
  leftAmount.addEventListener('input', onLeftInput);
  rightAmount.addEventListener('input', onRightInput);
  leftCurrency.addEventListener('change', onLeftInput);
  rightCurrency.addEventListener('change', onRightInput);
}

function populateCurrencies(currencyData) {
  const leftSelect = leftCurrency;
  const rightSelect = rightCurrency;

  for (const [code, name] of Object.entries(currencyData)) {
    const optionLeft = document.createElement('option');
    optionLeft.value = code;
    optionLeft.textContent = `${code} – ${name}`;
    leftSelect.appendChild(optionLeft);

    const optionRight = document.createElement('option');
    optionRight.value = code;
    optionRight.textContent = `${code} – ${name}`;
    rightSelect.appendChild(optionRight);
  }

  // Set default currencies if you want
  leftSelect.value = 'EUR';
  rightSelect.value = 'SEK';
}

document.addEventListener('DOMContentLoaded', async () => {
  // Use hardcoded currencies or fetch from backend
  const currencies = {
    "AUD":"Australian Dollar",
    "BGN":"Bulgarian Lev",
    "BRL":"Brazilian Real",
    "CAD":"Canadian Dollar",
    "CHF":"Swiss Franc",
    "CNY":"Chinese Renminbi Yuan",
    "CZK":"Czech Koruna",
    "DKK":"Danish Krone",
    "EUR":"Euro",
    "GBP":"British Pound",
    "HKD":"Hong Kong Dollar",
    "HUF":"Hungarian Forint",
    "IDR":"Indonesian Rupiah",
    "ILS":"Israeli New Sheqel",
    "INR":"Indian Rupee",
    "ISK":"Icelandic Króna",
    "JPY":"Japanese Yen",
    "KRW":"South Korean Won",
    "MXN":"Mexican Peso",
    "MYR":"Malaysian Ringgit",
    "NOK":"Norwegian Krone",
    "NZD":"New Zealand Dollar",
    "PHP":"Philippine Peso",
    "PLN":"Polish Złoty",
    "RON":"Romanian Leu",
    "SEK":"Swedish Krona",
    "SGD":"Singapore Dollar",
    "THB":"Thai Baht",
    "TRY":"Turkish Lira",
    "USD":"United States Dollar",
    "ZAR":"South African Rand"
  };

  populateCurrencies(currencies);
  addEventListeners();

  // Initialize right amount based on left amount at start
  if (leftAmount.value) {
    await onLeftInput();
  }
});


function filterInput(e) {
  let val = e.target.value;
  // Remove invalid chars (allow only digits, dot, comma)
  val = val.replace(/[^0-9.,]/g, '');

  // Allow only one dot and one comma
  const parts = val.split('');
  let dotCount = 0;
  let commaCount = 0;

  val = parts.filter(ch => {
    if (ch === '.') {
      if (dotCount === 0) {
        dotCount++;
        return true;
      }
      return false;
    }
    if (ch === ',') {
      if (commaCount === 0) {
        commaCount++;
        return true;
      }
      return false;
    }
    return true; // digits allowed
  }).join('');

  e.target.value = val;
}

leftAmount.addEventListener('input', filterInput);
rightAmount.addEventListener('input', filterInput);
