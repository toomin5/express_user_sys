import prisma from "../config/prisma.js";

// DB접근

async function getById(id) {
  return await prisma.product.findUnique({
    where: {
      id: parseInt(id, 10),
    },
  });
}

async function save(product) {
  return await prisma.product.create({
    data: {
      name: product.name,
      price: parseInt(product.price, 10),
    },
  });
}

export default {
  getById,
  save,
};
