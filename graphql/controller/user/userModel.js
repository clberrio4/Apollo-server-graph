import mongoose from "mongoose";

const User = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "los usuarios debn especificar su username"]
    },
    last_name: String,
    username: {
      type: String,
      required: [true, "los usuarios deben especificar su username"],
      unique: [true, "Este username ya se encuentra registrado"]
    },
    password: {
      type: String,
      required: [true, "los usuarios deben especificar su password"]
    },
    email: {
      type: String,
      required: [true, "los usuarios deben tener un email registrado"],
      unique: true
    }
  },
  {
    timestamps: true,
    collection: "users",
    skipVersioning: true,
    versionKey: false
  }
);
export default mongoose.model("users", User);