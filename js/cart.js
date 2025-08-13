const carouselContainer = document.querySelector(".hero--carousel-container");
const carouselItems = document.querySelectorAll(".hero--carousel--item");
const prevBtn = document.querySelector(".hero--carousel-button-left");
const nextBtn = document.querySelector(".hero--carousel-button-right");
const cart = document.querySelector("#cart");
const cartList = document.querySelector("#cartList tbody");
const clearCartButton = document.querySelector("#cartButtonClean");
const bestSellersSlider = document.querySelector(".best--sellers--slider");
let cartArticles = [];
const cartButtonIcon = document.querySelector("#cartButton");
const cartButtonClose = document.querySelector("#cartButtonClose");

const buttonItem = document.querySelectorAll(
  ".best--sellers--slider-item button"
);

mainEventListeners();

function mainEventListeners() {
  bestSellersSlider.addEventListener("click", addProduct);
  cart.addEventListener("click", removeProduct);
  clearCartButton.addEventListener("click", clearCart);
  cartButtonIcon.addEventListener("click", toggleVisibleCart);
  cartButtonClose.addEventListener("click", toggleVisibleCart);
  nextBtn.addEventListener("click", () => {
    startAutoSlide();
    nextSlide();
  });

  prevBtn.addEventListener("click", () => {
    startAutoSlide();
    prevSlide();
  });
}
// carousel logic

let currentIndex = 0;
let autoSlideInterval;

const updateCarousel = () => {
  carouselContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
};

const startAutoSlide = () => {
  clearInterval(autoSlideInterval);
  autoSlideInterval = setInterval(() => {
    nextSlide();
  }, 3000);
};

const nextSlide = () => {
  if (currentIndex >= carouselItems.length - 1) {
    currentIndex = 0;
    // Aplicamos un pequeño retraso antes de reiniciar la animación.
    // Esto es para que el cambio de posición sea instantáneo y no haya un "salto" visible.
    setTimeout(() => {
      // Quitamos la transición momentáneamente para el "salto" rápido
      carouselContainer.style.transition = "none";
      // Volvemos al primer item sin animación
      updateCarousel();
      // Después de un instante, volvemos a poner la transición para el resto de la animación
      setTimeout(() => {
        carouselContainer.style.transition = "transform 0.5s ease-in-out";
      }, 50);
    }, 50);
  } else {
    currentIndex++;
  }
  updateCarousel();
};

// Función para ir al slide anterior
const prevSlide = () => {
  // Si estamos en el primer slide, vamos al último
  if (currentIndex <= 0) {
    currentIndex = carouselItems.length - 1;
  } else {
    currentIndex--;
  }
  updateCarousel();
};

// Inicializamos el carrusel automático
startAutoSlide();

// cart logic
function toggleVisibleCart() {
  if (cart.style.display === "none") {
    cart.style.display = "flex";
  } else {
    cart.style.display = "none";
  }
}

function addProduct(e) {
  e.preventDefault();
  if (e.target.classList.contains("best--sellers-button")) {
    const productSelected = e.target.parentElement;
    getProductData(productSelected);
  }
}

function getProductData(product) {
  const productData = {
    id: product.getAttribute("id"),
    image: product.querySelector("img").src,
    title: product.querySelector(".best--sellers--slider-title").textContent,
    price: product.querySelector(".best--sellers--slider-price").textContent,
    count: 1,
  };

  const hasProduct = cartArticles.some(
    (product) => product.id === productData.id
  );

  if (hasProduct) {
    const products = cartArticles.map((product) => {
      if (product.id === productData.id) {
        product.count++;
        return product;
      } else {
        return product;
      }
    });

    cartArticles = [...products];
  } else {
    cartArticles = [...cartArticles, productData];
  }

  addCartInHtml();

  return productData;
}

function addCartInHtml() {
  clearHtml();

    // Calcula el total de productos sumando los count de cada artículo
  const totalCount = cartArticles.reduce((acc, item) => acc + item.count, 0);

  cartArticles.forEach(({ image, title, price, count, id }) => {
    const tableRow = document.createElement("tr");
    tableRow.innerHTML = `
      <td>
        <img src="${image}" alt="${title}" height=40 width=40 />
      </td>
      <td>
        ${title}
      </td>
      <td>
        ${price}
      </td>
      <td>
        ${count}
      </td>
      <td>
        <a href="" class="cartButtonDeleted" data-id="${id}" >X</a>
      </td>
    `;
    tableRow.classList.add("cartRow");
    cartList.appendChild(tableRow);
  });
  // Elimina cualquier badge existente antes de crear uno nuevo
  const oldBadge = cartButtonIcon.querySelector(".badgeCart");
  if (oldBadge) {
    oldBadge.remove();
  }

  if (totalCount >= 1) {
    const badge = document.createElement("span")
    badge.textContent = totalCount
    badge.classList.add("badgeCart")
    cartButtonIcon.appendChild(badge)
  }
}

function clearHtml() {
  while (cartList.firstChild) {
    cartList.removeChild(cartList.firstChild);
  }
    // Elimina cualquier badge existente antes de crear uno nuevo
  const oldBadge = cartButtonIcon.querySelector(".badgeCart");
  if (oldBadge) {
    oldBadge.remove();
  }
}

function removeProduct(e) {
  e.preventDefault();

  if (e.target.classList.contains("cartButtonDeleted")) {
    const productId = e.target.getAttribute("data-id");
    const productIndex = cartArticles.findIndex(
      (product) => product.id === productId
    );

    if (productIndex !== -1) {
      if (cartArticles[productIndex].count > 1) {
        cartArticles[productIndex].count--;
      } else {
        cartArticles.splice(productIndex, 1);
      }
      addCartInHtml();
    }
  }
}

function clearCart(e) {
  e.preventDefault();
  cartArticles = [];
  clearHtml();
  toggleVisibleCart()
}
