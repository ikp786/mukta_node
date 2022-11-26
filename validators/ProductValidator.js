import Joi  from "joi";

const ProductSchema = Joi.object({
    name: Joi.string().required(),
    category_id: Joi.string().required(),
    price: Joi.number().required(),
    discount_price: Joi.number().required(),
    description: Joi.string().required(),
  });

  export default ProductSchema;