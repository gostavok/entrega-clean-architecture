import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "../create/create.product.usecase";
import FindProductUseCase from "../find/find.product.usecase";

describe("Integration Test create and find product use case", () => {
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

  it("should create and find a product", async () => {
    const productRepository = new ProductRepository();
    const createUsecase = new CreateProductUseCase(productRepository);
    const findUsecase = new FindProductUseCase(productRepository);

    const inputCreate = {
      name: "Product 1",
      price: 10,
    };

    const created = await createUsecase.execute(inputCreate);

    const inputFind = {
      id: created.id,
    };

    const output = {
      id: created.id,
      name: inputCreate.name,
      price: inputCreate.price,
    };

    const result = await findUsecase.execute(inputFind);

    expect(result).toEqual(output);
  });
});
