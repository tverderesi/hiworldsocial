import { useState, SyntheticEvent } from "react";

export const useForm = (
  callback: { (): void; (): void; (): void },
  initialState: any = {}
) => {
  const [values, setValues] = useState(initialState);

  const onChange = (e: any) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    callback();
  };
  return {
    onChange,
    onSubmit,
    values,
  };
};

export const useDisplayProfile = (initialState, callback = () => {}) => {
  const [showProfile, setShowProfile] = useState(initialState);

  const onClick = (e: SyntheticEvent) => {
    e.preventDefault();
    setShowProfile(!showProfile);
    callback();
  };

  return {
    onClick,
    showProfile,
    setShowProfile,
  };
};
