const calcDisplay = document.getElementById('calc-display');
const errorMessage = "SYNTAX ERROR";

const caret = document.createElement('span');
caret.id = 'caret';
caret.style.display = 'inline-block';
caret.style.width = '2px';
caret.style.height = '1em';
caret.style.backgroundColor = '#DFD79D';
caret.style.animation = 'blink 1s step-start infinite';
caret.style.verticalAlign = 'bottom';

calcDisplay.appendChild(caret);

function updateDisplay(text) {
  calcDisplay.textContent = text;
  calcDisplay.appendChild(caret);
}

const symbolCells = document.querySelectorAll('.symbol');
symbolCells.forEach(cell => {
  cell.addEventListener('click', () => {
    if (calcDisplay.textContent === errorMessage) {
      calcDisplay.textContent = "";
    }
    
    const letter = cell.getAttribute('data-letter');
    const currentText = calcDisplay.textContent;
    const newText = currentText + letter;
    updateDisplay(newText);
  
  });
});


const calcClear = document.getElementById('calc-clear');
calcClear.addEventListener('click', () => {
  updateDisplay("");
});


const calcBackspace = document.getElementById('calc-backspace');
calcBackspace.addEventListener('click', () => {
 if (calcDisplay.textContent === errorMessage) {
    updateDisplay("");
  } else {
    updateDisplay(calcDisplay.textContent.slice(0, -1));
  }
});


const calcEquals = document.getElementById('calc-equals');
calcEquals.addEventListener('click', () => {
  const expression = calcDisplay.textContent;
  if (calcDisplay.textContent === errorMessage) {
    updateDisplay("");
  } else if (expression != "") {
    fetch('/calculate', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ expression: expression }),
    })
    .then(response => response.json())
    .then(data => {
      const result = data.result
      if (result === errorMessage) {
        calcDisplay.textContent = data.result; 
      } else {
        updateDisplay(result);
      }
      
    })
    .catch(error => {
      console.error('Error:', error);
    });    
  } 
});