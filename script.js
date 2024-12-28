const screen = document.getElementById("screen");
const keys = document.querySelector(".calculator-keys");
let currentInput = "";
let previousInput = "";
let operator = null;

keys.addEventListener("click", (e) => {
    const { target } = e;
    const { action, number, operator: op } = target.dataset;

    if (target.matches("button")) {
        if (number) {
            handleNumber(number);
        } else if (op) {
            handleOperator(op);
        } else if (action === "decimal") {
            handleDecimal();
        } else if (action === "clear") {
            handleClear();
        } else if (action === "equals") {
            handleEquals();
        }

        updateScreen();
    }
});

function handleNumber(number) {
    if (currentInput.includes(".") && number === ".") return; // Prevent multiple decimals
    currentInput = currentInput === "0" ? number : currentInput + number;
}

function handleOperator(op) {
    if (currentInput) {
        if (previousInput && operator) {
            calculate();
        }
        operator = op;
        previousInput = currentInput;
        currentInput = "";
    }

    if (op === "%" && !previousInput) {
        currentInput = (parseFloat(currentInput) / 100).toString();
    }
}

function handleDecimal() {
    if (!currentInput.includes(".")) {
        currentInput += ".";
    }
}

function handleClear() {
    currentInput = "";
    previousInput = "";
    operator = null;
}

function handleEquals() {
    if (previousInput && currentInput && operator) {
        calculate();
        operator = null;
        previousInput = "";
    }
}

function calculate() {
    const prev = parseFloat(previousInput);
    const curr = parseFloat(currentInput);
    if (isNaN(prev) || isNaN(curr)) return;

    switch (operator) {
        case "+":
            currentInput = prev + curr;
            break;
        case "-":
            currentInput = prev - curr;
            break;
        case "*":
            currentInput = prev * curr;
            break;
        case "/":
            currentInput = prev / curr;
            break;
        case "^":
            currentInput = Math.pow(prev, curr);
            break;
        case "%":
            currentInput = (prev * curr) / 100; // Percentage calculation
            break;
    }

    currentInput = currentInput.toString();
}

function updateScreen() {
    screen.value = currentInput || previousInput || "0";
}

document.addEventListener("keydown", (e) => {
    if (!isNaN(e.key)) {
        handleNumber(e.key);
    } else if (["+", "-", "*", "/", "^", "%"].includes(e.key)) {
        handleOperator(e.key);
    } else if (e.key === "Enter") {
        handleEquals();
    } else if (e.key === "Backspace") {
        currentInput = currentInput.slice(0, -1);
    } else if (e.key === "Escape") {
        handleClear();
    } else if (e.key === ".") {
        handleDecimal();
    }
    updateScreen();
});
