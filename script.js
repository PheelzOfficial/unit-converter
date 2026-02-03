const units = {
    length: {
        mm: 1,
        cm: 10,
        m: 1000,
        km: 1000000,
        inch: 25.4,
        foot: 304.8,
        yard: 914.4,
        mile: 1609344
    },
    weight: {
        mg: 1,
        g: 1000,
        kg: 1000000,
        ounce: 28349.5,
        lb: 453592
    },
    temperature: ['celsius', 'fahrenheit', 'kelvin']
};

const labels = {
    mm: 'Millimeter (mm)',
    cm: 'Centimeter (cm)',
    m: 'Meter (m)',
    km: 'Kilometer (km)',
    inch: 'Inch (in)',
    foot: 'Foot (ft)',
    yard: 'Yard (yd)',
    mile: 'Mile (mi)',
    mg: 'Milligram (mg)',
    g: 'Gram (g)',
    kg: 'Kilogram (kg)',
    ounce: 'Ounce (oz)',
    lb: 'Pound (lb)',
    celsius: 'Celsius (°C)',
    fahrenheit: 'Fahrenheit (°F)',
    kelvin: 'Kelvin (K)'
};

let currentCategory = 'length';

// DOM Elements
const tabBtns = document.querySelectorAll('.tab-btn');
const fromUnitSelect = document.getElementById('fromUnit');
const toUnitSelect = document.getElementById('toUnit');
const inputValue = document.getElementById('inputValue');
const convertBtn = document.getElementById('convertBtn');
const resetBtn = document.getElementById('resetBtn');
const resultSection = document.getElementById('resultSection');
const resultDisplay = document.getElementById('resultDisplay');
const resultContainer = document.getElementById('resultContainer');

function populateUnits(category) {
    fromUnitSelect.innerHTML = '';
    toUnitSelect.innerHTML = '';

    const unitList = Array.isArray(units[category])
        ? units[category]
        : Object.keys(units[category]);

    unitList.forEach(unit => {
        const option1 = document.createElement('option');
        option1.value = unit;
        option1.textContent = labels[unit];
        fromUnitSelect.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = unit;
        option2.textContent = labels[unit];
        toUnitSelect.appendChild(option2);
    });

    // Set defaults
    if (category === 'length') {
        fromUnitSelect.value = 'm';
        toUnitSelect.value = 'cm';
    } else if (category === 'weight') {
        fromUnitSelect.value = 'kg';
        toUnitSelect.value = 'g';
    } else {
        fromUnitSelect.value = 'celsius';
        toUnitSelect.value = 'fahrenheit';
    }
}

function convert() {
    const val = parseFloat(inputValue.value);
    if (isNaN(val)) return;

    const from = fromUnitSelect.value;
    const to = toUnitSelect.value;
    let result;

    if (currentCategory === 'temperature') {
        result = convertTemperature(val, from, to);
    } else {
        // Linear conversion via base unit (mm for length, mg for weight)
        const baseVal = val * units[currentCategory][from];
        result = baseVal / units[currentCategory][to];
    }

    displayResult(val, from, result, to);
}

function convertTemperature(value, from, to) {
    let celsius;

    // Convert to Celsius first
    if (from === 'celsius') celsius = value;
    else if (from === 'fahrenheit') celsius = (value - 32) * 5 / 9;
    else if (from === 'kelvin') celsius = value - 273.15;

    // Convert from Celsius to target
    if (to === 'celsius') return celsius;
    if (to === 'fahrenheit') return (celsius * 9 / 5) + 32;
    if (to === 'kelvin') return celsius + 273.15;
}

function displayResult(inputVal, from, result, to) {
    const formattedResult = Number.isInteger(result) ? result : parseFloat(result.toFixed(4));

    // Smooth appearance
    resultContainer.style.display = 'block';

    const fromLabel = labels[from].split('(')[1].replace(')', '');
    const toLabel = labels[to].split('(')[1].replace(')', '');

    resultDisplay.innerHTML = `${inputVal}${fromLabel} = <span class="gradient-text">${formattedResult}${toLabel}</span>`;
}

function reset() {
    inputValue.value = '';
    resultContainer.style.display = 'none';
}

// Event Listeners
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.category;
        populateUnits(currentCategory);
        reset();
    });
});

convertBtn.addEventListener('click', convert);
resetBtn.addEventListener('click', reset);

// Real-time update
inputValue.addEventListener('input', () => {
    if (inputValue.value) convert();
    else resultContainer.style.display = 'none';
});

fromUnitSelect.addEventListener('change', () => {
    if (inputValue.value) convert();
});

toUnitSelect.addEventListener('change', () => {
    if (inputValue.value) convert();
});

// Initialize
populateUnits('length');
