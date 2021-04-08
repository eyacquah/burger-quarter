const express = require("express");

const viewController = require("../controllers/viewController");

const router = express.Router();

router.get("/", viewController.getIndex);
router.get("/menu", viewController.getAllProducts);
router.get("/menu/:slug", viewController.getProduct);
router.get("/checkout", viewController.getCheckout);
router.get("/reservation", viewController.getReservation);

module.exports = router;
