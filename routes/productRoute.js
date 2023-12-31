import express from "express";
import {
  codPaymentController,
  createProductController,
  deleteProductController,
  getProductController,
  getRecommendedProductController,
  getSingleProductController,
  onlinePaymentController,
  productCountController,
  productFilterController,
  productListController,
  productPhoto1Controller,
  productPhoto2Controller,
  productPhoto3Controller,
  productPhoto4Controller,
  relatedProductontroller,
  searchProductController,
  setOnlinePaymentController,
  updateProductController,
  verifyRazorpayPaymentController,
} from "../controller/productController.js";
import ExpressFormidable from "express-formidable";

const router = express.Router();

//routes
router.post("/create-product", ExpressFormidable(), createProductController);
router.put(
  "/update-product/:pid",
  ExpressFormidable(),
  updateProductController
);
//get products
router.get("/get-product", getProductController);

router.get("/get-recommended", getRecommendedProductController);
//single product
router.get("/get-product/:slug", getSingleProductController);
//get-photo
router.get("/product-photo1/:pid", productPhoto1Controller);
router.get("/product-photo2/:pid", productPhoto2Controller);
router.get("/product-photo3/:pid", productPhoto3Controller);
router.get("/product-photo4/:pid", productPhoto4Controller);
//delete product
router.delete("/delete-product/:pid", deleteProductController);
//filter product
router.post("/product-filters", productFilterController);
// product count
router.get("/product-count", productCountController);
//product per page
router.get("/product-list/:page", productListController);
//search product
router.get("/search/:keyword", searchProductController);
//similar route
router.get("/related-product/:pid/:cid", relatedProductontroller);

//payment
router.post("/payment-cod", codPaymentController);

router.post("/payment-online-set",setOnlinePaymentController)
router.post("/payment-online", onlinePaymentController);

router.post("/verifyRazorpayPayment", verifyRazorpayPaymentController);
export default router;
