import axios from "axios";
import { showAlert } from "./alerts";

const cartContainer = document.querySelector(".shopping-cart-items");
const cartTotalEl = document.querySelector(".cartTotal");
const cartQuantityEl = document.querySelector(".cartQuantity");

class Cart {
  constructor() {
    this.items = [];
    this.total = 0;
    this.itemQuantity = 0;
  }

  async addToCart(id) {
    showAlert("success", "Item added to cart");
    if (this.checkForDuplicates(id)) return this.render();
    // Grab item from DB

    try {
      const res = await axios.get(`/api/v1/products/${id}`);
      const item = res.data.data.doc;
      item.cartQuantity = 1;
      this.items.push(item);
    } catch (err) {
      console.error(err);
    }

    // Render Cart
    this.render();
    this.saveToLocalStorage();

    // Add listeners to Remove btns
  }

  render() {
    // console.log("RENDER", this.items);
    this.total = 0;
    this.itemQuantity = 0;
    cartContainer.innerHTML = "";

    this.items.forEach((item) => {
      const cartHTML = `<li class="clearfix">
                    <img class="dimensions img-fluid" src="/img/products/${item.images[0]}" alt="item1" />
                    <span class="item-name">${item.title}</span>
                    <span class="item-price">GHS ${item.price}</span>
                    <span class="item-quantity">Quantity: ${item.cartQuantity}</span>
                    <button class="remove fa fa-close" data-id=${item._id}></button>
                </li>`;

      cartContainer.insertAdjacentHTML("afterbegin", cartHTML);

      this.total += +item.price * item.cartQuantity;
      this.itemQuantity += item.cartQuantity;
      this._addListenerToRemoveBtns();
    });

    cartTotalEl.textContent = ` GHS ${this.total}`;
    cartQuantityEl.textContent = this.itemQuantity;
  }

  checkForDuplicates(id) {
    if (!this.items.length) return false;

    const duplicate = this.items.find((obj) => obj._id === id);

    if (duplicate) duplicate.cartQuantity++;
    this.saveToLocalStorage();

    return duplicate;
  }

  init() {
    const storage = localStorage.getItem("items");

    if (storage) {
      this.items = JSON.parse(storage);
      this.render();
    }

    // localStorage.clear("items");
  }

  saveToLocalStorage() {
    // Save to Local Storage
    localStorage.setItem("items", JSON.stringify(this.items));
  }

  _addListenerToRemoveBtns() {
    const removeBtns = document.querySelectorAll(".remove");

    removeBtns.forEach((btn) => {
      const cart = this;

      btn.addEventListener("click", (e) => {
        // console.log("CLICKED", e.target.dataset.id);
        showAlert("danger", "Item removed from cart");

        const clickedItem = cart.items.find(
          (item) => item._id === e.target.dataset.id
        );
        cart.items.pop(clickedItem);

        // console.log("REMOVE FUNC", cart.items);
        cart.render();

        localStorage.setItem("items", JSON.stringify(cart.items));
      });
    });
  }
}

export const cart = new Cart();
cart.init();

//////
// (function () {
//   $("#cart").on("click", function () {
//     $(".shopping-cart").fadeToggle("fast");
//   });
// })();
