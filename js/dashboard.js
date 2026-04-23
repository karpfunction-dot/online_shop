// ==================== DASHBOARD FUNCTIONS ====================
let productsData = loadProducts();

function updateStatistics() {
    const totalProducts = productsData.length;
    const totalValue = productsData.reduce((sum, product) => sum + product.price, 0);
    
    const totalProductsEl = document.getElementById('totalProducts');
    const totalValueEl = document.getElementById('totalValue');
    
    if (totalProductsEl) totalProductsEl.textContent = totalProducts;
    if (totalValueEl) totalValueEl.textContent = `Rp ${formatNumber(totalValue)}`;
}

function renderAdminTable() {
    const tbody = document.getElementById('adminProductTable');
    if (!tbody) return;
    
    if (productsData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted py-5">
                    <i class="fas fa-box-open fa-2x mb-2 d-block"></i>
                    Belum ada produk. Klik "Tambah Produk" untuk memulai.
                </td>
            </tr>
        `;
        return;
    }
    
    let rows = '';
    productsData.forEach(prod => {
        const imageUrl = prod.image && prod.image.trim() !== '' ? prod.image : 'https://via.placeholder.com/60';
        rows += `
            <tr>
                <td><small class="text-muted">${prod.id.substring(0,8)}...</small></td>
                <td>
                    <img src="${imageUrl}" class="product-img-table" 
                         onerror="this.src='https://via.placeholder.com/60'">
                </td>
                <td><strong>${escapeHtml(prod.name)}</strong></td>
                <td>${escapeHtml(prod.description) || '-'}</td>
                <td><span class="badge bg-primary">Rp ${formatNumber(prod.price)}</span></td>
                <td>
                    <button class="btn btn-sm btn-edit me-1" onclick="editProduct('${prod.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct('${prod.id}')" title="Hapus">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = rows;
    updateStatistics();
}

function refreshDashboard() {
    productsData = loadProducts();
    renderAdminTable();
}

function saveProduct() {
    const id = document.getElementById('productId').value;
    const name = document.getElementById('productName').value.trim();
    const description = document.getElementById('productDesc').value.trim();
    const price = parseInt(document.getElementById('productPrice').value);
    const image = document.getElementById('productImage').value.trim();
    
    if (!name) {
        alert('⚠️ Nama produk harus diisi!');
        return;
    }
    if (isNaN(price) || price <= 0) {
        alert('⚠️ Harga harus diisi dengan angka positif!');
        return;
    }
    
    if (id) {
        const index = productsData.findIndex(p => p.id === id);
        if (index !== -1) {
            productsData[index] = {
                ...productsData[index],
                name: name,
                description: description,
                price: price,
                image: image || ''
            };
            alert('✅ Produk berhasil diupdate!');
        }
    } else {
        const newProduct = {
            id: "prod_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6),
            name: name,
            description: description,
            price: price,
            image: image || ''
        };
        productsData.push(newProduct);
        alert('✅ Produk baru berhasil ditambahkan!');
    }
    
    saveProducts(productsData);
    refreshDashboard();
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
    if (modal) modal.hide();
    
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
}

window.editProduct = (id) => {
    const product = productsData.find(p => p.id === id);
    if (product) {
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productDesc').value = product.description || '';
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productImage').value = product.image || '';
        document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit me-2"></i>Edit Produk';
        
        const modal = new bootstrap.Modal(document.getElementById('productModal'));
        modal.show();
    }
};

window.deleteProduct = (id) => {
    if (confirm('⚠️ Apakah Anda yakin ingin menghapus produk ini?')) {
        productsData = productsData.filter(p => p.id !== id);
        saveProducts(productsData);
        refreshDashboard();
        alert('🗑️ Produk berhasil dihapus!');
    }
};

window.openProductModal = () => {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-plus-circle me-2"></i>Tambah Produk';
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    if (!requireAuth()) return;
    refreshDashboard();
    
    const saveBtn = document.getElementById('saveProductBtn');
    if (saveBtn) saveBtn.addEventListener('click', saveProduct);
});