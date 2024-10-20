import { Divider, Paper, Stack, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import DnsIcon from "@mui/icons-material/Dns";
import CustomButton from "components/atoms/CustomButton";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import UploadIcon from "@mui/icons-material/Upload";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import moment from "moment";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { useQueryClient } from "react-query";
import { GET_RADIOLOGY_TEST_INFO, GET_TEST_INFO } from "utils/reactQueryKeys";
import { toast } from "react-toastify";

import { baseURL } from "utils/axios-utils";
import CustomModal from "components/atoms/CustomModal";

function TestDescription({ item, handleOpenModal }) {
  const [qrImg, setqrImg] = useState("");
  const queryClient = useQueryClient();
  const modalRef = React.useRef(null);

  const toggleModal = (base64Img) => {
    setqrImg(base64Img);
    modalRef?.current?.handleToggle();
  };
  //start test

  const { mutate: startTest, isLoading } = useCustomMutation(
    {
      url: `/radiology/start-test/${item._id}`,
      method: "patch",
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(GET_RADIOLOGY_TEST_INFO);
        toast.success("Test Started Successfully");
      },

      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  //generate and downlod qr code
  const { mutate: getGenerateQr, isLoading: qrLoading } = useCustomMutation(
    {
      url: `${baseURL}/investigation/get-patient-investigations/${item?.patient?.id}/qrcode?departmentType=RADIOLOGY`,
      method: "get",
    },
    {
      onSuccess: (res) => {
        toggleModal(res.data);
      },

      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
  let btn;
  if (item.status === "ONGOING") {
    btn = (
      <Stack
        direction={"row"}
        spacing={1}
        justifyContent="center"
        alignItems={"center"}
      >
        <CustomButton
          text={"Input Data"}
          variant="outlined"
          color="error"
          startIcon={<UploadIcon />}
          sx={{ fontSize: "0.55rem" }}
          onClick={handleOpenModal?.bind(this, 2, item)}
        />

        <AccessTimeIcon sx={{ color: "red", fontSize: "1rem" }} />
      </Stack>
    );
  } else {
    btn = (
      <CustomButton
        text={"Start Test"}
        variant="contained"
        color="success"
        onClick={startTest}
        disabled={isLoading}
      />
    );
  }

  const generateQr = () => {
    getGenerateQr();
  };
  const handlePrint = useCallback(() => {
    const win = window.open("", "", "height=700,width=700"); // Open the window. Its a popup window.

    //create an img tag
    let img = document.createElement("img");
    img.onload = () => {
      win.document.write(img.outerHTML);
      win.print();
    };

    img.src = qrImg;
    img.style["height"] = "300px";
    img.style["width"] = "300px";
  }, [qrImg]);

  return (
    <>
      <Paper sx={{ p: 2, width: "100%" }}>
        <Stack direction={"column"} spacing={1}>
          <Stack
            direction={"row"}
            spacing={1}
            justifyContent="space-between"
            alignItems={"center"}
            sx={{ width: "100%" }}
          >
            <Typography variant="small" sx={{ opacity: "0.7" }}>
              {item?.patient?.age}/{item?.patient?.gender}
            </Typography>
            <Typography variant="small" sx={{ opacity: "0.7" }}>
              {moment(new Date(item?.createdAt)).format("Do, MMMM YYYY")}
            </Typography>
          </Stack>
          <Typography variant="heading" sx={{ textTransform: "capitalize" }}>
            {`${item?.patient?.firstName} ${item?.patient?.lastName}`}
          </Typography>
          <Stack
            direction={"row"}
            spacing={1}
            justifyContent="space-between"
            alignItems={"center"}
          >
            <Stack
              direction={"row"}
              spacing={1}
              justifyContent="flex-start"
              alignItems={"center"}
              sx={{ opacity: "0.8" }}
            >
              <DnsIcon /> {item?.patient?.ID}
            </Stack>
            <CustomButton
              text={"Generate QR"}
              variant="lightSecondary"
              color="secondary"
              onClick={generateQr}
              disabled={qrLoading}
            />
          </Stack>
          <Divider />
          <Stack
            direction={"row"}
            spacing={1}
            justifyContent="space-between"
            alignItems={"center"}
            sx={{ width: "100%" }}
          >
            <CustomButton
              startIcon={<StickyNote2Icon />}
              text="View Note"
              variant="text"
              sx={{
                opacity: "0.8",
              }}
              onClick={handleOpenModal?.bind(null, 1, item)}
            />
            {btn}
          </Stack>
        </Stack>
      </Paper>
      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,

          height: "fit-content !important",
          minWidth: "30vw !important",
        }}
      >
        <Stack direction={"column"} alignItems={"center"} gap={2}>
          <Stack direction={"column"} alignItems={"center"} gap={0.5}>
            <Typography variant="h6">
              Generated QR for {item?.patient?.firstName}{" "}
              {item?.patient?.lastName}{" "}
            </Typography>
            <Typography variant="h6">
              Test Name: {item?.test?.testName}{" "}
            </Typography>
          </Stack>
          <img
            alt="qr-code-img"
            src={qrImg}
            width={200}
            height="200"
            style={{
              objectFit: "contain",
              objectPosition: "center",
            }}
          />
          <CustomButton
            text={"Print"}
            variant="containedBrown"
            sx={{ alignSelf: "end" }}
            onClick={handlePrint}
          />
        </Stack>
      </CustomModal>
    </>
  );
}

export default TestDescription;
