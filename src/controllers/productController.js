import express from "express";

import productService from "../services/productService.js";
import verifySessionLogin from "../middlewares/sessionAuth.js";

const productController = express.Router();

// 클라가 보낸 요청을 받고 응답 반환 -> 징검다리 역할
// validation은 컨트롤러에서 해주는게 좋음

// session로그인 한 유저만 프로덕트 등록할 수 있게
productController.post("/", verifySessionLogin, async (req, res, next) => {
  const createdProduct = await productService.create(req.body);
  return res.json(createdProduct);
});

productController.get("/:id", async (req, res) => {
  const { id } = req.params;
  const product = await productService.getById(id);
  return res.json(product);
});

export default productController;
