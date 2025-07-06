import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import UpdateProductUseCase from "../update/update.product.usecase";
import FindProductUseCase from "../find/find.product.usecase";

describe("Integration Test update product use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should update a product and find the updated product", async () => {
    const productRepository = new ProductRepository();
    const updateUsecase = new UpdateProductUseCase(productRepository);
    const findUsecase = new FindProductUseCase(productRepository);

    const product = new Product("1", "Product 1", 10);
    await productRepository.create(product);

    const inputUpdate = {
      id: "1",
      name: "Product Updated",
      price: 99.99,
    };
    const updated = await updateUsecase.execute(inputUpdate);

    const found = await findUsecase.execute({ id: "1" });

    expect(found).toEqual(updated);
  });
});
