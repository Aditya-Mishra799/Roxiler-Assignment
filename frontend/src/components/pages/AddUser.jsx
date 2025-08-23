import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "../../schemas/userValidation";
import Input from "../Input";
import TextArea from "../TextArea";
import Button from "../Button";
import "../css/Register.css";
import axios from "axios";
import Select from "../Select";
import { toast } from "react-hot-toast";

const AddUser = () => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset
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
        `${import.meta.env.VITE_API_BASE_URL}/admin/add-user`,
        data,
        {withCredentials: true}
      );
      toast.success("User added successfully!");
      reset()
    } catch (err) {
      console.error(err);
      toast.error("Failed to add user: " + (err.response?.data?.message || ""));
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
      <h2>Add User</h2>
      <Input name="name" control={control} label="Full Name" />
      <Input name="email" control={control} label="Email" />
      <Input
        name="password"
        control={control}
        label="Password"
        type="password"
      />
      <Select
        name="role"
        control={control}
        label="Role"
        options={[
          { label: "Admin", value: "admin" },
          { label: "User", value: "user" },
        ]}
      />
      <TextArea name="address" control={control} label="Address" rows={4} />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Add User"}
      </Button>
    </form>
  );
};

export default AddUser;
