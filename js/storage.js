// ==================== STORAGE FUNCTIONS ====================
const STORAGE_KEY = 'toko_produk_list';
const LAST_UPDATE_KEY = 'toko_last_update';

const defaultProducts = [
    {
        id: "prod_default_1",
        name: "Produk 1",
        description: "Produk berkualitas tinggi dari siswa kreatif. Desain eksklusif dan terbatas!",
        price: 25000,
        image: "assets/images/produk1.png"
    },
    {
        id: "prod_default_2",
        name: "Produk 2",
        description: "Produk kedua dengan kualitas terbaik. Cocok untuk hadiah atau koleksi pribadi.",
        price: 30000,
        image: "assets/images/produk2.png"
    },
    {
        id: "prod_default_3",
        name: "Produk 3",
        description: "Produk ketiga spesial edisi terbatas. Dapatkan sebelum kehabisan!",
        price: 15000,
        image: "assets/images/produk3.png"
    }
];

function loadProducts() {
    let products = localStorage.getItem(STORAGE_KEY);
    if (!products || products === "[]") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
        updateLastUpdateTime();
        return [...defaultProducts];
    } else {
        return JSON.parse(products);
    }
}

function saveProducts(products) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    updateLastUpdateTime();
}

function updateLastUpdateTime() {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    localStorage.setItem(LAST_UPDATE_KEY, formattedTime);
}

function getLastUpdateTime() {
    return localStorage.getItem(LAST_UPDATE_KEY) || 'Belum pernah';
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatNumber(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}