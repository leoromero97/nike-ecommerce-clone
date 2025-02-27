const cart = document.querySelector("#cart");
const cartList = document.querySelector("#cartList tbody");
const cartButtonClean = document.querySelector("#cartButtonClean");
const bestSellersSlider = document.querySelector(".best--sellers--slider");
let cartArticles = [];

const buttonItem = document.querySelectorAll(
  ".best--sellers--slider-item button"
);

mainEventListeners();

function mainEventListeners() {
  bestSellersSlider.addEventListener("click", addCourse);
  cart.addEventListener("click", deleteCourse);
  cartButtonClean.addEventListener("click", clearCart);
}

function addCourse(e) {
  e.preventDefault();
  if (e.target.classList.contains("best--sellers-button")) {
    const courseSelected = e.target.parentElement;
    readDataByCourse(courseSelected);
  }
}

function readDataByCourse(course) {
  const courseData = {
    id: course.getAttribute("id"),
    image: course.querySelector("img").src,
    title: course.querySelector(".best--sellers--slider-title").textContent,
    price: course.querySelector(".best--sellers--slider-price").textContent,
    count: 1,
  };

  const hasCourse = cartArticles.some((course) => course.id === courseData.id);

  if (hasCourse) {
    const courses = cartArticles.map((course) => {
      if (course.id === courseData.id) {
        course.count++;
        return course;
      } else {
        return course;
      }
    });

    cartArticles = [...courses];
  } else {
    cartArticles = [...cartArticles, courseData];
  }

  addCartInHtml();

  return courseData;
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

function deleteCourse(e) {
  e.preventDefault();

  if (e.target.classList.contains("cartButtonDeleted")) {
    const courseId = e.target.getAttribute("data-id");
    cartArticles = cartArticles.filter((course) => course.id !== courseId);
    // mejorar lógica para borrar cantidades y no toda la fila
    addCartInHtml();
  }
}

function clearCart(e) {
  e.preventDefault();
  cartArticles = [];
  clearHtml()
}
