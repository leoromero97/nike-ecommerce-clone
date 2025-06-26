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
}

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
}

function clearHtml() {
  while (cartList.firstChild) {
    cartList.removeChild(cartList.firstChild);
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
}
