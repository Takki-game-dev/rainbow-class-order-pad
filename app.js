const defaultProducts = [
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

let products = JSON.parse(localStorage.getItem('rainbow_products')) || defaultProducts;

const tableBody = document.getElementById('product-list-body');
const totalPriceResult = document.getElementById('total-price');
const selectedItemsList = document.getElementById('selected-items-list');

const itemCounts = {};
let isEditMode = false;
let isDeleteMode = false;
let isSortMode = false; 

// ★新しく追加：最後に動かした商品の名前を記憶しておく変数
let lastMovedProductName = ''; 

function updateGrandTotal() {
    let grandTotal = 0;
    const rows = document.querySelectorAll('.item-row');
    rows.forEach(row => {
        const subtotalText = row.querySelector('.subtotal').textContent;
        grandTotal += Number(subtotalText);
    });
    totalPriceResult.textContent = grandTotal;
}

function updateSelectedItemsList() {
    selectedItemsList.innerHTML = '';
    let hasItems = false;

    products.forEach(product => {
        const count = itemCounts[product.name] || 0;
        if (count > 0) {
            hasItems = true;
            const itemLine = document.createElement('div');
            itemLine.className = 'selected-item-line';
            itemLine.innerHTML = `
                <span>・${product.name} × ${count}個</span>
                <span>${count * product.price}円</span>
            `;
            selectedItemsList.appendChild(itemLine);
        }
    });

    if (!hasItems) {
        selectedItemsList.textContent = '選択された商品はありません';
    }
}

function renderTable() {
    tableBody.innerHTML = '';
    
    const deleteHeader = document.querySelector('.delete-header');
    if (deleteHeader) {
        deleteHeader.style.display = isDeleteMode ? 'table-cell' : 'none';
    }

    const sortHeader = document.querySelector('.sort-header');
    if (sortHeader) {
        sortHeader.style.display = isSortMode ? 'table-cell' : 'none';
    }

    products.forEach((product, index) => {
        if (itemCounts[product.name] === undefined) {
            itemCounts[product.name] = 0;
        }

        const row = document.createElement('tr');
        
        // ★調整：もしこの行が「最後に動かした商品」なら、水色にするクラス（active-sort-row）をくっつける
        if (isSortMode && product.name === lastMovedProductName) {
            row.className = 'item-row active-sort-row';
        } else {
            row.className = 'item-row';
        }
        
        row.setAttribute('data-price', product.price);

        let priceColumnHtml = `<td>${product.price}円</td>`;
        if (isEditMode) {
            priceColumnHtml = `<td><input type="number" class="price-input" data-index="${index}" value="${product.price}">円</td>`;
        }

        let deleteColumnHtml = '';
        if (isDeleteMode) {
            deleteColumnHtml = `<td><input type="checkbox" class="delete-checkbox" data-index="${index}"></td>`;
        }

        let sortColumnHtml = '';
        if (isSortMode) {
            sortColumnHtml = `
                <td>
                    <div class="arrow-control">
                        <button type="button" class="arrow-btn up-btn" data-index="${index}">⇧</button>
                        <button type="button" class="arrow-btn down-btn" data-index="${index}">⇩</button>
                    </div>
                </td>
            `;
        }

        row.innerHTML = `
            ${deleteColumnHtml}
            ${sortColumnHtml}
            <td>${product.name}</td>
            ${priceColumnHtml}
            <td>
                <div class="quantity-control">
                    <button class="minus-btn">－</button>
                    <span class="quantity">${itemCounts[product.name]}</span>
                    <button class="plus-btn">＋</button>
                </div>
            </td>
            <td><span class="subtotal">${itemCounts[product.name] * product.price}</span>円</td>
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
            updateSelectedItemsList();
        });

        minusBtn.addEventListener('click', () => {
            if (itemCounts[product.name] > 0) {
                itemCounts[product.name]--;
                quantitySpan.textContent = itemCounts[product.name];
                subtotalSpan.textContent = itemCounts[product.name] * product.price;
                updateGrandTotal();
                updateSelectedItemsList();
            }
        });
    });

    if (isSortMode) {
        // 🔼（上へ）ボタンの処理
        const upButtons = document.querySelectorAll('.up-btn');
        upButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const index = Number(btn.getAttribute('data-index'));
                if (index > 0) { 
                    // ★追加：動かした商品の名前を記憶する
                    lastMovedProductName = products[index].name;

                    const temp = products[index];
                    products[index] = products[index - 1];
                    products[index - 1] = temp;
                    saveAndRefresh();
                }
            });
        });

        // 🔽（下へ）ボタンの処理
        const downButtons = document.querySelectorAll('.down-btn');
        downButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const index = Number(btn.getAttribute('data-index'));
                if (index < products.length - 1) { 
                    // ★追加：動かした商品の名前を記憶する
                    lastMovedProductName = products[index].name;

                    const temp = products[index];
                    products[index] = products[index + 1];
                    products[index + 1] = temp;
                    saveAndRefresh();
                }
            });
        });
    }

    updateGrandTotal();
    updateSelectedItemsList();
}

function saveAndRefresh() {
    localStorage.setItem('rainbow_products', JSON.stringify(products));
    renderTable();
}

// 1. 【値段を変更】ボタン
const toggleEditBtn = document.getElementById('toggle-edit-btn');
toggleEditBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (isDeleteMode || isSortMode) return; 

    if (!isEditMode) {
        isEditMode = true;
        toggleEditBtn.textContent = '価格を保存する';
        toggleEditBtn.classList.add('active');
        renderTable();
    } else {
        const priceInputs = document.querySelectorAll('.price-input');
        priceInputs.forEach(input => {
            const index = Number(input.getAttribute('data-index'));
            const newPrice = parseInt(input.value, 10);
            if (!isNaN(index) && !isNaN(newPrice) && newPrice >= 0) {
                products[index].price = newPrice;
            }
        });

        isEditMode = false;
        toggleEditBtn.textContent = '値段を変更';
        toggleEditBtn.classList.remove('active');
        saveAndRefresh();
    }
});

// 2. 【商品を追加】ボタン
const toggleAddBtn = document.getElementById('toggle-add-btn');
toggleAddBtn.addEventListener('click', () => {
    if (isEditMode || isDeleteMode || isSortMode) return;

    const name = prompt('新しく追加する「商品名」を入力してください：');
    if (name === null) return;
    
    const trimmedName = name.trim();
    if (!trimmedName) {
        alert('商品名が入力されていません！');
        return;
    }

    if (products.some(p => p.name === trimmedName)) {
        alert('その商品はすでに登録されています！');
        return;
    }

    const priceStr = prompt(`「${trimmedName}」の「値段（数値のみ）」を入力してください：`);
    if (priceStr === null) return;

    const price = parseInt(priceStr, 10);
    if (isNaN(price) || price < 0) {
        alert('正しい値段（数字）を入力してください！');
        return;
    }

    products.push({ name: trimmedName, price: price });
    saveAndRefresh();
    alert(`「${trimmedName}（${price}円）」を追加しました！`);
});

// 3. 【削除】ボタン
const deleteModeBtn = document.getElementById('delete-mode-btn');
deleteModeBtn.addEventListener('click', () => {
    if (isEditMode || isSortMode) return;

    if (!isDeleteMode) {
        isDeleteMode = true;
        deleteModeBtn.textContent = '選択した商品を削除';
        deleteModeBtn.classList.add('active');
        renderTable();
    } else {
        const checkboxes = document.querySelectorAll('.delete-checkbox');
        const checkedIndices = [];

        checkboxes.forEach(cb => {
            if (cb.checked) {
                checkedIndices.push(Number(cb.getAttribute('data-index')));
            }
        });

        if (checkedIndices.length > 0) {
            if (confirm(`選択された ${checkedIndices.length} 個の商品を削除してもよろしいですか？`)) {
                checkedIndices.sort((a, b) => b - a);
                
                checkedIndices.forEach(index => {
                    const deletedProduct = products[index];
                    delete itemCounts[deletedProduct.name];
                    products.splice(index, 1);
                });
                
                alert('選択した商品を削除しました。');
            }
        }

        isDeleteMode = false;
        deleteModeBtn.textContent = '削除';
        deleteModeBtn.classList.remove('active');
        saveAndRefresh();
    }
});

// 4. 【並び替え】ボタン
const sortModeBtn = document.getElementById('sort-mode-btn');
sortModeBtn.addEventListener('click', () => {
    if (isEditMode || isDeleteMode) return; 

    if (!isSortMode) {
        isSortMode = true;
        sortModeBtn.textContent = '並び替えを終了';
        sortModeBtn.classList.add('active');
        renderTable();
    } else {
        // ★調整：並び替えモードを終了するときは、水色の記憶も綺麗に消す
        isSortMode = false;
        lastMovedProductName = '';
        sortModeBtn.textContent = '並び替え';
        sortModeBtn.classList.remove('active');
        renderTable();
    }
});

// 5. 【注文をリセット】ボタン
document.getElementById('reset-btn').addEventListener('click', () => {
    for (let key in itemCounts) {
        itemCounts[key] = 0;
    }
    renderTable();
    updateSelectedItemsList();
});

// 最初の起動
renderTable();