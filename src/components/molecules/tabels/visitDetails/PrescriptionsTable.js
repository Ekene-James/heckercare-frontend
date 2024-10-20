import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Chip, Grid, Stack, Typography } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { v4 as uuidv4 } from "uuid";
import CustomModal from "components/atoms/CustomModal";
import CustomTextInput from "components/atoms/CustomTextInput";
import CustomMenu from "components/atoms/CustomMenu";
import CsvDownloader from "react-csv-downloader";
import { exportToExcel } from "utils/exportToExcel";

const columns = [
  {
    id: "_id",
    displayName: "id",
  },
  {
    id: "amount",
    displayName: "amount",
  },
  {
    id: "createdAt",
    displayName: "createdAt",
  },
  {
    id: "duration",
    displayName: "duration",
  },
  {
    id: "foodRelation",
    displayName: "foodRelation",
  },
  {
    id: "frequency",
    displayName: "frequency",
  },
  {
    id: "notes",
    displayName: "notes",
  },
  {
    id: "routeOfAdmin",
    displayName: "routeOfAdmin",
  },
  {
    id: "status",
    displayName: "status",
  },
  {
    id: "uniqueCode",
    displayName: "uniqueCode",
  },
  {
    id: "doctor",
    displayName: "doctor",
  },
  {
    id: "drugName",
    displayName: "drugName",
  },
  {
    id: "brandName",
    displayName: "brandName",
  },
];

const formatExportData = (data) => {
  const copy = structuredClone(data);
  const formartedData = {
    ...copy,
    doctor: data.doctor.fullName,
    drugName: data.product.drugName,
    brandName: data.product.brandName,
  };
  delete formartedData.items;
  delete formartedData.patient;
  delete formartedData.id;
  delete formartedData.product;

  return [formartedData];
};

const Row = ({ row, toggleModal, fromSummary = false }) => {
  const handleExport = (item) => {
    if (item.name === "Excel") {
      exportToExcel(formatExportData(row), `prescription_${row.uniqueCode}`);
    }
  };
  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell component="th" scope="row" align="left">
        {row?.product?.drugName}
      </TableCell>
      <TableCell align="left">{row?.product?.brandName}</TableCell>
      <TableCell align="left">{row?.doctor?.fullName}</TableCell>

      <TableCell align="left">
        <Button
          variant="text"
          color="secondary"
          sx={{ textDecoration: "underline", fontSize: "12px" }}
          onClick={() => toggleModal(row)}
        >
          View
        </Button>
      </TableCell>
      <TableCell align="left">
        {!fromSummary && (
          <CustomMenu
            caption="Export"
            icon={<PrintIcon />}
            onClickItem={handleExport}
            popperSx={{ width: "12%" }}
            items={[
              {
                name: (
                  <CsvDownloader
                    filename={`prescription_${row.uniqueCode}`}
                    extension=".csv"
                    columns={columns}
                    datas={formatExportData(row)}
                    style={{ width: "100%" }}
                  >
                    <Typography>CSV</Typography>
                  </CsvDownloader>
                ),
              },
              {
                name: "Excel",
              },
            ]}
          />
        )}
      </TableCell>
    </TableRow>
  );
};

export default function PrescriptionTable({ data, fromSummary }) {
  const modalRef = React.useRef(null);
  const [modalContent, setmodalContent] = React.useState({});

  const toggleModal = (item) => {
    setmodalContent(item);
    modalRef?.current?.handleToggle();
  };

  const isEmpty = () => {
    return data.every(
      (d) => !d?.["prescription"] || !d?.["prescription"]?.length
    );
  };
  const formattedData = data.filter(
    (d) => d?.["prescription"] && d?.["prescription"]?.length
  );

  return (
    <>
      {isEmpty() ? (
        <Paper sx={{ p: 2 }}>
          <Typography>No data</Typography>
        </Paper>
      ) : fromSummary ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "background.light" }}>
                <TableCell sx={{ fontWeight: "bold" }} align="left">
                  Drug Name
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="left">
                  Brand Name
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="left">
                  Doctor
                </TableCell>

                <TableCell sx={{ fontWeight: "bold" }} align="left">
                  Action
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="left" />
              </TableRow>
            </TableHead>
            <TableBody>
              {formattedData?.map((d) =>
                d?.prescription?.map((pres) =>
                  pres.items?.map((row) => (
                    <Row
                      key={uuidv4()}
                      row={{ ...row, ...pres }}
                      toggleModal={toggleModal}
                      fromSummary={fromSummary}
                    />
                  ))
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        data.map((table) =>
          table.prescription.length
            ? table.prescription.map((pres) => (
                <React.Fragment key={pres._id}>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow sx={{ backgroundColor: "background.light" }}>
                          <TableCell sx={{ fontWeight: "bold" }} align="left">
                            Drug Name
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }} align="left">
                            Brand Name
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }} align="left">
                            Doctor
                          </TableCell>

                          <TableCell sx={{ fontWeight: "bold" }} align="left">
                            Action
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }} align="left" />
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {pres.items.map((row) => (
                          <Row
                            key={uuidv4()}
                            row={{ ...row, ...pres }}
                            toggleModal={toggleModal}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </React.Fragment>
              ))
            : null
        )
      )}

      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
          height: "fit-content !important",
          width: "50vw !important",
        }}
      >
        <Stack space={2}>
          <Typography variant="h4">Prescription</Typography>
          <Grid container spacing={1} p={3}>
            <Grid item xs={12} sm={6}>
              <CustomTextInput
                title="Amount"
                value={modalContent?.amount}
                disabled="true"
                readOnly={true}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextInput
                title="Duration"
                value={modalContent?.duration}
                disabled="true"
                readOnly={true}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextInput
                title="Food Relation"
                value={modalContent?.foodRelation}
                disabled="true"
                readOnly={true}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextInput
                title="Frequency"
                value={modalContent?.frequency}
                disabled="true"
                readOnly={true}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextInput
                title="Route Of Admin"
                value={modalContent?.routeOfAdmin}
                disabled="true"
                readOnly={true}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextInput
                title="Notes"
                value={modalContent?.notes}
                disabled="true"
                readOnly={true}
                multiline
              />
            </Grid>
          </Grid>
        </Stack>
      </CustomModal>
    </>
  );
}
