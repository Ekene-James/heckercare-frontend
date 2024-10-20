import React, { forwardRef } from "react";

const InputWithAdornment = forwardRef(
  (
    {
      className,
      onChange,
      name,
      id,
      type,
      placeholder,
      error,
      value,
      left,
      right,
      style,
      ...rest
    },
    ref
  ) => {
    return (
      <div
        style={{ display: "flex", flexDirection: "column" }}
        className={className}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderRadius: "4px",
            border: "1px solid #EDEDED",
            height: "50px",
            "&:hover": {
              border: "1px solid #222",
            },
            ...style,
          }}
        >
          {left}
          <input
            ref={ref}
            id={id}
            name={name}
            placeholder={placeholder}
            type={type || "text"}
            value={value}
            onChange={onChange}
            style={{
              height: "100%",
              border: "none",
              margin: "0 8px",
              flexGrow: 1,
              outline: "none",
            }}
            {...rest}
          />
          {right}
        </div>
        {error && <small style={{ color: "rgba(255,0,0,0.6)" }}>{error}</small>}
      </div>
    );
  }
);

export default InputWithAdornment;
