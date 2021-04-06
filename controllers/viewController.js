const Product = require("../models/productModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).render("menu", { products, title: "Menu" });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({ slug: req.params.slug });

  res.status(200).render("product-detail", { product, title: product.title });
});

exports.getIndex = catchAsync(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).render("index", { products, title: "Home" });
});

exports.getCheckout = (req, res) => {
  res.status(200).render("checkout", { title: "Checkout" });
};
