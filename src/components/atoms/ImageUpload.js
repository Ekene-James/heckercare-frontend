import { Stack, Typography } from "@mui/material";
import React from "react";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import CustomButton from "./CustomButton";
import { useDropzone } from "react-dropzone";
import { useMemo } from "react";

function ImageUpload({
  onAddImg = () => {},
  blanckImg = "/imgs/blank-profile-picture.png",
  imgTitle = "Profile Picture",
  imgStyle = {},
  disabled = false,
  accept = {},
}) {
  const [imgSrc, setimgSrc] = React.useState(blanckImg);
  useMemo(() => setimgSrc(blanckImg), [blanckImg]);
  const onDrop = React.useCallback((acceptedFiles) => {
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

        resultsFiles.push(newFile);
      };
      reader.readAsDataURL(file);
    });
    resultsFiles.length && onAddImg?.(resultsFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
  });
  return (
    <Stack
      direction={"column"}
      justifyContent="center"
      alignItems={"center"}
      spacing={2}
      sx={{
        width: "fit-content",
        mt: 3,
        mb: 3,
        pointerEvents: disabled ? "none" : "cursor",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {imgTitle && <Typography style={{ opacity: 0.5 }}>{imgTitle}</Typography>}
      <img
        alt="profile_img"
        src={imgSrc}
        style={{
          width: "131px",
          height: "131px",
          objectFit: "contain",
          borderRadius: "50%",
          ...imgStyle,
        }}
      />
      <input accept={accept} {...getInputProps()} />
      <div {...getRootProps()}>
        <CustomButton
          text="Change Photo"
          variant="outlined"
          startIcon={<CameraAltOutlinedIcon />}
        />
      </div>
    </Stack>
  );
}

export default ImageUpload;
