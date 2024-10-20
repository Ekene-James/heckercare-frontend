import React, { useMemo } from "react";
import PropTypes from "prop-types";

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Pagination from "components/molecules/pagination/Pagination";
import useTable from "hooks/useTable";
/**
 *
 * @param {object | array-like} columns The style to be applied to each columns of Table
 * @param {JSX.Element | string} emptyComponent What to render when data passed is empty
 * @param {array } data The data to be displayed
 * @param {bool } heading Shows the header of a table
 */
const SimpleTable = ({
  columns = [
    {
      field: "name",
      title: "Name",
      headerStyle: {},
      cellStyle: {},
      renderItem: (rowData) => {},
    },
  ],
  data = [],
  heading = false,
  emptyComponent,
  alternate = false,
  loading,

  perPage = 3,
  useFooter = true,
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const { slice } = useTable(data, currentPage, perPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "auto" }}>
      <TableContainer>
        <Table
          sx={{ minWidth: 650, overflow: "auto" }}
          aria-label="simple table"
        >
          {heading && (
            <TableHead sx={{ width: "100%" }}>
              <TableRow>
                {columns.map((_, ind) => {
                  return columns[ind] ? (
                    <TableCell
                      key={ind}
                      variant="head"
                      style={{ ...(columns[ind].headerStyle || {}) }}
                      align="left"
                      sx={{ fontWeight: "bold", ...(columns[ind].hsx || {}) }}
                    >
                      {columns[ind].title}
                    </TableCell>
                  ) : null;
                })}
              </TableRow>
            </TableHead>
          )}
          {loading ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={columns.length}>
                  {" "}
                  No Records Found{" "}
                </TableCell>
                <Box></Box>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {Array.isArray(slice) && data.length ? (
                slice.map((datum, index) => {
                  return (
                    <TableRow
                      key={datum?.id || Math.random().toString(16)}
                      sx={{
                        "&:nth-of-type(odd)": {
                          backgroundColor: alternate
                            ? "background.custom"
                            : "primary",
                        },
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      {columns.map((_, ind) => {
                        return columns[ind] ? (
                          <TableCell
                            key={datum?.id + " - " + ind}
                            style={{ ...(columns[ind].cellStyle || {}) }}
                            sx={{ ...(columns[ind].csx || {}) }}
                          >
                            {columns[ind].renderItem
                              ? columns[ind].renderItem(datum || {})
                              : datum?.[columns[ind].field]}
                          </TableCell>
                        ) : null;
                      })}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    {" "}
                    No Records Found{" "}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      {useFooter && (
        <Box sx={{ width: "100%", mt: 2 }}>
          <Pagination
            currentPage={currentPage}
            totalCount={data.length || 5}
            pageSize={perPage}
            activeColor="secondary.main"
            onPageChange={handlePageChange}
          />
        </Box>
      )}
    </Paper>
  );
};

SimpleTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  heading: PropTypes.bool,
  emptyComponent: PropTypes.element,
};

SimpleTable.defaultProps = {
  useFooter: true,
};

export default SimpleTable;
