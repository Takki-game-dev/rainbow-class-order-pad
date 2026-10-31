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

const itemCounts = {};
let isEditMode = false;
let isDeleteMode = false; // ★削除モードを覚えるスイッチを追加

function updateGrandTotal() {
    let grandTotal = 0;
    const rows = document.querySelectorAll('.item-row');
    rows.forEach(row => {
        const subtotalText = row.querySelector('.subtotal').textContent;
        grandTotal += Number(subtotalText);
    });
    totalPriceResult.textContent = grandTotal;
}

function renderTable() {
    tableBody.innerHTML = '';
    
    // 表の上の「選択」ヘッダーの表示・非表示を切り替える
    const deleteHeader = document.querySelector('.delete-header');
    if (deleteHeader) {
        deleteHeader.style.display = isDeleteMode ? 'table-cell' : 'none';
    }

    products.forEach((product, index) => {
        if (itemCounts[product.name] === undefined) {
            itemCounts[product.name] = 0;
        }

        const row = document.createElement('tr');
        row.className = 'item-row';
        row.setAttribute('data-price', product.price);

        // 値段変更モードの時は、単価の部分を入力欄（input）にする
        let priceColumnHtml = `<td>${product.price}円</td>`;
        if (isEditMode) {
            priceColumnHtml = `<td><input type="number" class="price-input" data-index="${index}" value="${product.price}">円</td>`;
        }

        // ★削除モードの時は、一番左にチェックボックスの列を追加する
        let deleteColumnHtml = '';
        if (isDeleteMode) {
            deleteColumnHtml = `<td><input type="checkbox" class="delete-checkbox" data-index="${index}"></td>`;
        }

        row.innerHTML = `
            ${deleteColumnHtml}
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
    updateGrandTotal();
}

function saveAndRefresh() {
    localStorage.setItem('rainbow_products', JSON.stringify(products));
    renderTable();
}

// ----------------------------------------------------
// 各ボタンのイベント処理
// ----------------------------------------------------

// 1. 【値段を変更】ボタン
const toggleEditBtn = document.getElementById('toggle-edit-btn');
toggleEditBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (isDeleteMode) return; // 削除モード中は動かさない

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

// 2. 【商品を追加】ボタン（プロンプト形式）
const toggleAddBtn = document.getElementById('toggle-add-btn');
toggleAddBtn.addEventListener('click', () => {
    if (isEditMode || isDeleteMode) return; // 他のモード中は動かさない

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

// 3. ★【削除】ボタンを押したとき（チェックボックス方式）
const deleteModeBtn = document.getElementById('delete-mode-btn');
deleteModeBtn.addEventListener('click', () => {
    if (isEditMode) return; // 値段変更モード中は動かさない

    if (!isDeleteMode) {
        // ①削除モードに入る
        isDeleteMode = true;
        deleteModeBtn.textContent = '選択した商品を削除';
        deleteModeBtn.classList.add('active');
        renderTable(); // チェックボックス付きで再描画
    } else {
        // ②削除の実行処理
        const checkboxes = document.querySelectorAll('.delete-checkbox');
        const checkedIndices = [];

        // チェックがついている商品の番号（index）をすべて集める
        checkboxes.forEach(cb => {
            if (cb.checked) {
                checkedIndices.push(Number(cb.getAttribute('data-index')));
            }
        });

        // チェックが1つ以上ついていた場合
        if (checkedIndices.length > 0) {
            if (confirm(`選択された ${checkedIndices.length} 個の商品を削除してもよろしいですか？`)) {
                // 配列の後ろ（インデックスが大きい方）から順番に消していかないと、
                // 前から消すと番号がズレて違う商品が消えてしまうのを防ぎます
                checkedIndices.sort((a, b) => b - a);
                
                checkedIndices.forEach(index => {
                    const deletedProduct = products[index];
                    // 注文個数の記憶からも削除
                    delete itemCounts[deletedProduct.name];
                    // 商品リストから削除
                    products.splice(index, 1);
                });
                
                alert('選択した商品を削除しました。');
            }
        }

        // 削除モードを終了して元に戻す
        isDeleteMode = false;
        deleteModeBtn.textContent = '削除';
        deleteModeBtn.classList.remove('active');
        saveAndRefresh(); // 保存して再描画
    }
});

// 4. 【注文をリセット】ボタン
document.getElementById('reset-btn').addEventListener('click', () => {
    for (let key in itemCounts) {
        itemCounts[key] = 0;
    }
    renderTable();
});

// 最初の起動
renderTable();