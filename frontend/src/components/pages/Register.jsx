import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "../../schemas/userValidation"; // <-- your schema file
import Input from "../Input"
import TextArea from "../TextArea";
import Button from "../Button";
import "./Register.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
      address: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
        data
      );
      alert("User registered successfully! Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Failed to register. " + (err.response?.data?.message || ""));
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
      <h2>Register</h2>

      <Input name="name" control={control} label="Full Name" />
      <Input name="email" control={control} label="Email" />
      <Input name="password" control={control} label="Password" type="password" />

      <TextArea name="address" control={control} label="Address" rows={4} />

      <Button type="submit"  disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Register"}
      </Button>
    </form>
  );
};

export default RegisterForm;
