import React, { InputHTMLAttributes, ReactNode, useId } from "react";

export default ({
  label,
  hint,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  label: ReactNode;
  hint?: ReactNode;
}) => {
  const inputId = useId();

  return (
    <div>
      <label htmlFor={inputId}>{label}</label>
      <input id={inputId} {...props} />
      <span>{hint}</span>
    </div>
  );
};
