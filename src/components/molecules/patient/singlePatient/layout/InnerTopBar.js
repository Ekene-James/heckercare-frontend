import { Button, IconButton, Paper } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CreateIcon from "@mui/icons-material/Create";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import {
  GET_ALL_PENDING_TRANSACTIONS,
  GET_PATIENT,
  GET_PATIENTS_DISCHARGE_LIST,
} from "utils/reactQueryKeys";
import { useParams } from "react-router-dom";
import CustomModal from "components/atoms/CustomModal";
import AdmitPatientModal from "../AdmitPatientModal";

function InnerTopBar({ showDischargeBtn = true, status = "", editBtn }) {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const modalRef = React.useRef(null);

  const patient = queryClient.getQueryData([GET_PATIENT, id]);

  //discharge patient

  const { mutate: dischargePatient, isLoading: dischargePatientLoading } =
    useCustomMutation(
      {
        url: `/wards/discharge-patient-from-ward/${patient?.data?.ward}`,
        method: "patch",
        data: {
          date: new Date(),
          patientId: patient?.data._id,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries([GET_ALL_PENDING_TRANSACTIONS]);
          queryClient.invalidateQueries([GET_PATIENT, id]);
          queryClient.invalidateQueries([GET_PATIENTS_DISCHARGE_LIST]);

          toast.success("Success");
        },

        onError: (error) => toast.error(error.message),
      }
    );

  const toggleModal = () => {
    modalRef?.current?.handleToggle();
  };
  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Paper
          sx={{
            padding: 1,
            display: "flex",
            justifyContent: { xs: "center", sm: "flex-end" },
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",

              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <DateRangeIcon sx={{ fontSize: "15px" }} />
            <div
              style={{
                margin: "0px 4px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "11px",
              }}
            >
              <p>Current Status:</p>
              <strong>{status}</strong>
            </div>

            {showDischargeBtn &&
              (status === "admitted" ? (
                <Button
                  size="small"
                  variant="contained"
                  sx={{ fontSize: "11px" }}
                  onClick={dischargePatient}
                  disabled={dischargePatientLoading || !patient?.data?.ward}
                >
                  Discharge
                </Button>
              ) : status === "emergency" ? (
                <>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{ fontSize: "11px", mr: 1 }}
                    onClick={dischargePatient}
                    disabled={dischargePatientLoading || !patient?.data?.ward}
                  >
                    Discharge
                  </Button>

                  <Button
                    size="small"
                    variant="contained"
                    sx={{ fontSize: "11px" }}
                    onClick={toggleModal}
                  >
                    Admit
                  </Button>
                </>
              ) : (
                <Button
                  size="small"
                  variant="contained"
                  sx={{ fontSize: "11px" }}
                  onClick={toggleModal}
                >
                  Admit
                </Button>
              ))}
            {editBtn}
          </Box>
        </Paper>
      </Box>
      {showDischargeBtn && (
        <CustomModal
          ref={modalRef}
          childrenContSx={{
            p: 3,
            pt: 5,
            width: {
              xs: "100%",
              sm: "50vw",
            },
          }}
          ariaLabel="modal"
        >
          <AdmitPatientModal onClose={toggleModal} />
        </CustomModal>
      )}
    </>
  );
}

export default InnerTopBar;
