import Paystack from "paystack";
import { cart } from "./cart";

const checkoutCartContainer = document.querySelector(".checkoutCart");
const checkoutCartQtyEl = document.querySelector(".checkoutCartQty");
const checkoutTotalEl = document.querySelector(".orderTotal");

const paystackPublic = "pk_test_300ba56261bed6445e5ddf0c31ea84e8abd5d812";

export const renderCheckoutCart = () => {
  checkoutCartContainer.innerHTML = "";
  checkoutCartQtyEl.textContent = cart.itemQuantity;
  checkoutTotalEl.textContent = `GHS ${cart.total}`;

  cart.items.forEach((item) => {
    const html = `<li class="list-group-item d-flex justify-content-between lh-sm">
            <div>
              <h6 class="my-0">${item.title}</h6>
              <small class="text-muted">Quantity: ${item.cartQuantity}</small>
            </div>
            <span class="text-muted">GHS ${
              item.price * item.cartQuantity
            }</span>
          </li>`;

    checkoutCartContainer.insertAdjacentHTML("afterbegin", html);
  });
};

const paymentComplete = () => {
  cart.items = [];
  cart.total = 0;
  cart.itemQuantity = 0;
  cart.render();
  cart.saveToLocalStorage();

  window.location.href = `${window.location.origin}`;
};

const paymentCancelled = () =>
  (window.location.href = `${window.location.origin}/checkout`);

let count = Math.random() * 100;

const payWithPaystack = (email) => {
  const ref = `customer-${email.split("@")[0]}-${count}`;
  count++;

  const handler = PaystackPop.setup({
    key: paystackPublic,
    email: email,
    amount: cart.total * 100,
    currency: "GHS",
    ref: ref,
    metadata: cart,
    callback: paymentComplete,
    onClose: paymentCancelled,
  });

  handler.openIframe();
};

export const completeOrder = (form) => {
  const email = form.email.value || "thewwwcreatives@gmail.com";

  payWithPaystack(email);
};
