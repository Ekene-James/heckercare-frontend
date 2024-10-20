import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { fromCamelCase } from "utils/handleCamelse";
import { Typography } from "@mui/material";

export default function VitalSignsTable({ data, fromSummary = false }) {
  const [dynamicFieldsHeader, setdynamicFieldsHeader] = React.useState(
    new Set()
  );

  const isEmpty = () => {
    return data.every(
      (d) => !d?.["vitalSigns"] || !Object.keys(d?.["vitalSigns"])?.length
    );
  };

  React.useMemo(() => {
    const fields = new Set();

    if (
      data?.vitalSigns?.length &&
      Object.keys(data?.vitalSigns?.dynamicFields)?.length
    ) {
      data.forEach((d) => {
        Object.keys(d?.vitalSigns?.dynamicFields).forEach((key, i, arr) => {
          fields.add(fromCamelCase(key));
        });
      });
      setdynamicFieldsHeader(fields);
    }
  }, []);

  return (
    <>
      {isEmpty() ? (
        <Paper sx={{ p: 2 }}>
          <Typography>No data</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow
                sx={{ backgroundColor: !fromSummary ? "background.light" : "" }}
              >
                <TableCell sx={{ fontWeight: "bold" }} align="left">
                  Height
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", textWrap: "nowrap" }}
                  align="left"
                >
                  Blood Pressure
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", textWrap: "nowrap" }}
                  align="left"
                >
                  Heart Rate
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="left">
                  Temperature
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", textWrap: "nowrap" }}
                  align="left"
                >
                  Glucose Level
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="left">
                  Weight
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", textWrap: "nowrap" }}
                  align="left"
                >
                  Respiratory Rate
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", textWrap: "nowrap" }}
                  align="left"
                >
                  Urine Output
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", textWrap: "nowrap" }}
                  align="left"
                >
                  Oxygen Saturation
                </TableCell>
                {
                  //for dynamic fields
                  Array.from(dynamicFieldsHeader).map((field) => (
                    <TableCell
                      sx={{ fontWeight: "bold", textWrap: "nowrap" }}
                      align="left"
                      key={field}
                    >
                      {field}
                    </TableCell>
                  ))
                }
              </TableRow>
            </TableHead>

            <TableBody>
              {data?.map((d) =>
                Object.keys(d?.vitalSigns || {}).length ? (
                  <TableRow
                    key={d._id}
                    sx={{ border: 0, borderBottom: "none !important" }}
                    // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      align="left"
                      sx={{ border: 0, borderBottom: "none !important" }}
                    >
                      {d.vitalSigns?.height || "-"}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ border: 0, borderBottom: "none !important" }}
                    >
                      {d.vitalSigns?.systolicBloodPressure || 0}
                      {"/"}
                      {d.vitalSigns?.diastolicBloodPressure || 0}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ border: 0, borderBottom: "none !important" }}
                    >
                      {" "}
                      {d.vitalSigns?.heartRate || "-"}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ border: 0, borderBottom: "none !important" }}
                    >
                      {d.vitalSigns?.temperature || "-"}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ border: 0, borderBottom: "none !important" }}
                    >
                      {d.vitalSigns?.glucose || "-"}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ border: 0, borderBottom: "none !important" }}
                    >
                      {d.vitalSigns?.weight || "-"}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ border: 0, borderBottom: "none !important" }}
                    >
                      {d.vitalSigns?.respiratoryRate || "-"}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ border: 0, borderBottom: "none !important" }}
                    >
                      {d.vitalSigns?.urineOutput || "-"}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ border: 0, borderBottom: "none !important" }}
                    >
                      {d.vitalSigns?.oxygenSaturation || "-"}
                    </TableCell>
                    {
                      // for the dynamic fields, but some of the keys might not be in existence in a particular iteration causing gaps in the table
                      dynamicFieldsHeader.size
                        ? Object.keys(d?.vitalSigns?.dynamicFields || {}).map(
                            (key, i, arr) => (
                              <React.Fragment key={key}>
                                <TableCell
                                  align="left"
                                  sx={{
                                    border: 0,
                                    borderBottom: "none !important",
                                  }}
                                >
                                  {d?.vitalSigns?.dynamicFields[key]}
                                </TableCell>
                                {/* {[
                          ...Array(dynamicFieldsHeader.size - arr?.length),
                        ].map((k, i) => (
                          <TableCell align="left" key={i}>
                            0
                          </TableCell>
                        ))} */}
                              </React.Fragment>
                            )
                          )
                        : null
                    }
                    {/* {dynamicFields.map((field, i) =>
              Object.keys(field).map((key) => (
                <TableCell align="left" key={key}>
                  {field[key]}
                </TableCell>
              ))
            )} */}
                  </TableRow>
                ) : null
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
