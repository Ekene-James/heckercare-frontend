import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Stack, Typography } from "@mui/material";
import CustomButton from "./CustomButton";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";

function UploadBoardWithOverlay({ onAddImg, apiImg = null }) {
  const [imgSrc, setimgSrc] = useState(apiImg);
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
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
  });
  return (
    <Stack sx={{ p: 1 }} spacing={1} {...getRootProps()}>
      <input {...getInputProps()} />

      <Stack
        justifyContent="center"
        alignItems={"center"}
        sx={{
          width: { xs: "100%", sm: "302px" },
          height: "178px",
          border: !imgSrc ? "1px dotted rgba(0,0,0,1)" : null,
          borderRadius: !imgSrc ? "10px" : 0,
          display: "flex",
          position: "relative",
          p: 0,
        }}
        spacing={1}
      >
        {imgSrc && (
          <img
            alt="upload_img"
            src={imgSrc}
            style={{
              width: "100%",
              height: "100%",
              // objectFit: "contain",
              // position: "absolute",
            }}
          />
        )}
        {imgSrc && (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              position: "absolute",
              background: "rgba(0,0,0,0.8)",

              m: "0px!important",
              p: "0px!important",
            }}
          />
        )}
        <Stack
          direction={"column"}
          sx={{ position: "absolute", p: { xs: 2, sm: 6 } }}
          spacing={1}
        >
          {isDragActive ? (
            <Typography>Drop the files here ...</Typography>
          ) : (
            <>
              <CustomButton
                startIcon={
                  <CameraAltOutlinedIcon
                    sx={{
                      color: imgSrc ? "primary.lightest" : "primary.main",
                    }}
                  />
                }
                onClick={open}
                sx={{
                  fontSize: "16px",
                  color: imgSrc ? "primary.lightest" : "primary.darkGrey",

                  borderColor: imgSrc ? "primary.lightest" : "primary.main",
                  backgroundColor: imgSrc ? null : "background.custom",
                }}
                variant={imgSrc ? "outlined" : "containedBrown"}
                text={imgSrc ? "Change Photo" : "Click to Upload"}
              />

              <Typography sx={{ opacity: 0.5 }}>
                {!imgSrc
                  ? "Upload JPEG, JPG, PNG format only , Not greater than 10mb"
                  : null}
              </Typography>
            </>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}

export default UploadBoardWithOverlay;
