import {
  Avatar,
  Box,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

import SearchBar from "components/atoms/SearchBar";
import React from "react";

import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import CustomTextInput from "components/atoms/CustomTextInput";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { GET_PATIENT_RECENT_VISIT } from "utils/reactQueryKeys";
import { useParams } from "react-router-dom";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";

import FromOthers from "./FromOthers";
import FromSelf from "./FromSelf";
import { formatAssesmentLog, searchForText } from "./utils";
import moment from "moment";
import { useAuthCtx } from "store/contextStore/auth/AuthStore";

const removeMarksColor = () => {
  const marks = document.querySelectorAll("mark");
  if (marks.length > 0) {
    marks.forEach((el) => {
      el.style.backgroundColor = "transparent";
      el.style.color = "inherit";
    });
  }
};
function AssesmentLog({ visitId, assesmentLogs, showCommentField = true }) {
  const { id } = useParams();
  const authCtx = useAuthCtx();
  const chatContainerRef = React.useRef(null);
  const queryClient = useQueryClient();
  const [comment, setcomment] = React.useState("");
  const [search, setsearch] = React.useState("");
  const [foundElements, setfoundElements] = React.useState([]);
  const [openSnackbar, setopenSnackbar] = React.useState(false);
  const [currentElementPosition, setcurrentElementPosition] = React.useState(0);
  const [logs, setlogs] = React.useState({ dates: [], data: {} });

  React.useEffect(() => {
    if (logs.dates.length) {
      chatContainerRef?.current?.scrollTo({
        top: chatContainerRef?.current?.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [logs]);

  React.useMemo(() => {
    if (assesmentLogs?.length) setlogs(formatAssesmentLog(assesmentLogs));
  }, [assesmentLogs]);

  //patch visit {assesmentlog}
  const { mutate, isLoading } = useCustomMutation(
    {
      url: `/visit/${visitId}`,
      method: "patch",
      data: {
        assessmentLog: [{ note: comment }],
      },
    },
    {
      onSuccess: () => {
        setcomment("");
        queryClient.invalidateQueries([GET_PATIENT_RECENT_VISIT, id]);
        toast.success("Success");
      },

      onError: (error) => {
        if (Array.isArray(error.message)) {
          return error.message.map((msg) => toast.error(msg));
        }

        return toast.error(error.message);
      },
    }
  );

  const nextPosition = () => {
    setcurrentElementPosition((prev) => {
      if (prev + 1 > foundElements.length) return prev;
      const elementToMoveTo = foundElements[prev];

      elementToMoveTo.scrollIntoView({ behavior: "smooth" });
      return prev + 1;
    });
  };
  const prevPosition = () => {
    setcurrentElementPosition((prev) => {
      if (prev < 1) {
        const outer_box_container = document.getElementById(
          "outer_box_container"
        );

        outer_box_container.scrollIntoView({ behavior: "smooth" });
        return prev;
      }
      const elementToMoveTo = foundElements[prev - 1];
      elementToMoveTo.scrollIntoView({ behavior: "smooth" });
      return prev - 1;
    });
  };

  const handleSearch = () => {
    setfoundElements([]);
    removeMarksColor();

    searchForText(setfoundElements, search);

    setopenSnackbar(true);
  };
  const closeSnackbar = () => {
    setfoundElements([]);
    removeMarksColor();
    setsearch("");

    setopenSnackbar(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment) return;
    mutate();
  };

  return (
    <Box id={"outer_box_container"}>
      <Grid container spacing={1} sx={{ marginTop: 2 }}>
        <Grid item xs={12} sm={5}>
          <Typography sx={{ fontSize: "12px" }}>Search</Typography>
          <SearchBar
            search={search}
            setsearch={setsearch}
            refetch={handleSearch}
            width="100%"
          />
          <Snackbar
            open={openSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "left" }}
          >
            <Paper
              sx={{
                backgroundColor: "background.gray4",
                p: 2,
                // color: "primary.custom",
              }}
            >
              <Stack
                direction={"row"}
                justifyContent="space-between"
                minWidth={"27vw"}
                alignItems="center"
              >
                {search}
                <Stack direction={"row"} spacing={1} alignItems="center">
                  {currentElementPosition}/{foundElements.length} |
                  <IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={prevPosition}
                  >
                    <KeyboardArrowUpIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={nextPosition}
                  >
                    <KeyboardArrowDownIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={closeSnackbar}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>{" "}
            </Paper>
          </Snackbar>
        </Grid>
      </Grid>
      <Box
        sx={{
          width: "100%",
          minHeight: "60vh",
          maxHeight: "100vh",
          p: 1,
          mt: 2,
          overflowY: "auto",

          display: "flex",
          flexDirection: "column",
        }}
        ref={chatContainerRef}
      >
        {logs?.dates?.length ? (
          logs.dates.map((date) => (
            <React.Fragment key={date}>
              <Divider>
                <Chip
                  sx={{ fontSize: "11px" }}
                  label={moment(date).format("MMM Do, YY")}
                  variant="outlined"
                />
              </Divider>

              {logs.data[date].map((item) => (
                <React.Fragment key={item._id}>
                  {/* check if its a doctor */}
                  {item.noteBy._id === authCtx?.state?.user?._id ? (
                    <FromSelf item={item} />
                  ) : (
                    <FromOthers item={item} />
                  )}
                </React.Fragment>
              ))}
            </React.Fragment>
          ))
        ) : (
          <Paper sx={{ p: 2 }}>
            <Typography>No data</Typography>
          </Paper>
        )}

        {/* <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // posistion: "absolute",
            mt: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: "10px",
              color: "secondary.main",
            }}
          >
            Dr James; Dr Samson and 3 other comments
          </Typography>
          <ArrowUpwardOutlinedIcon
            sx={{
              color: "secondary.main",
              fontSize: "15px",
              cursor: "pointer",
              ml: 1,
            }}
          />
        </Box> */}
      </Box>
      {showCommentField && (
        <form
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onSubmit={handleSubmit}
        >
          <CustomTextInput
            boxSx={{ width: "100%" }}
            value={comment}
            name="comment"
            handleChange={(e) => setcomment(e.target.value)}
            placeholder="Type a new message"
          />
          <IconButton
            sx={{ ml: 1 }}
            // onClick={mutate}
            disabled={isLoading}
            type="submit"
          >
            <Avatar
              sx={{
                backgroundColor: isLoading
                  ? "background.gray3"
                  : "secondary.main",
              }}
            >
              <SendOutlinedIcon
                sx={{
                  color: isLoading ? "primary.gray" : "white",
                  transform: "rotate(-30deg)",
                }}
              />
            </Avatar>
          </IconButton>
        </form>
      )}
    </Box>
  );
}

export default AssesmentLog;
