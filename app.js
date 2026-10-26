const itemRows = document.querySelectorAll('.item-row');
const totalPriceResult = document.getElementById('total-price');
const resetBtn = document.querySelector('.reset-btn');

function updateGrandTotal() {
    let grandTotal = 0;

    itemRows.forEach(row => {
        const subtotalText = row.querySelector('.subtotal').textContent;
        grandTotal += Number(subtotalText);
    });

    totalPriceResult.textContent = grandTotal;
}

resetBtn.addEventListener('click', () => {
    itemRows.forEach(row => {
        row.querySelector('.quantity').textContent ='0';
        row.querySelector('.subtotal').textContent ='0';
    });

    location.reload();
});

itemRows.forEach(row => {
    const price = Number(row.getAttribute('date-price'));

    const minusBtn = row.querySelector('.minus-btn');
    const plusBtn = row.querySelector('.plus-btn');
    const quantitySpan = row.querySelector('.quantity');
    const subtotalSpan = row.querySelector('.subtotal');

    let count = 0;

    plusBtn.addEventListener('click', () => {
        count++;
        quantitySpan.textContent = count;
        subtotalSpan.textContent = count * price;
        updateGrandTotal();
    });

    minusBtn.addEventListener('click', () => {
        if (count > 0) {
            count--;
            quantitySpan.textContent = count;
            subtotalSpan.textContent = count * price;
            updateGrandTotal();
        }
    });
})