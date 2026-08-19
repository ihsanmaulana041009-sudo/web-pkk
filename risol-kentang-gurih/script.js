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

updateCart();