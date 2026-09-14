/* =====================================================
   DATA KERANJANG
===================================================== */

let cart = [];


/* =====================================================
   NAVBAR
===================================================== */

const navbar =
    document.getElementById("navbar");

window.addEventListener("scroll", () => {

    if (window.scrollY > 40) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");

    }

});


/* =====================================================
   MOBILE MENU
===================================================== */

const navToggle =
    document.getElementById("navToggle");

const navMenu =
    document.getElementById("navMenu");


navToggle.addEventListener("click", () => {

    navMenu.classList.toggle("active");

    navToggle.classList.toggle("open");

});


navMenu
    .querySelectorAll("a")
    .forEach(link => {

        link.addEventListener("click", () => {

            navMenu.classList.remove("active");

            navToggle.classList.remove("open");

        });

    });



/* =====================================================
   FORMAT RUPIAH
===================================================== */

function formatRupiah(number) {

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }
    ).format(number);

}



/* =====================================================
   TAMBAH PRODUK
===================================================== */

function addToCart(name, price, icon) {

    const existingProduct =
        cart.find(item => item.name === name);


    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({

            name: name,

            price: price,

            icon: icon,

            quantity: 1

        });

    }


    updateCart();


    /* Scroll ke keranjang */

    const cartSection =
        document.getElementById("keranjang");


    cartSection.scrollIntoView({

        behavior: "smooth"

    });

}



/* =====================================================
   UPDATE KERANJANG
===================================================== */

function updateCart() {

    const cartItems =
        document.getElementById("cartItems");

    const cartCount =
        document.getElementById("cartCount");

    const cartTotal =
        document.getElementById("cartTotal");

    const summaryQuantity =
        document.getElementById("summaryQuantity");

    const checkoutBtn =
        document.getElementById("checkoutBtn");


    /* Jika kosong */

    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <div class="empty-cart-icon">
                    🛒
                </div>

                <h3>
                    Keranjang masih kosong
                </h3>

                <p>
                    Yuk pilih cemilan favoritmu!
                </p>

                <a
                    href="#produk"
                    class="btn btn-primary">

                    Pilih Produk

                </a>

            </div>

        `;

        cartCount.textContent = "0";

        cartTotal.textContent =
            "Rp 0";

        summaryQuantity.textContent =
            "0";

        checkoutBtn.disabled = true;

        return;

    }


    let total = 0;

    let totalQuantity = 0;


    /* Buat daftar produk */

    cartItems.innerHTML = "";


    cart.forEach((item, index) => {

        const itemTotal =
            item.price * item.quantity;


        total += itemTotal;

        totalQuantity += item.quantity;


        const cartItem =
            document.createElement("div");


        cartItem.className =
            "cart-item";


        cartItem.innerHTML = `

            <div class="cart-item-icon">
                ${item.icon}
            </div>

            <div class="cart-item-info">

                <h4>
                    ${item.name}
                </h4>

                <div class="cart-item-price">
                    ${formatRupiah(item.price)}
                </div>

            </div>

            <div class="quantity-control">

                <button
                    onclick="decreaseQuantity(${index})">

                    −

                </button>

                <span class="quantity-number">
                    ${item.quantity}
                </span>

                <button
                    onclick="increaseQuantity(${index})">

                    +

                </button>

            </div>

            <div class="cart-item-total">

                ${formatRupiah(itemTotal)}

            </div>

            <button
                class="remove-item"
                onclick="removeFromCart(${index})"
                title="Hapus">

                🗑️

            </button>

        `;


        cartItems.appendChild(cartItem);

    });


    /* Update angka */

    cartCount.textContent =
        totalQuantity;


    summaryQuantity.textContent =
        totalQuantity;


    cartTotal.textContent =
        formatRupiah(total);


    checkoutBtn.disabled =
        false;

}



/* =====================================================
   TAMBAH JUMLAH
===================================================== */

function increaseQuantity(index) {

    cart[index].quantity++;

    updateCart();

}



/* =====================================================
   KURANGI JUMLAH
===================================================== */

function decreaseQuantity(index) {

    cart[index].quantity--;


    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }


    updateCart();

}



/* =====================================================
   HAPUS PRODUK
===================================================== */

function removeFromCart(index) {

    cart.splice(index, 1);

    updateCart();

}



/* =====================================================
   KOSONGKAN KERANJANG
===================================================== */

const clearCartBtn =
    document.getElementById("clearCartBtn");


clearCartBtn.addEventListener(
    "click",
    () => {

        if (cart.length === 0) {
            return;
        }


        const confirmClear =
            confirm(
                "Yakin ingin mengosongkan keranjang?"
            );


        if (confirmClear) {

            cart = [];

            updateCart();

        }

    }
);



/* =====================================================
   MODAL PESANAN
===================================================== */

const checkoutBtn =
    document.getElementById("checkoutBtn");

const orderModal =
    document.getElementById("orderModal");

const modalClose =
    document.getElementById("modalClose");

const finishBtn =
    document.getElementById("finishBtn");

const orderDetails =
    document.getElementById("orderDetails");

const modalTotal =
    document.getElementById("modalTotal");


/* =====================================================
   METODE PEMBAYARAN
===================================================== */

const payQrisBtn = document.getElementById("payQrisBtn");
const payManualBtn = document.getElementById("payManualBtn");
const qrisPanel = document.getElementById("qrisPanel");
const manualPanel = document.getElementById("manualPanel");
const qrisImage = document.getElementById("qrisImage");
const qrisAmount = document.getElementById("qrisAmount");
const cashInput = document.getElementById("cashInput");
const cashTotalDisplay = document.getElementById("cashTotalDisplay");
const cashGivenDisplay = document.getElementById("cashGivenDisplay");
const cashChangeDisplay = document.getElementById("cashChangeDisplay");
const cashChangeRow = cashChangeDisplay ? cashChangeDisplay.closest(".change-row") : null;
const cashWarning = document.getElementById("cashWarning");

let selectedPaymentMethod = "qris";
let selectedOrderType = "langsung";
let currentOrderTotal = 0;

const orderLangsungBtn = document.getElementById("orderLangsungBtn");
const orderPreorderBtn = document.getElementById("orderPreorderBtn");
const preorderFields = document.getElementById("preorderFields");
const preorderDate = document.getElementById("preorderDate");
const preorderNote = document.getElementById("preorderNote");


function setPaymentMethod(method) {

    selectedPaymentMethod = method;

    payQrisBtn.classList.toggle("active", method === "qris");
    payManualBtn.classList.toggle("active", method === "manual");

    qrisPanel.classList.toggle("active", method === "qris");
    manualPanel.classList.toggle("active", method === "manual");

}


function setOrderType(type) {

    selectedOrderType = type;

    if (orderLangsungBtn) {
        orderLangsungBtn.classList.toggle("active", type === "langsung");
    }

    if (orderPreorderBtn) {
        orderPreorderBtn.classList.toggle("active", type === "preorder");
    }

    if (preorderFields) {
        preorderFields.classList.toggle("active", type === "preorder");
    }

}


if (payQrisBtn) {
    payQrisBtn.addEventListener("click", () => setPaymentMethod("qris"));
}

if (payManualBtn) {
    payManualBtn.addEventListener("click", () => setPaymentMethod("manual"));
}

if (orderLangsungBtn) {
    orderLangsungBtn.addEventListener("click", () => setOrderType("langsung"));
}

if (orderPreorderBtn) {
    orderPreorderBtn.addEventListener("click", () => setOrderType("preorder"));
}


function updateQrisImage(total) {

    /* Gunakan foto QRIS resmi (statis) sesuai permintaan */
    if (qrisImage) {
        qrisImage.src = "qris.jpeg";
        qrisImage.alt = "Kode QRIS Pembayaran - TOKO ONLINE";
    }

    if (qrisAmount) {
        qrisAmount.textContent = formatRupiah(total);
    }

}


function updateCashSummary() {

    const cashGiven =
        cashInput && cashInput.value !== ""
            ? parseInt(cashInput.value, 10)
            : 0;

    const change =
        cashGiven - currentOrderTotal;


    if (cashTotalDisplay) {
        cashTotalDisplay.textContent =
            formatRupiah(currentOrderTotal);
    }

    if (cashGivenDisplay) {
        cashGivenDisplay.textContent =
            formatRupiah(cashGiven);
    }

    if (cashChangeDisplay) {
        cashChangeDisplay.textContent =
            formatRupiah(Math.max(change, change < 0 ? change : 0));
    }


    const cashIsEnough =
        cashInput && cashInput.value !== "" && change >= 0;


    if (cashChangeRow) {
        cashChangeRow.classList.toggle("negative", !cashIsEnough);
    }

    if (cashWarning) {
        cashWarning.classList.toggle(
            "active",
            cashInput && cashInput.value !== "" && change < 0
        );
    }


    return cashIsEnough;

}


if (cashInput) {
    cashInput.addEventListener("input", updateCashSummary);
}



/* =====================================================
   BUKA MODAL
===================================================== */

checkoutBtn.addEventListener(
    "click",
    () => {

        if (cart.length === 0) {
            return;
        }


        let total = 0;


        orderDetails.innerHTML = "";


        cart.forEach(item => {

            const itemTotal =
                item.price * item.quantity;


            total += itemTotal;


            const orderItem =
                document.createElement("div");


            orderItem.className =
                "order-detail-item";


            orderItem.innerHTML = `

                <div class="order-detail-left">

                    <div class="order-detail-icon">
                        ${item.icon}
                    </div>

                    <div>

                        <div class="order-detail-name">
                            ${item.name}
                        </div>

                        <div class="order-detail-qty">
                            ${item.quantity} ×
                            ${formatRupiah(item.price)}
                        </div>

                    </div>

                </div>

                <div class="order-detail-price">
                    ${formatRupiah(itemTotal)}
                </div>

            `;


            orderDetails.appendChild(
                orderItem
            );

        });


        modalTotal.textContent =
            formatRupiah(total);


        currentOrderTotal = total;


        /* Reset metode pembayaran & jenis pesanan tiap kali modal dibuka */

        setPaymentMethod("qris");
        setOrderType("langsung");

        updateQrisImage(total);

        if (cashInput) {
            cashInput.value = "";
        }

        if (preorderDate) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            preorderDate.min = tomorrow.toISOString().split("T")[0];
            preorderDate.value = "";
        }

        if (preorderNote) {
            preorderNote.value = "";
        }

        updateCashSummary();


        orderModal.classList.add(
            "active"
        );

        document.body.style.overflow =
            "hidden";

    }
);



/* =====================================================
   TUTUP MODAL
===================================================== */

function closeModal() {

    orderModal.classList.remove(
        "active"
    );

    document.body.style.overflow =
        "";

}


modalClose.addEventListener(
    "click",
    closeModal
);



/* Klik area luar modal */

orderModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            orderModal
        ) {

            closeModal();

        }

    }
);



/* =====================================================
   SELESAI
===================================================== */

finishBtn.addEventListener(
    "click",
    () => {

        let completedTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);


        let paymentInfo = {
            method: selectedPaymentMethod
        };

        let orderInfo = {
            type: selectedOrderType
        };


        if (selectedOrderType === "preorder") {

            if (!preorderDate || !preorderDate.value) {
                alert("Silakan pilih tanggal pengambilan untuk preorder.");
                if (preorderDate) preorderDate.focus();
                return;
            }

            orderInfo.date = preorderDate.value;
            orderInfo.note = preorderNote ? preorderNote.value.trim() : "";

        }


        if (selectedPaymentMethod === "manual") {

            const cashIsEnough = updateCashSummary();

            if (!cashInput || cashInput.value === "") {
                alert("Silakan isi jumlah uang tunai yang diterima terlebih dahulu.");
                if (cashInput) cashInput.focus();
                return;
            }

            if (!cashIsEnough) {
                alert("Uang tunai belum cukup untuk membayar total belanja.");
                cashInput.focus();
                return;
            }

            const cashGiven = parseInt(cashInput.value, 10);

            paymentInfo.cashGiven = cashGiven;
            paymentInfo.change = cashGiven - completedTotal;

        }


        closeModal();


        savePurchaseHistory({
            date: new Date().toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" }),
            items: cart.map(item => ({ name: item.name, quantity: item.quantity })),
            total: completedTotal,
            payment: paymentInfo,
            order: orderInfo
        });


        let alertMsg = "Pesanan berhasil dibuat! 🎉\n\n";

        if (selectedOrderType === "preorder") {
            const tanggalIndo = new Date(orderInfo.date + "T00:00:00").toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            });
            alertMsg += `Jenis: Preorder\nTanggal Pengambilan: ${tanggalIndo}\n`;
            if (orderInfo.note) {
                alertMsg += `Catatan: ${orderInfo.note}\n`;
            }
            alertMsg += "\n";
        } else {
            alertMsg += "Jenis: Pesan Langsung\n\n";
        }

        if (paymentInfo.method === "manual") {
            alertMsg += `Pembayaran: Tunai Manual\nUang Diterima: ${formatRupiah(paymentInfo.cashGiven)}\nKembalian: ${formatRupiah(paymentInfo.change)}`;
        } else {
            alertMsg += "Pembayaran: QRIS";
        }

        alert(alertMsg);


        cart = [];

        updateCart();


        document
            .getElementById("produk")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);



/* =====================================================
   ANIMASI REVEAL
===================================================== */

const observerOptions = {

    threshold: 0.12,

    rootMargin:
        "0px 0px -40px 0px"

};


const observer =
    new IntersectionObserver(
        (entries) => {

            entries.forEach(entry => {

                if (
                    entry.isIntersecting
                ) {

                    entry.target.style.opacity =
                        "1";

                    entry.target.style.transform =
                        "translateY(0)";

                }

            });

        },
        observerOptions
    );


document
    .querySelectorAll(
        ".produk-card, .keunggulan-item"
    )
    .forEach(element => {

        element.style.opacity =
            "0";

        element.style.transform =
            "translateY(30px)";

        element.style.transition =
            "opacity 0.5s ease, transform 0.5s ease";

        observer.observe(element);

    });



/* =====================================================
   JALANKAN SAAT WEBSITE DIBUKA
===================================================== */

updateCart();


/* =====================================================
   CHATBOT
===================================================== */

const chatbotToggle = document.getElementById("chatbotToggle");
const chatbotBox = document.getElementById("chatbotBox");
const chatbotClose = document.getElementById("chatbotClose");
const chatbotInput = document.getElementById("chatbotInput");
const chatbotSend = document.getElementById("chatbotSend");
const chatbotMessages = document.getElementById("chatbotMessages");


if (chatbotToggle) {
    chatbotToggle.addEventListener("click", () => {
        chatbotBox.classList.toggle("active");
        if (chatbotBox.classList.contains("active")) chatbotInput.focus();
    });
}

if (chatbotClose) {
    chatbotClose.addEventListener("click", () => chatbotBox.classList.remove("active"));
}


function addChatMessage(message, sender) {
    const el = document.createElement("div");
    el.className = sender === "bot" ? "bot-message" : "user-message";
    el.innerHTML = message;
    chatbotMessages.appendChild(el);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}


function getPurchaseHistory() {
    try {
        return JSON.parse(localStorage.getItem("risolPurchaseHistory") || "[]");
    } catch (error) {
        return [];
    }
}


function savePurchaseHistory(order) {
    const history = getPurchaseHistory();
    history.unshift(order);
    localStorage.setItem("risolPurchaseHistory", JSON.stringify(history.slice(0, 20)));
}


/* =====================================================
   BASIS PENGETAHUAN CHATBOT

   Setiap intent punya daftar kata kunci pemicu.
   Ditambahkan intent baru di luar 4 tombol cepat supaya
   RisolBot tetap bisa menjawab pertanyaan bebas
   (nama usaha, keunggulan dibanding kompetitor, dll)
   tanpa menghapus 4 tombol menu yang sudah ada.
===================================================== */

const chatbotIntents = [

    {
        name: "sapaan",
        keywords: ["halo", "hai", "hi", "hello", "pagi", "siang", "sore", "malam"],
        response: () => `
            Selamat datang. Saya <strong>RisolBot</strong>, asisten <strong>Risol & Kentang Gurih</strong>.<br>
            Silakan pilih menu di bawah atau ketik pertanyaan Anda.
        `
    },

    {
        name: "terima_kasih",
        keywords: ["terima kasih", "makasih", "thanks", "thank you"],
        response: () => `Sama-sama! 🙏 Senang bisa membantu. Ada lagi yang ingin ditanyakan?`
    },

    {
        name: "nama_usaha",
        keywords: ["nama usaha", "nama toko", "nama bisnis", "nama brand", "usaha apa", "toko apa", "jualan apa", "berjualan apa", "kalian siapa", "kamu siapa", "ini usaha apa"],
        response: () => `
            🏪 <strong>Tentang Kami</strong><br><br>
            Kami adalah <strong>Risol & Kentang Gurih</strong>, usaha cemilan rumahan
            dengan tagline <em>"Lezat, Gurih, Lumer!"</em> — Cemilan favorit semua orang. 😋
        `
    },

    {
        name: "produk_tersedia",
        keywords: ["menu apa", "produk apa saja", "jual apa saja", "ada produk apa", "pilihan menu", "daftar menu", "varian"],
        response: () => `
            📋 <strong>Menu Kami (5 Produk)</strong><br><br>
            🥟 Risol Mayo<br>
            🍵 Risol Matcha<br>
            🍌 Stik Banana Matcha Lumpia<br>
            🍟 Kentang Goreng Renyah<br>
            🍫 Bolen Pisang Cokelat<br><br>
            Ketik <strong>"harga"</strong> untuk lihat daftar harga lengkap.
        `
    },

    {
        name: "harga",
        keywords: ["harga", "berapa", "price", "biaya"],
        response: () => `
            💰 <strong>Daftar Harga</strong><br><br>
            🥟 Risol Mayo — <strong>Rp3.000/pcs</strong><br>
            🍵 Risol Matcha — <strong>Rp3.000/pcs</strong><br>
            🍌 Stik Banana Matcha Lumpia — <strong>Rp5.000/pcs</strong><br>
            🍟 Kentang Goreng Renyah — <strong>Rp5.000/porsi</strong><br>
            🍫 Bolen Pisang Cokelat — <strong>Rp10.000/kotak</strong>
        `
    },

    {
        name: "keunggulan",
        keywords: ["keunggulan", "kelebihan", "kenapa pilih", "kenapa harus", "dibanding", "dibandingkan", "beda dengan", "bedanya", "kompetitor", "pesaing", "lebih baik", "unggul"],
        response: () => `
            ⭐ <strong>Keunggulan Kami Dibanding yang Lain</strong><br><br>
            🥘 Bahan berkualitas & dipilih langsung, tanpa pengawet<br>
            🔥 Renyah di luar, lumer di dalam — selalu digoreng fresh<br>
            💰 Harga terjangkau, mulai dari Rp3.000 saja<br>
            📦 Cocok untuk hampers, acara, maupun teman nonton<br>
            🛒 Bisa pesan online langsung lewat website ini<br>
            ❤️ Rasa konsisten yang bikin nagih tiap gigitan!
        `
    },

    {
        name: "pembayaran",
        keywords: ["metode pembayaran", "cara bayar", "bayar pakai", "qris", "tunai", "cash", "transfer", "pembayaran apa"],
        response: () => `
            💳 <strong>Metode Pembayaran</strong><br><br>
            Saat checkout, kamu bisa pilih salah satu:<br>
            📱 <strong>QRIS</strong> — scan kode QR untuk bayar<br>
            💵 <strong>Tunai Manual</strong> — isi jumlah uang tunai, kembalian dihitung otomatis
        `
    },

    {
        name: "riwayat",
        keywords: ["riwayat", "pesanan saya", "pembelian"],
        response: () => {
            const history = getPurchaseHistory();
            if (!history.length) {
                return `🧾 <strong>Riwayat Pembelian</strong><br><br>Belum ada riwayat pembelian di perangkat ini.`;
            }
            return `🧾 <strong>Riwayat Pembelian</strong><br><br>` + history.slice(0, 5).map((order, i) => {
                const items = order.items.map(item => `${item.name} ×${item.quantity}`).join(", ");
                const metodeBayar = order.payment && order.payment.method === "manual" ? "Tunai Manual" : "QRIS";
                const jenis = order.order && order.order.type === "preorder"
                    ? `Preorder (${order.order.date || "-"})`
                    : "Langsung";
                return `<strong>${i + 1}. ${order.date}</strong><br>${items}<br>Total: <strong>${formatRupiah(order.total)}</strong> · ${metodeBayar} · ${jenis}`;
            }).join("<br><br>");
        }
    },

    {
        name: "cara_pesan",
        keywords: ["cara", "pemesanan", "pesan", "beli", "order"],
        response: () => `
            🛒 <strong>Cara Pemesanan</strong><br><br>
            1️⃣ Pilih produk yang diinginkan.<br>
            2️⃣ Klik <strong>+ Pesan</strong>.<br>
            3️⃣ Cek produk di <strong>Keranjang</strong>.<br>
            4️⃣ Klik <strong>Pesan Sekarang</strong>.<br>
            5️⃣ Pilih jenis pesanan: <strong>Pesan Langsung</strong> atau <strong>Preorder</strong>.<br>
            6️⃣ Pilih metode pembayaran (QRIS/Tunai), lalu klik <strong>Selesai</strong>.
        `
    },

    {
        name: "preorder",
        keywords: ["preorder", "pre order", "pesan dulu", "pesan di muka", "pesan terlebih dahulu"],
        response: () => `
            📌 <strong>Preorder</strong><br><br>
            Kami menerima preorder melalui website ini.<br><br>
            Cara preorder:<br>
            1️⃣ Masukkan produk ke keranjang.<br>
            2️⃣ Klik <strong>Pesan Sekarang</strong>.<br>
            3️⃣ Pilih <strong>Preorder</strong>, isi tanggal pengambilan & catatan (opsional).<br>
            4️⃣ Pilih pembayaran, lalu klik <strong>Selesai</strong>.<br><br>
            📍 Lokasi: <strong>Jl. Patriot, Medan</strong>
        `
    },

    {
        name: "lokasi",
        keywords: ["lokasi", "alamat", "dimana", "di mana", "tempat", "address"],
        response: () => `
            📍 <strong>Lokasi</strong><br><br>
            Alamat kami: <strong>Jl. Patriot, Medan</strong><br><br>
            Untuk info pengambilan pesanan atau preorder, silakan hubungi admin kami ya!<br>
            <a class="chatbot-link" href="https://wa.me/6283133088286" target="_blank" rel="noopener">💬 Chat Admin via WhatsApp</a>
        `
    },

    {
        name: "jam_operasional",
        keywords: ["jam buka", "jam operasional", "buka jam", "tutup jam", "jam berapa"],
        response: () => `
            🕒 <strong>Jam Operasional</strong><br><br>
            Untuk jam operasional terbaru, silakan tanyakan langsung ke admin kami ya!<br>
            <a class="chatbot-link" href="https://wa.me/6283133088286" target="_blank" rel="noopener">💬 Chat Admin via WhatsApp</a>
        `
    },

    {
        name: "kontak_admin",
        keywords: ["admin", "kontak", "hubungi", "whatsapp", "wa", "cs"],
        response: () => `
            📞 <strong>Kontak Admin</strong><br><br>
            Butuh bantuan atau ingin menghubungi admin?<br>
            <a class="chatbot-link" href="https://wa.me/6283133088286" target="_blank" rel="noopener">💬 Chat Admin via WhatsApp</a>
        `
    }

];


function getBotResponse(message) {

    const text = message.toLowerCase().trim();

    for (const intent of chatbotIntents) {
        if (intent.keywords.some(keyword => text.includes(keyword))) {
            return intent.response();
        }
    }

    return `
        Maaf, saya belum memahami pertanyaan tersebut.<br><br>
        Silakan pilih salah satu menu di bawah, atau ketik pertanyaan lain terkait produk, harga, lokasi, maupun preorder.
    `;

}


function sendChatMessage(messageOverride = null) {
    const message = messageOverride || chatbotInput.value.trim();
    if (!message) return;
    addChatMessage(message, "user");
    chatbotInput.value = "";
    setTimeout(() => addChatMessage(getBotResponse(message), "bot"), 250);
}


if (chatbotSend) chatbotSend.addEventListener("click", () => sendChatMessage());

if (chatbotInput) chatbotInput.addEventListener("keydown", event => {
    if (event.key === "Enter") sendChatMessage();
});


document.querySelectorAll(".chatbot-quick-actions button").forEach(button => {
    button.addEventListener("click", () => sendChatMessage(button.dataset.question));
});
