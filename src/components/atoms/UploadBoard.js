import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Stack, Typography } from "@mui/material";

function UploadBoard({ title, title1, onAddImg }) {
  const [imgSrc, setimgSrc] = useState("/imgs/Vector.png");
  const [imgName, setimgName] = useState("");
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    onAddImg(acceptedFiles);
    const resultsFiles = [];
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        const binaryStr = reader.result;

        setimgSrc(binaryStr);
        const newFile = { file: file, b64: binaryStr };
        setimgName(file.name);
        resultsFiles.push(newFile);
      };
      reader.readAsDataURL(file);
    });
    resultsFiles.length && onAddImg?.(resultsFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <Stack sx={{ p: 1 }} direction={"column"} spacing={1} {...getRootProps()}>
      <input {...getInputProps()} />
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
        <Typography>{title}</Typography>
        <Typography sx={{ opacity: 0.7 }}>{title1}</Typography>
      </Stack>
      <Stack
        direction={"row"}
        justifyContent="center"
        alignItems={"center"}
        sx={{
          width: "100%",
          height: "112px",
          border: "4px solid whitesmoke",
          borderRadius: "10px",
          backgroundColor: "background.gray3",
        }}
        spacing={1}
      >
        <img
          alt="upload_img"
          src={imgSrc}
          height={50}
          width={50}
          style={{ width: "50px", height: "50px", objectFit: "contain" }}
        />

        <Stack direction={"column"} spacing={1}>
          <Typography variant="small">{imgName}</Typography>

          {isDragActive ? (
            <Typography>Drop the files here ...</Typography>
          ) : (
            <Typography sx={{ cursor: "pointer", color: "secondary.main" }}>
              {imgName
                ? "Click / Drag to Select Another"
                : "Drag or Drop your image here, or browse"}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}

export default UploadBoard;
