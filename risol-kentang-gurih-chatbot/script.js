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

        closeModal();


        let completedTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        savePurchaseHistory({
            date: new Date().toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" }),
            items: cart.map(item => ({ name: item.name, quantity: item.quantity })),
            total: completedTotal
        });

        alert(
            "Pesanan berhasil dibuat! 🎉"
        );


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

        if (chatbotBox.classList.contains("active")) {
            chatbotInput.focus();
        }
    });
}

if (chatbotClose) {
    chatbotClose.addEventListener("click", () => {
        chatbotBox.classList.remove("active");
    });
}

function addChatMessage(message, sender) {
    const el = document.createElement("div");

    el.className = sender === "bot"
        ? "bot-message"
        : "user-message";

    el.innerHTML = message;

    chatbotMessages.appendChild(el);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}


/* =====================================================
   RIWAYAT PEMBELIAN
===================================================== */

function getPurchaseHistory() {
    try {
        return JSON.parse(
            localStorage.getItem("risolPurchaseHistory") || "[]"
        );
    } catch (error) {
        return [];
    }
}

function savePurchaseHistory(order) {
    const history = getPurchaseHistory();

    history.unshift(order);

    localStorage.setItem(
        "risolPurchaseHistory",
        JSON.stringify(history.slice(0, 20))
    );
}


/* =====================================================
   JAWABAN CHATBOT
===================================================== */

function getBotResponse(message) {

    const text = message.toLowerCase().trim();


    // HARGA
    if (
        text.includes("harga") ||
        text.includes("berapa") ||
        text.includes("price")
    ) {
        return `
            💰 <strong>Daftar Harga</strong><br><br>

            🥟 Risol Mayo — <strong>Rp3.000/pcs</strong><br>
            🍵 Risol Matcha — <strong>Rp3.000/pcs</strong><br>
            🍌 Stik Banana Matcha Lumpia — <strong>Rp5.000/pcs</strong><br>
            🍟 Kentang Goreng Renyah — <strong>Rp5.000/porsi</strong><br>
            🍫 Bolen Pisang Cokelat — <strong>Rp10.000/kotak</strong>
        `;
    }


    // RIWAYAT PEMBELIAN
    if (
        text.includes("riwayat") ||
        text.includes("pesanan saya") ||
        text.includes("pembelian")
    ) {

        const history = getPurchaseHistory();

        if (!history.length) {
            return `
                🧾 <strong>Riwayat Pembelian</strong><br><br>
                Belum ada riwayat pembelian di perangkat ini.
            `;
        }

        return `
            🧾 <strong>Riwayat Pembelian</strong><br><br>

            ${history.slice(0, 5).map((order, index) => {

                const items = order.items
                    .map(item => `${item.name} ×${item.quantity}`)
                    .join(", ");

                return `
                    <strong>${index + 1}. ${order.date}</strong><br>
                    ${items}<br>
                    Total: <strong>${formatRupiah(order.total)}</strong>
                `;

            }).join("<br><br>")}
        `;
    }


    // CARA PEMESANAN
    if (
        text.includes("cara") ||
        text.includes("pemesanan") ||
        text.includes("pesan") ||
        text.includes("beli") ||
        text.includes("order")
    ) {
        return `
            🛒 <strong>Cara Pemesanan</strong><br><br>

            1️⃣ Pilih produk yang kamu mau.<br>
            2️⃣ Klik <strong>+ Pesan</strong>.<br>
            3️⃣ Cek produk di <strong>Keranjang</strong>.<br>
            4️⃣ Klik <strong>Pesan Sekarang</strong>.<br>
            5️⃣ Periksa pesanan, lalu klik <strong>Selesai</strong>.
        `;
    }


    // KONTAK ADMIN
if (
    text.includes("admin") ||
    text.includes("kontak") ||
    text.includes("hubungi") ||
    text.includes("whatsapp") ||
    text.includes("wa")
) {
    const nomorAdmin = "6281396990394";

    const pesan = encodeURIComponent(
        "Halo Admin Risol & Kentang Gurih, saya ingin bertanya tentang produk yang tersedia."
    );

    return `
        📞 <strong>Kontak Admin</strong><br><br>

        Kamu bisa langsung menghubungi Admin melalui WhatsApp.<br><br>

        <a
            class="chatbot-link"
            href="https://wa.me/${nomorAdmin}?text=${pesan}"
            target="_blank"
            rel="noopener"
        >
            💬 Chat Admin via WhatsApp
        </a>
    `;
}

    // SAPAAN
    if (
        text.includes("halo") ||
        text.includes("hai") ||
        text.includes("hi")
    ) {
        return `
            Halo! 👋<br><br>

            Saya <strong>RisolBot 🤖</strong>.

            Kamu bisa bertanya tentang:
            <br><br>

            💰 <strong>Harga</strong><br>
            🧾 <strong>Riwayat Pembelian</strong><br>
            🛒 <strong>Cara Pemesanan</strong><br>
            📞 <strong>Kontak Admin</strong>
        `;
    }


    // JIKA TIDAK MENGERTI
    return `
        Maaf, saya belum memahami pertanyaan itu 😅<br><br>

        Silakan tanyakan:

        <br>💰 <strong>Harga</strong>
        <br>🧾 <strong>Riwayat Pembelian</strong>
        <br>🛒 <strong>Cara Pemesanan</strong>
        <br>📞 <strong>Kontak Admin</strong>
    `;
}


/* =====================================================
   KIRIM PESAN
===================================================== */

function sendChatMessage(messageOverride = null) {

    const message =
        messageOverride || chatbotInput.value.trim();

    if (!message) return;

    addChatMessage(message, "user");

    chatbotInput.value = "";

    setTimeout(() => {

        const response = getBotResponse(message);

        addChatMessage(response, "bot");

    }, 250);
}


if (chatbotSend) {

    chatbotSend.addEventListener("click", () => {
        sendChatMessage();
    });

}


if (chatbotInput) {

    chatbotInput.addEventListener("keydown", event => {

        if (event.key === "Enter") {
            sendChatMessage();
        }

    });

}


/* =====================================================
   TOMBOL CEPAT CHATBOT
===================================================== */

document
    .querySelectorAll(".chatbot-quick-actions button")
    .forEach(button => {

        button.addEventListener("click", () => {

            sendChatMessage(
                button.dataset.question
            );

        });

    });