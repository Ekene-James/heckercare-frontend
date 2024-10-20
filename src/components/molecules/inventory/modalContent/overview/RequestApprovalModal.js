import { Box, Grid, Stack, Typography } from "@mui/material";
import moment from "moment";
import React from "react";
import PinIcon from "@mui/icons-material/Pin";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PlaceIcon from "@mui/icons-material/Place";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CustomButton from "components/atoms/CustomButton";
import RequestApprovalTable from "components/molecules/tabels/inventory/RequestApprovalTable";
import CustomModal from "components/atoms/CustomModal";
import RequestResponseModal from "./RequestResponseModal";
import CustomSelect from "components/atoms/Select";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { toast } from "react-toastify";
import {
  GET_REQUEST_HISTORY,
  RADIOLOGY_STOCK_HISTORY,
} from "utils/reactQueryKeys";
import { useQueryClient } from "react-query";
import CancelIcon from "@mui/icons-material/Cancel";
import { Details } from "@mui/icons-material";

const Description = ({ name, value, icon }) => {
  return (
    <Stack direction={"row"} spacing={2} alignItems="center">
      <Stack direction={"row"} spacing={0.5} alignItems="center">
        {React.createElement(icon, {
          sx: { opacity: 0.5 },
          size: "small",
        })}
        <Typography opacity={0.5}>{name}:</Typography>
      </Stack>
      <Typography fontWeight={"bold"}>{value}</Typography>
    </Stack>
  );
};
const reasonForDeclineOptions = [
  {
    name: "None",
    value: "NONE",
  },
  {
    name: "Limited Stock",
    value: "LIMITED_STOCK",
  },
  {
    name: "Out Of Stock",
    value: "OUT_OF_STOCK",
  },
  {
    name: "Wrong Order",
    value: "WRONG_ORDER",
  },
  {
    name: "Other",
    value: "OTHER",
  },
];
function RequestApprovalModal({ detail, closeModal }) {
  const queryClient = useQueryClient();
  const modalRef = React.useRef(null);
  const [checkBoxItems, setcheckBoxItems] = React.useState([]);
  const [reasonForDecline, setreasonForDecline] = React.useState("");
  const [showDeclineComponent, setshowDeclineComponent] = React.useState(false);

  //decline request
  const { mutate: declineRequest, isLoading: declineRequestLoading } =
    useCustomMutation(
      {
        url: `/inventory/grant-request/${detail?._id}`,
        method: "post",
        data: {
          approval: "REJECTED",
          reasonForDecline,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries([GET_REQUEST_HISTORY]);
          queryClient.invalidateQueries([RADIOLOGY_STOCK_HISTORY]);
          toast.success("Success");
          closeModal();
        },

        onError: (error) => {
          if (Array.isArray(error.message)) {
            return error.message.map((msg) => toast.error(msg));
          }

          return toast.error(error.message);
        },
      }
    );
  const handleDecline = () => {
    if (!reasonForDecline) {
      return toast.error("Please select reason for declining");
    }
    declineRequest();
  };
  const toggleModal = () => {
    modalRef?.current?.handleToggle();
  };
  return (
    <>
      <Stack spacing={3}>
        <Typography variant="displayMd">Request Approval</Typography>
        <Stack spacing={1}>
          <Box>
            <Typography opacity={0.5}>Requester</Typography>
            <Typography variant="heading" sx={{ textTransform: "capitalize" }}>
              {detail?.createdBy?.fullName}
            </Typography>
          </Box>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <Description
                icon={PinIcon}
                name="Number of Product"
                value={detail?.items?.length}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Description
                icon={MeetingRoomIcon}
                name="Department"
                value={detail.departmentType}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Description
                icon={PlaceIcon}
                name="Location"
                value={detail.departmentType}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Description
                icon={DateRangeIcon}
                name="Date"
                value={moment(detail?.createdAt).format("MMMM Do, YYYY")}
              />
            </Grid>
            {detail?.approval === "REJECTED" ? (
              <Grid item xs={12} sm={6}>
                <Description
                  icon={CancelIcon}
                  name="Reason for decline"
                  value={detail?.reasonForDecline}
                />
              </Grid>
            ) : null}
          </Grid>
        </Stack>

        <Stack spacing={1.5}>
          <Stack
            direction={"row"}
            width={"100%"}
            alignItems="center"
            justifyContent={"space-between"}
          >
            <Typography variant="heading">List</Typography>
            <Stack direction={"row"} spacing={1} alignItems="center">
              <Typography color={"secondary.main"}>
                {checkBoxItems.length} selected
              </Typography>
              <CustomButton
                text="Grant Selected"
                variant="custom"
                rgb={"0, 132, 53"}
                onClick={toggleModal}
                disabled={
                  !checkBoxItems.length ||
                  detail.approval === "APPROVED" ||
                  detail.approval === "FULFILLED" ||
                  detail.approval === "REJECTED"
                }
              />
              <CustomButton
                text="Decline All"
                variant="custom"
                rgb={"219, 30, 54"}
                onClick={() => setshowDeclineComponent(true)}
                disabled={
                  detail.approval === "APPROVED" ||
                  detail.approval === "FULFILLED" ||
                  detail.approval === "REJECTED"
                }
              />
            </Stack>
          </Stack>
          {showDeclineComponent ? (
            <Stack spacing={1} width={{ xs: "100%", sm: "50%" }}>
              <CustomSelect
                options={reasonForDeclineOptions}
                label="Reason For Decline"
                state={reasonForDecline}
                handleChange={(e) => setreasonForDecline(e.target.value)}
                name="reasonForDecline"
                haveTopLabel={true}
                placeholder="Select reason"
              />
              <Stack direction={"row"} spacing={1}>
                <CustomButton
                  text="Decline"
                  color="error"
                  onClick={handleDecline}
                  disabled={declineRequestLoading}
                />
                <CustomButton
                  text="Cancel"
                  variant="containedBrown"
                  onClick={() => setshowDeclineComponent(false)}
                />
              </Stack>
            </Stack>
          ) : (
            <RequestApprovalTable
              data={detail?.items}
              checkBoxItems={checkBoxItems}
              setcheckBoxItems={setcheckBoxItems}
              toggleModal={toggleModal}
            />
          )}
        </Stack>
      </Stack>

      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
          pt: 5,
          width: {
            xs: "95%",
            sm: "50vw",
          },
        }}
      >
        <RequestResponseModal
          data={checkBoxItems}
          requesDetail={detail}
          closeModal={() => modalRef?.current?.handleToggle()}
        />
      </CustomModal>
    </>
  );
}

export default RequestApprovalModal;
