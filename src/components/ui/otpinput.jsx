import React, { useState, useRef } from "react";
import { Input } from "./Input"; // Assuming your custom Input component is in the same directory

const OtpInput = ({ length, onChangeOtp }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      onChangeOtp(newOtp.join(""));

      // Automatically focus on next input
      if (value && index < length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, length);
    const newOtp = paste.split("").map((digit, i) => (i < length ? digit : ""));
    setOtp(newOtp);
    onChangeOtp(newOtp.join(""));
  };

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      {otp.map((value, index) => (
        <Input
          key={index}
          type="text"
          maxLength="1"
          value={value}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          ref={(el) => (inputRefs.current[index] = el)}
          className="text-center" // Optional: center the text in the input
          style={{ width: "40px", height: "40px" }} // Adjust to match your design
        />
      ))}
    </div>
  );
};

Input.displayName = "OtpInput";

export { OtpInput };
