const products = [
    { name: 'ラディッシュ', price: 100 },
    { name: 'コースター', price: 300 },
    { name: 'ミサンガ', price: 200 },
    { name: '銀杏（良品）', price: 100 },
    { name: '銀杏（その他）', price: 50 },
    { name: '箸置き（バラ）', price: 30 },
    { name: '箸置き（セット）', price: 100 },
    { name: '傘（200円）', price: 200 },
    { name: '傘（100円）', price: 100 },
    { name: '雑巾', price: 100 },
    { name: 'さつまいも（大）', price: 100 },
    { name: 'さつまいも（中）', price: 50 },
    { name: 'さつまいも（小）', price: 10 },
    { name: '里芋', price: 200 },
    { name: '小物入れ', price: 100 },
    { name: 'アイロンビーズ（100円）', price: 100 },
    { name: 'アイロンビーズ（50円）', price: 50 }
];

const tableBody = document.getElementById('product-list-body');
const totalPriceResult = document.getElementById('total-price');

const itemCounts = {};

function updateGrandTotal() {
    let grandTotal = 0;
    const rows = document.querySelectorAll('.item-row');

    rows.forEach(row => {
        const subtotalText = row.querySelector('.subtotal').textContent;
        grandTotal += Number(subtotalText);
    });

    totalPriceResult.textContent = grandTotal;
}

products.forEach(product => {
    itemCounts[product.name] = 0;

    const row = document.createElement('tr');
    row.className = 'item-row';
    row.setAttribute('date-price', product.price);

    row.innerHTML = `
        <td>${product.name}</td>
        <td>${product.price}円</td>
        <td>
            <div class="quantity-control">
                <button class="minus-btn">－</button>
                <span class="quantity">0</span>
                <button class="plus-btn">＋</button>
            </div>
        </td>
        <td><span class="subtotal">0</span>円</td>
    `;

    tableBody.appendChild(row);

    const minusBtn = row.querySelector('.minus-btn');
    const plusBtn = row.querySelector('.plus-btn');
    const quantitySpan = row.querySelector('.quantity');
    const subtotalSpan = row.querySelector('.subtotal');

    plusBtn.addEventListener('click', () => {
        itemCounts[product.name]++;
        quantitySpan.textContent = itemCounts[product.name];
        subtotalSpan.textContent = itemCounts[product.name] * product.price;
        updateGrandTotal();
    });

    minusBtn.addEventListener('click', () => {
        if (itemCounts[product.name] > 0) {
            itemCounts[product.name]--;
            quantitySpan.textContent = itemCounts[product.name];
            subtotalSpan.textContent = itemCounts[product.name] * product.price;
            updateGrandTotal();
        }
    });

});

const resetBtn = document.getElementById('reset-btn');
if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        location.reload();
    });
}
// const itemRows = document.querySelectorAll('.item-row');
// const totalPriceResult = document.getElementById('total-price');

// itemRows.forEach(row => {
//     const price = Number(row.getAttribute('date-price'));

// });