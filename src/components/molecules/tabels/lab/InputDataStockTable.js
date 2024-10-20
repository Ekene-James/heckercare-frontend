import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CancelIcon from "@mui/icons-material/Cancel";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Box, IconButton, Stack } from "@mui/material";
import CustomTextInput from "components/atoms/CustomTextInput";
import { red } from "@mui/material/colors";
import CustomSelect from "components/atoms/Select";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { GET_LAB_STOCKS, GET_LAB_STOCK_UNITS } from "utils/reactQueryKeys";
import CustomButton from "components/atoms/CustomButton";

const Row = ({ row, i, handleChangeDetail, handleDeleteStock, stocks }) => {
  return (
    <TableRow
      sx={
        {
          // "&:last-child td, &:last-child th": { border: 0 },
        }
      }
    >
      <TableCell>{i + 1}</TableCell>
      <TableCell
        align="left"
        sx={{
          borderRadius: "10px",
          p: 0,
          m: 0,
          width: "30%",
          borderBottom: "none !important",
        }}
      >
        <CustomSelect
          options={stocks?.item}
          state={row.item}
          handleChange={handleChangeDetail.bind(null, i)}
          name="item"
          haveTopLabel={true}
          placeholder="Select from list"
          boxSx={{
            width: {
              xs: "100%",
              sm: "auto",
            },
          }}
        />
      </TableCell>
      <TableCell
        align="left"
        sx={{
          borderRadius: "10px",
          p: 0,
          m: 0,
          width: "30%",
          borderBottom: "none !important",
        }}
      >
        <CustomSelect
          options={stocks?.unit}
          state={row.item}
          handleChange={handleChangeDetail.bind(null, i)}
          name="unit"
          placeholder="Select units"
          boxSx={{
            width: {
              xs: "100%",
              sm: "auto",
            },
          }}
          haveTopLabel
          readOnly
        />
      </TableCell>
      <TableCell
        align="left"
        sx={{
          borderRadius: "10px",
          p: 0,
          m: 0,
          width: "30%",
          borderBottom: "none !important",
        }}
      >
        <CustomTextInput
          placeholder={"Enter quantity"}
          name="quantity"
          type="number"
          boxSx={{
            width: {
              xs: "70px",
              sm: "auto",
            },
          }}
          value={row?.quantity}
          handleChange={handleChangeDetail.bind(null, i)}
          inputProps={{ inputProps: { min: 0 } }}
        />
      </TableCell>
      <TableCell
        align="left"
        sx={{
          width: "30%",
          p: 0,
          pl: 1,
          borderBottom: "none !important",
        }}
      >
        <IconButton
          onClick={handleDeleteStock.bind(null, row.uid)}
          size="small"
          // sx={{ mt: "20px !important" }}
        >
          <CancelIcon sx={{ color: red[500], fontSize: "17px" }} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default function InputDataStockTable({
  data,
  handleChangeDetail,
  handleDeleteStock,
  handleAddStock,
  investigationId,
}) {
  //get lab stocks

  const { data: stocks } = useCustomQuery(
    GET_LAB_STOCKS,
    {
      url: `/lab-stock`,
      method: "get",
      avoidCancelling: true,
    },
    {
      refetchOnWindowFocus: false,
      select: (data) => {
        const itemData = data.data.labStock
          .filter((stock) => +stock.totalQuantity > 0)
          .map((stock) => {
            return { name: stock.itemName, value: stock._id };
          });
        const unitData = data.data.labStock
          .filter((stock) => +stock.totalQuantity > 0)
          .map((stock) => {
            return { name: stock.unitOfItem, value: stock._id };
          });
        return { item: itemData, unit: unitData };
      },
    }
  );

  return (
    <Stack sx={{ backgroundColor: "background.custom", p: 2 }}>
      <TableContainer component={Box}>
        <Table
          sx={{
            minWidth: 550,
            borderSpacing: "10px",
            borderCollapse: "separate",
            borderColor: "transparent",
          }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell align="left" />
              <TableCell
                align="left"
                sx={{ fontWeight: "bold", borderBottom: "none" }}
              >
                Item Name
              </TableCell>
              <TableCell
                align="left"
                sx={{ fontWeight: "bold", borderBottom: "none" }}
              >
                Unit
              </TableCell>
              <TableCell
                align="left"
                sx={{ fontWeight: "bold", borderBottom: "none" }}
              >
                Quantity
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, i) => (
              <Row
                key={i}
                row={row}
                handleChangeDetail={handleChangeDetail}
                handleDeleteStock={handleDeleteStock}
                stocks={stocks}
                i={i}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CustomButton
        variant="containedBrown"
        text="Add New Stock"
        startIcon={<AddCircleIcon color="primary" />}
        onClick={handleAddStock}
        sx={{
          alignSelf: "flex-end",

          mt: 4,
        }}
      />
    </Stack>
  );
}
