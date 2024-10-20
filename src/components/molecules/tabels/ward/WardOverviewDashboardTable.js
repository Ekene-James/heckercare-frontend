import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { useNavigate } from "react-router-dom";
import CustomDotMenu from "components/atoms/CustomDotMenu";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import { Typography } from "@mui/material";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { toast } from "react-toastify";
import { DELETE_WARD } from "utils/reactQueryKeys";

const Row = ({ row, i, handleEditWardDetails, refetchWardOverview }) => {
  const navigate = useNavigate();

  const { refetch: handleDeleteWard } = useCustomQuery(
    [DELETE_WARD, row._id],
    {
      url: `/wards/delete-ward/${row._id}`,
      method: "delete",
    },
    {
      enabled: false,
      onSuccess: () => {
        refetchWardOverview();
        toast.success("deleted Successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const handleViewDetails = () => {
    navigate(`/home/department/ward/${row.id}`);
  };
  let usedBeds = 0;
  if (row.usedBeds) usedBeds = row.usedBeds;
  const percentageUsed = (usedBeds / row.totalBeds) * 100;
  const roundTo2DP = usedBeds === 0 ? 0 : percentageUsed.toFixed(2);

  return (
    <TableRow
      sx={{
        "&:nth-of-type(odd)": {
          backgroundColor: "background.custom",
        },
        "&:last-child td, &:last-child th": { border: 0 },
      }}
    >
      <TableCell align="left">{i + 1}</TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row.name}
      </TableCell>
      <TableCell align="left" sx={{ color: "primary.darkGrey" }}>
        {row.totalBeds}
      </TableCell>
      <TableCell align="left">{`${roundTo2DP}%`}</TableCell>

      <TableCell align="left">
        {" "}
        <CustomDotMenu
          items={[
            {
              caption: "View Ward Details",
              icon: <PersonOutlineOutlinedIcon sx={{ mr: 1 }} />,
              action: handleViewDetails,
            },
            {
              caption: "Edit Ward Details",
              icon: <PersonOutlineOutlinedIcon sx={{ mr: 1 }} />,
              action: handleEditWardDetails.bind(this, row),
            },
            {
              caption: "Delete Ward",
              icon: <LabelOutlinedIcon sx={{ mr: 1 }} />,
              action: () => handleDeleteWard(),
            },
          ]}
        />{" "}
      </TableCell>
    </TableRow>
  );
};

export default function WardOverviewDashboardTable({
  handleEditWardDetails,
  data,
  refetchWardOverview,
}) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              S/N
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Ward Name
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Total Number of Beds
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Percentage Used
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length ? (
            data.map((row, i) => (
              <Row
                key={i}
                row={row}
                i={i}
                handleEditWardDetails={handleEditWardDetails}
                refetchWardOverview={refetchWardOverview}
              />
            ))
          ) : (
            <TableRow>
              <TableCell align="left">No data to display</TableCell>
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
