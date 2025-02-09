import * as Yup from "yup";

export const UpdateValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("First Name is required")
    .min(3, "First Name must be at least 3 characters")
    .max(15, "First Name can't exceed 15 characters"),

  lastName: Yup.string()
    .required("Last Name is required")
    .min(3, "Last Name must be at least 3 characters")
    .max(15, "Last Name can't exceed 15 characters"),

  phoneNumber: Yup.string()
    .required("Phone Number is required")
    .min(3, "Phone Number must be at least 3 characters")
    .max(15, "Phone Number can't exceed 15 characters")
    .matches(/^[\d]+$/, "Phone Number must only contain digits and no spaces")
    .matches(/^[^\s]+$/, "Phone Number must not contain any whitespace"),
});

export const UpdateBusinessValidationSchema = UpdateValidationSchema.shape({
  specialization: Yup.string()
    .required("Specialization is required")
    .min(3, "Specialization must be at least 3 characters")
    .max(25, "Specialization can't exceed 25 characters"),

  aboutMe: Yup.string()
    .min(25, "About Me must be at least 25 characters")
    .max(500, "About Me can't exceed 500 characters"),

  linkedinUrl: Yup.string()
    .nullable()
    .notRequired()
  ,

  githubUrl: Yup.string()
    .nullable()
    .notRequired()
  ,

  facebookUrl: Yup.string()
    .nullable()
    .notRequired()
  ,

  twitterUrl: Yup.string()
    .nullable()
    .notRequired()
  ,
});

