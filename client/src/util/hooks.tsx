import { useState } from 'react';

export const useForm = (
  callback: { (): void; (): void; (): void },
  initialState = {}
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
