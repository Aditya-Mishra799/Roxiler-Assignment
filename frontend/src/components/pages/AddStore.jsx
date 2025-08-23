import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../Input";
import TextArea from "../TextArea";
import Button from "../Button";
import "../css/Register.css";
import axios from "axios";
import { addStoreValidation } from "../../schemas/storeValidationSchema";
import { toast } from "react-hot-toast";

const AddStore = () => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting , isValid, isDirty},
    reset,
  } = useForm({
    resolver: zodResolver(
        addStoreValidation
    ),
    defaultValues: {
      owner: {
        name: "",
        email: "",
        password: "",
        role: "owner", 
        address: "",
      },
      store: {
        name: "",
        email: "",
        address: "",
      },
    },
  });

  const onSubmit = async (data) => {
    try {
      data.owner.role = "owner";

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/admin/add-store`,
        data,
        { withCredentials: true }
      );

      toast.success("Store and owner added successfully!");
      reset();
    } catch (err) {
      console.error(err);
      toast.error(
        "Failed to add store: " + (err.response?.data?.message || "")
      );
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
      <h2>Add Store</h2>

      <h3>Owner Details</h3>
      <Input name="owner.name" control={control} label="Full Name" />
      <Input name="owner.email" control={control} label="Email" />
      <Input
        name="owner.password"
        control={control}
        label="Password"
        type="password"
      />
      <TextArea
        name="owner.address"
        control={control}
        label="Address"
        rows={3}
      />

      <h3>Store Details</h3>
      <Input name="store.name" control={control} label="Store Name" />
      <Input name="store.email" control={control} label="Store Email" />
      <TextArea
        name="store.address"
        control={control}
        label="Store Address"
        rows={3}
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Add Store"}
      </Button>
    </form>
  );
};

export default AddStore;
