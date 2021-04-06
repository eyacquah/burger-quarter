import regeneratorRuntime from "regenerator-runtime";

import { cart } from "./cart";
import { completeOrder, renderCheckoutCart } from "./checkout";

const addToCartBtn = document.querySelector(".addToCart");
const checkoutCartContainer = document.querySelector(".checkoutCart");
const checkoutForm = document.querySelector(".checkoutForm");

async function handleAddToCart() {
  await cart.addToCart(this.dataset.id);
}

function handleCheckoutForm(e) {
  e.preventDefault();
  console.log("uhuh");
  completeOrder(this);
}

const toggleCart = () => {
  $("#cart").on("click", () => {
    $(".shopping-cart").fadeToggle("fast");
  });
};

toggleCart();

if (addToCartBtn) addToCartBtn.addEventListener("click", handleAddToCart);

if (checkoutCartContainer) renderCheckoutCart();
if (checkoutForm) {
  console.log("yes");
  checkoutForm.addEventListener("submit", handleCheckoutForm);
}
