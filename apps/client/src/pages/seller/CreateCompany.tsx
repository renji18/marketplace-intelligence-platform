import { useState } from "react";
import Button from "@/ui/Button";
import AuthInput from "@/components/auth/AuthInput";
import { useDispatch } from "react-redux";
import { type MyDispatch } from "@/redux/store";
import { useNavigate } from "react-router-dom";
import { createCompany } from "@/redux/slice/company/asyncFn";

const CreateCompany = () => {
  const dispatch = useDispatch<MyDispatch>();
  const navigate = useNavigate();

  const [name, setName] = useState("");

  const onSubmit = () => {
    dispatch(createCompany({ name: name?.trim(), navigate }));
  };

  return (
    <div className="h-screen flex items-center justify-center bg-accent/50">
      <div className="max-w-md mx-auto bg-white p-6 rounded-md border shadow-sm">
        <h1 className="text-xl font-semibold text-secondary-1">
          Register your company
        </h1>
        <p className="text-sm text-gray mt-1 mb-6">
          You need a company to start selling on the platform.
        </p>

        <AuthInput
          id="name"
          label="Company name"
          placeholder="Acme Pvt Ltd"
          value={name}
          setData={(value) => setName(value)}
        />

        <Button
          text="Create company"
          className="w-full mt-6"
          disabled={!name.trim()}
          onClick={() => onSubmit()}
        />
      </div>
    </div>
  );
};

export default CreateCompany;
