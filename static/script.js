const calcDisplay = document.getElementById('calc-display');
const maxWidthPx = Math.max(window.innerWidth * 0.46, 400);
const errorMessage = "SYNTAX ERROR";

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
ctx.font = window.getComputedStyle(calcDisplay).font;

const caret = document.createElement('span');
caret.id = 'caret';
caret.style.display = 'inline-block';
caret.style.width = '2px';
caret.style.height = '1em';
caret.style.backgroundColor = 'black';
caret.style.animation = 'blink 1s step-start infinite';
caret.style.verticalAlign = 'bottom';

calcDisplay.appendChild(caret);

function moveCaretToEnd() {
  calcDisplay.appendChild(caret);
}

function updateDisplay(text) {
  calcDisplay.textContent = text;
  moveCaretToEnd();
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

    const newTextWidth = ctx.measureText(newText).width;

    if (newTextWidth <= maxWidthPx) {
      updateDisplay(newText);
    }
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