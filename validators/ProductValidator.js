import Joi  from "joi";

const SliderSchema = Joi.object({
    title: Joi.string().required(),
  });

  export default SliderSchema;