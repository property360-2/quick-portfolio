const fs = require('fs');
let content = fs.readFileSync('rate/index.html', 'utf8');

// 1. Fix data attributes to lowercase 'usdt' in HTML
content = content.replace(/data-price-USDT=/g, 'data-price-usdt=');
content = content.replace(/data-base-USDT=/g, 'data-base-usdt=');
content = content.replace(/data-USDT=/g, 'data-usdt=');

// 2. Fix JS access to use lowercase 'usdt' in dataset
content = content.replace(/\.dataset\.USDT/g, '.dataset.usdt');
content = content.replace(/\.dataset\.priceUSDT/g, '.dataset.priceUsdt');
content = content.replace(/\.dataset\.baseUSDT/g, '.dataset.baseUsdt');

// 3. Make PHP default in JS calculation
// Find calculateTotals definition
// const calculateTotals = () => {
//     const isPhp = currencyToggle?.classList.contains('bg-wood-accent') ?? true;

// 4. Update HTML for default PHP state
// Main Toggle
content = content.replace(
    'id="currency-toggle" class="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none bg-gray-200 dark:bg-gray-700" role="switch" aria-checked="false"',
    'id="currency-toggle" class="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none bg-wood-accent" role="switch" aria-checked="true"'
);
content = content.replace(
    'id="currency-toggle"',
    'id="currency-toggle"'
); // redundant but for safety in searching

// Toggle Span
content = content.replace(
    '<span aria-hidden="true" class="translate-x-0 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>',
    '<span aria-hidden="true" class="translate-x-5 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>'
);

// Toggle Labels
content = content.replace(
    'id="currency-label-USDT">USDT ($)</span>',
    'id="currency-label-USDT" class="text-sm font-medium text-gray-500 dark:text-gray-500">USDT ($)</span>'
);
content = content.replace(
    'id="currency-label-php">PHP (₱)</span>',
    'id="currency-label-php" class="text-sm font-medium text-gray-700 dark:text-gray-300">PHP (₱)</span>'
);

fs.writeFileSync('rate/index.html', content);
console.log('Fixed NaN and set PHP as default.');
