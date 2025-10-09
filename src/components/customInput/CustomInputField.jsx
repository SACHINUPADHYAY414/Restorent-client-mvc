import React, { useRef, useState } from "react";
import TooltipWrapper from "../Tooltip/TooltipWrapper";
import { RiInformation2Line } from "react-icons/ri";
import { AiTwotoneEye, AiTwotoneEyeInvisible } from "react-icons/ai";
import { FaCheck } from "react-icons/fa6";

const CustomInputField = ({
  id,
  name,
  type,
  placeholder,
  value,
  error,
  onChange,
  onBlur,
  onPaste,
  disabled,
  readOnly,
  maxLength,
  minLength,
  options = []
}) => {
  const inputRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const hasError = Boolean(error);
  const isValid = !hasError && value;

  const eyestyle = {
    fontSize: "18px",
    transition: "color 0.3s ease-in-out",
    position: "absolute",
    right: "1.4rem",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#d35400"
  };

  const commonStyle = {
    width: "100%",
    padding: "8px",
    borderRadius: "5px",
    border: hasError ? "1.5px solid red" : "1px solid #ccc",
    fontSize: "1rem",
    boxSizing: "border-box",
    backgroundColor: "transparent"
  };

  if (type === "select") {
    return (
      <div style={{ position: "relative" }}>
        <select
          id={id}
          name={name}
          value={value || ""}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          style={{
            ...commonStyle,
            paddingRight: "2rem"
          }}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option
              key={option.id ?? option.value}
              value={option.id ?? option.value}
            >
              {option.name ?? option.label}
            </option>
          ))}
        </select>

        {hasError && (
          <TooltipWrapper tooltipMessage={error}>
            <span
              style={{
                position: "absolute",
                right: "1.4rem",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "red"
              }}
            >
              <RiInformation2Line />
            </span>
          </TooltipWrapper>
        )}

        {isValid && (
          <span
            style={{
              position: "absolute",
              right: "1.4rem",
              top: "44%",
              transform: "translateY(-50%)",
              color: "green"
            }}
          >
            <FaCheck />
          </span>
        )}
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <input
        ref={inputRef}
        id={id}
        name={name}
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        placeholder={placeholder}
        value={value || ""}
        onChange={onChange}
        onBlur={onBlur}
        onPaste={onPaste}
        disabled={disabled}
        readOnly={readOnly}
        maxLength={maxLength}
        minLength={minLength}
        style={{
          ...commonStyle,
          paddingRight: type === "password" ? "4.5rem" : "1.8rem"
        }}
      />

      {type === "password" && (
        <span
          style={eyestyle}
          onClick={togglePasswordVisibility}
          aria-label="Toggle password visibility"
          role="button"
          className="me-1 pb-1 text-secondary"
          tabIndex={0}
        >
          {showPassword ? (
            <AiTwotoneEyeInvisible size={20} />
          ) : (
            <AiTwotoneEye size={20} />
          )}
        </span>
      )}

      {hasError && (
        <TooltipWrapper tooltipMessage={error}>
          <span
            style={{
              position: "absolute",
              right: type === "password" ? "0.5rem" : "0.8rem",
              top: "46%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "red"
            }}
          >
            <RiInformation2Line />
          </span>
        </TooltipWrapper>
      )}

      {isValid && (
        <span
          style={{
            position: "absolute",
            right: type === "password" ? "0.5rem" : "0.8rem",
            top: "40%",
            transform: "translateY(-50%)",
            color: "green"
          }}
        >
          <FaCheck />
        </span>
      )}
    </div>
  );
};

export default CustomInputField;
