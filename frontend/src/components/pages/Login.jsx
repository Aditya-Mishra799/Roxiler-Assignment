import { useForm } from "react-hook-form";
import Input from "../Input";
import Button from "../Button";
import "../css/Register.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

const LoginForm = () => {
  const navigate = useNavigate();
  const { reload } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        data,
        { withCredentials: true }
      );
      reload();
      setTimeout(() => {
        navigate("/");
      }, 50);
    } catch (err) {
      console.error(err);
      toast.error("Failed to login. " + (err.response?.data?.message || ""));
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
      <h2>Login</h2>
      <Input name="email" control={control} label="Email" />
      <Input
        name="password"
        control={control}
        label="Password"
        type="password"
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Login"}
      </Button>
    </form>
  );
};

export default LoginForm;
