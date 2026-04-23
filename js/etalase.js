// ==================== ETALASE FUNCTIONS ====================
let productsData = loadProducts();

function renderEtalase() {
    const container = document.getElementById('productListFront');
    if (!container) return;
    
    if (productsData.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info alert-no-products bg-white">
                    <i class="fas fa-box-open fa-3x mb-3 text-primary"></i>
                    <h4>Belum ada produk</h4>
                    <p>Silakan tunggu admin menambahkan produk.</p>
                </div>
            </div>
        `;
        return;
    }
    
    let html = '';
    productsData.forEach((prod, index) => {
        const imageUrl = prod.image && prod.image.trim() !== '' ? prod.image : 'https://via.placeholder.com/300x200?text=No+Image';
        html += `
            <div class="col-md-4 mb-4 fade-in" style="animation-delay: ${index * 0.05}s">
                <div class="card shadow-sm product-card h-100">
                    <img src="${imageUrl}" class="card-img-top" alt="${escapeHtml(prod.name)}" 
                         onerror="this.src='https://via.placeholder.com/300x200?text=Gambar+Error'">
                    <div class="card-body">
                        <h5 class="card-title fw-bold">${escapeHtml(prod.name)}</h5>
                        <p class="card-text text-muted">${escapeHtml(prod.description) || 'Tidak ada deskripsi'}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <span class="badge bg-primary badge-price">
                                <i class="fas fa-tag me-1"></i>Rp ${formatNumber(prod.price)}
                            </span>
                            <button class="btn btn-outline-primary" disabled>
                                <i class="fas fa-info-circle"></i> Detail
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
    
    const lastUpdateEl = document.getElementById('lastUpdateTime');
    if (lastUpdateEl) lastUpdateEl.textContent = getLastUpdateTime();
}

function refreshEtalase(showNotif = true, isExternalChange = false) {
    const newData = loadProducts();
    
    if (JSON.stringify(productsData) !== JSON.stringify(newData)) {
        productsData = newData;
        renderEtalase();
        if (showNotif && typeof showNotification === 'function') {
            if (isExternalChange) {
                showNotification('🔄 Data produk telah diperbarui oleh admin!');
            } else {
                showNotification('✅ Data produk berhasil diperbarui!');
            }
        }
        return true;
    }
    return false;
}

function showNotification(message, isError = false) {
    const toast = document.getElementById('notificationToast');
    if (!toast) return;
    
    const toastMessage = document.getElementById('toastMessage');
    const alertDiv = toast.querySelector('.alert');
    
    toastMessage.textContent = message;
    alertDiv.className = `alert alert-${isError ? 'danger' : 'success'} alert-dismissible fade show mb-0 shadow`;
    toast.style.display = 'block';
    
    setTimeout(() => {
        const toastEl = document.getElementById('notificationToast');
        if (toastEl) toastEl.style.display = 'none';
    }, 3000);
}

// Auto-sync
window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
        refreshEtalase(true, true);
    }
});

setInterval(() => {
    const currentData = localStorage.getItem(STORAGE_KEY);
    if (currentData && JSON.stringify(productsData) !== currentData) {
        refreshEtalase(true, true);
    }
}, 3000);

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        refreshEtalase(true, false);
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderEtalase();
    updateUIBasedOnLogin();
});