import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import moment from "moment";
import CustomModal from "components/atoms/CustomModal";
import TestResultModal from "components/molecules/lab/modalContents/TestResultModal";
import CustomButton from "components/atoms/CustomButton";
import { downloadOnClick } from "utils/exportToExcel";
import ResultDetails from "components/molecules/patient/singlePatient/investigationsSubComponent/ResultDetails";

export default function AccordionInvestigationTable({ data, from }) {
  const modalRef = React.useRef(null);
  const [result, setresult] = React.useState({});
  const toggleModal = (data) => {
    setresult(data);

    modalRef?.current?.handleToggle();
  };

  const handleDownload = (row) => {
    if (row?.resultUrl) {
      downloadOnClick(
        row?.resultUrl,
        `test_result_for_${row?.patient?.firstName}_${row?.patient?.lastName}`
      );
    }
    if (row?.resultUrls?.length) {
      row?.resultUrls.forEach((result, idx) =>
        downloadOnClick(
          result,
          `test_result_for_${row?.patient?.firstName}_${
            row?.patient?.lastName
          }_${idx + 1}_${new Date().getTime()}`
        )
      );
    }
  };

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{ border: "1px solid rgba(0,0,0,0.2)" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "background.light" }}>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Date
              </TableCell>

              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Test By
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Result
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, i) => (
              <TableRow
                key={i}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell component="th" scope="row" align="left">
                  {moment(new Date(row.createdAt)).format("MMMM Do, YYYY")}
                </TableCell>
                <TableCell align="left">{row.doctor.fullName}</TableCell>

                <TableCell align="left">
                  <CustomButton
                    variant="text"
                    text={" View Result"}
                    disabled={!row?.result}
                    sx={{
                      color: "blue",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={toggleModal.bind(null, row)}
                  />
                </TableCell>
                <TableCell align="left">
                  {" "}
                  <CustomButton
                    variant="text"
                    text={"Download"}
                    disabled={!row?.resultUrl && !row?.resultUrls?.length}
                    onClick={handleDownload.bind(null, row)}
                    startIcon={
                      <svg
                        width="17"
                        height="16"
                        viewBox="0 0 17 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14.2988 10V12.6667C14.2988 13.0203 14.1584 13.3594 13.9083 13.6095C13.6583 13.8595 13.3191 14 12.9655 14H3.63216C3.27854 14 2.9394 13.8595 2.68935 13.6095C2.4393 13.3594 2.29883 13.0203 2.29883 12.6667V10"
                          stroke="#020011"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.96533 6.66699L8.29867 10.0003L11.632 6.66699"
                          stroke="#020011"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8.29883 10V2"
                          stroke="#020011"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CustomModal
        ref={modalRef}
        backdropSx={{
          marginTop: "0px !important",
        }}
        childrenContSx={{
          p: 2,
          width: {
            xs: "90%",
            sm: "60vw",
          },
        }}
        t
      >
        <ResultDetails data={result} from={from} />
      </CustomModal>
    </>
  );
}
