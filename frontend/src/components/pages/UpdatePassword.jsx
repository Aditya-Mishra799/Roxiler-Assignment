import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {  updatePasswordSchema } from "../../schemas/userValidation"; // <-- your schema file
import Input from "../Input";
import Button from "../Button";
import "../css/Register.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/update-password`,
        data,
        { withCredentials: true }
      );
      toast.error("Updated Password sucessfully")
      setTimeout(() => {
        navigate("/");
      }, 50);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update password: " + (err.response?.data?.message || ""));
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
      <h2>Update Password</h2>
      <Input
        name="password"
        control={control}
        label="Password"
        type="password"
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Update Password"}
      </Button>
    </form>
  );
};

export default UpdatePassword;
