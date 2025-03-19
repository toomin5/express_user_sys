import productRepository from "../repositories/productRepository.js";

// 여러 레포지토리 호출 데이터 검증가공

async function getById(id) {
  return await productRepository.getById(id);
}

async function create(product) {
  return await productRepository.save(product);
}

export default {
  getById,
  create,
};
