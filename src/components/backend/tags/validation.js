import * as Yup from "yup";

export const TagFormSchema = Yup.object().shape({
  name: Yup.string()
    .required(
      <span className="checkout-address__alert">
        <i className="fa fa-exclamation-circle" aria-hidden="true"></i>
        Please enter a tag name
      </span>
    )
    .min(3)
    .max(255),

  slug: Yup.string()
    .notRequired()
    .nullable()
    .optional()
    .transform((value, originalValue) => {
      if (!value) {
        return null;
      }
      return originalValue;
    }),

  description: Yup.string().min(3).max(255).notRequired().nullable().optional(),
});
