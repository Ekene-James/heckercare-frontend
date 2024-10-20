import { Box, Chip, Stack, Typography } from "@mui/material";
import DraftsIcon from "@mui/icons-material/Drafts";
import React from "react";
import Pagination from "components/molecules/pagination/Pagination";
import CustomModal from "components/atoms/CustomModal";
import EmailIcon from "@mui/icons-material/Email";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import {
  GET_NOTIFICATIONS,
  GET_NOTIFICATIONS_COUNT,
  MARK_AS_READ,
} from "utils/reactQueryKeys";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";

function NotificationModal({ data, handlePageChange, page, count }) {
  const modalRef = React.useRef(null);
  const queryClient = useQueryClient();
  const [notificationDetail, setnotificationDetail] = React.useState({});

  //mark all as read
  const { mutate: markAllAsRead, isLoading } = useCustomMutation(
    {
      url: `/notification/mobile/read-all`,
      method: "patch",
    },

    {
      onSuccess: () => {
        queryClient.invalidateQueries([GET_NOTIFICATIONS]);
        queryClient.invalidateQueries([GET_NOTIFICATIONS_COUNT]);
      },
      onError: (error) => {
        if (Array.isArray(error.message)) {
          return error.message.map((msg) => toast.error(msg));
        }
        return toast.error(error.message);
      },
    }
  );

  //mark as read.
  const markAsRead = useCustomQuery(
    [MARK_AS_READ, notificationDetail?._id],
    {
      url: `/notification/mobile/read/${notificationDetail?._id}`,
      method: "patch",
    },
    {
      refetchOnWindowFocus: false,
      enabled:
        Object.keys(notificationDetail).length > 0 &&
        notificationDetail.read === false,
      onSuccess: () => {
        queryClient.invalidateQueries([GET_NOTIFICATIONS]);
        queryClient.invalidateQueries([GET_NOTIFICATIONS_COUNT]);
      },
    }
  );

  const handleView = (detail) => {
    setnotificationDetail(detail);

    modalRef?.current?.handleToggle();
  };

  return (
    <>
      <Stack spacing={2}>
        <Stack
          alignItems={"center"}
          justifyContent="flex-end"
          direction="row"
          width={"100%"}
        >
          <Chip
            label="Mark All As Read"
            onClick={markAllAsRead}
            color="secondary"
            variant="outlined"
            icon={<DraftsIcon />}
            disabled={isLoading || !data.length}
          />
        </Stack>
        {data.length ? (
          data.map((d) => (
            <Stack
              justifyContent={"space-between"}
              width="100%"
              key={d._id}
              direction="row"
              alignItems={"center"}
            >
              <Stack spacing={3} direction="row" alignItems={"center"}>
                <Stack>
                  {/* <Typography
                    variant="small"
                    sx={{ fontWeight: d.read ? "400" : "bold" }}
                  >
                    Notification Title
                  </Typography> */}
                  <Typography
                    variant="heading"
                    sx={{ fontWeight: d.read ? "400" : "bold" }}
                  >
                    {d.title}
                  </Typography>
                  <Typography
                    variant="small"
                    sx={{
                      fontWeight: d.read ? "400" : "bold",
                      width: {
                        xs: "90%",
                      },
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {d?.message}
                  </Typography>
                </Stack>
              </Stack>
              {
                <Chip
                  label="Read"
                  onClick={handleView.bind(null, d)}
                  color={d.read ? "primary" : "secondary"}
                  variant="outlined"
                  icon={
                    d.read ? (
                      <DraftsIcon sx={{ fontSize: "13px !important" }} />
                    ) : (
                      <EmailIcon sx={{ fontSize: "13px !important" }} />
                    )
                  }
                  size="small"
                  sx={{ fontSize: "0.7rem", opacity: d.read ? 0.6 : 1 }}
                />
              }
            </Stack>
          ))
        ) : (
          <Typography variant="displaySm">No Notification</Typography>
        )}

        <Pagination
          currentPage={page}
          totalCount={count || 10}
          pageSize={10}
          activeColor="secondary.main"
          onPageChange={handlePageChange}
          displayShowResults={false}
        />
      </Stack>
      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
          pt: 5,
          height: "fit-content !important",
          minWidth: "30vw !important",
          minHeight: "25vh",
        }}
        cleanUp={() => setnotificationDetail({})}
      >
        <Stack spacing={2}>
          <Typography variant="displaySm">Notification Message: </Typography>
          <Typography>{notificationDetail?.message}</Typography>
        </Stack>
      </CustomModal>
    </>
  );
}

export default NotificationModal;
