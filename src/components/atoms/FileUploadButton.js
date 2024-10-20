import React, { useRef } from "react";

const FileUploadButton = ({
  btnText,
  onFileChange,
  CustomButton,
  accept = "image/*",
  multiple = false,
}) => {
  // Create a ref to the file input element
  const fileInputRef = useRef(null);

  // Function to handle button click and trigger file input click
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Function to handle file input change (optional)
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    onFileChange(multiple ? event.target.files : file);
  };

  return (
    <div>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept={accept}
        multiple={multiple}
      />
      {/* Button to trigger file input click */}
      {React.cloneElement(CustomButton, { onClick: handleButtonClick })}
    </div>
  );
};

export default FileUploadButton;
