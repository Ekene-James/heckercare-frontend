import PaginationBtn from "./PaginationBtn";

import { Box, Typography } from "@mui/material";
import React from "react";
import { DOTS, usePagination } from "../../../store/hooks/usePagination";

function Pagination({
  onPageChange,
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize,
  activeColor,
  displayShowResults = true,
}) {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  // If there are less than 2 times in pagination range we shall not render the component
  if (currentPage === 0 || paginationRange?.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange?.length - 1];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: displayShowResults
          ? "space-between"
          : "flex-start!important",
        alignItems: {
          xs: "start",
          sm: "center",
        },
        width: {
          xs: "100%",
          // sm: "80%",
        },
        flexDirection: {
          xs: "column",
          sm: "row",
        },
        marginTop: {
          xs: "10px",
          sm: 0,
        },
      }}
    >
      {displayShowResults ? (
        <Typography>
          Showing results: {currentPage} out of {lastPage}
        </Typography>
      ) : null}

      <Box
        sx={{
          width: displayShowResults
            ? paginationRange?.length >= 5
              ? { xs: "100%", sm: "37%" }
              : "15%"
            : paginationRange?.length >= 5
            ? { xs: "100%", sm: "75%" }
            : { xs: "100%", sm: "50%" },
          display: "flex",
          margin: "auto",
          mt: 2,
          mb: 2,
          mr: { xs: 0, sm: "6%", xl: 0 },
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <PaginationBtn
          disabled={currentPage === 1}
          onClick={onPrevious}
          content={
            <Typography
              variant="body"
              sx={{ fontSize: { xs: "9px", sm: "13px" } }}
            >
              Prev
            </Typography>
          }
        />

        {paginationRange?.length &&
          paginationRange?.map((pageNumber, i) => {
            // If the pageItem is a DOT, render the DOTS
            if (pageNumber === DOTS) {
              return <PaginationBtn key={i} content={"..."} disabled={true} />;
            }

            // Render our Page Pills
            return (
              <PaginationBtn
                key={i}
                active={pageNumber === currentPage}
                onClick={() => onPageChange(pageNumber)}
                content={pageNumber}
                activeColor={activeColor}
              />
            );
          })}

        <PaginationBtn
          disabled={currentPage === lastPage}
          onClick={onNext}
          content={
            <Typography
              variant="body"
              sx={{ fontSize: { xs: "9px", sm: "13px" } }}
            >
              Next
            </Typography>
          }
        />
      </Box>
    </Box>
  );
}

export default Pagination;
