
import UpdateProductUseCase from "./update.product.usecase";
import Product from "../../../domain/product/entity/product";

const product = new Product("123", "Product 1", 10);

const input = {
  id: product.id,
  name: "Product Updated",
  price: 20,
};

const MockRepository = () => {
  return {
    create: jest.fn(),
    findAll: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    update: jest.fn(),
  };
};

describe("Unit Test update product use case", () => {
  it("should update a product", async () => {
    const productRepository = MockRepository();
    const usecase = new UpdateProductUseCase(productRepository);
    const output = await usecase.execute(input);
    expect(output.id).toBe(input.id);
    expect(output.name).toBe(input.name);
    expect(output.price).toBe(input.price);
    expect(productRepository.update).toHaveBeenCalledWith(product);
  });

  it("should throw an error if product not found", async () => {
    const productRepository = MockRepository();
    productRepository.find.mockImplementation(() => { throw new Error("Product not found"); });
    const usecase = new UpdateProductUseCase(productRepository);
    const invalidInput = {
      id: "999",
      name: "Product Updated",
      price: 20,
    };
    await expect(usecase.execute(invalidInput)).rejects.toThrow("Product not found");
  });
});
