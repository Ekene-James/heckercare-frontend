import { IconButton, Stack, Typography } from "@mui/material";

import React from "react";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

import CustomModal from "components/atoms/CustomModal";
import DeleteStaffsFromWard from "./DeleteStaffsFromWard";
import DeleteSingleStaff from "./DeleteSingleStaff";

const StaffList = ({
  selectedItems = [],
  list,
  lists,
  handleSelect,
  handleUnSelect,
  deleteBtnLoading,
  handleDelete,
  useDeleteSingleModal = false,
  refetch,
  wardId,
}) => {
  const modalRef = React.useRef(null);

  const isSelected = selectedItems.includes(list.id);

  const toggleModal = (type) => {
    modalRef?.current?.handleToggle();
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={1}
      aria-label="staff-list"
      sx={{
        width: "100%",
      }}
    >
      <Stack
        spacing={1}
        direction="row"
        alignItems="flex-start"
        justifyContent="flex-start"
      >
        {isSelected ? (
          <IconButton
            onClick={() => handleUnSelect(list.id)}
            aria-label="checked-box-icon"
          >
            <CheckBoxIcon sx={{ color: "primary.main", fontSize: "20px" }} />
          </IconButton>
        ) : (
          <IconButton
            onClick={() => handleSelect(list.id)}
            aria-label="unChecked-box-icon"
          >
            <CheckBoxOutlineBlankIcon
              sx={{ color: "#DFDFDF", fontSize: "20px" }}
            />
          </IconButton>
        )}

        <Stack
          direction="column"
          alignItems="flex-start"
          justifyContent="flex-start"
          spacing={1}
        >
          <Typography
            sx={{ fontWeight: "bold" }}
          >{`${list.firstName} ${list.lastName}`}</Typography>

          <Typography variant="caption" sx={{}}>
            {list.staffId}
          </Typography>
        </Stack>
      </Stack>

      <Stack spacing={1} direction="row">
        <IconButton
          size="small"
          onClick={toggleModal.bind(this, "remove")}
          sx={{
            backgroundColor: "secondary.light",
            borderRadius: "4px",
          }}
          color="secondary"
          aria-label="delete-icon"
        >
          <DeleteOutlinedIcon />
        </IconButton>
      </Stack>
      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
          width: {
            xs: "90%",
            lg: "70%",
          },
        }}
        ariaLabel="delete-staff-modal"
      >
        {useDeleteSingleModal ? (
          <DeleteSingleStaff
            msg={`${list.firstName} ${list.lastName}`}
            id={list?._id}
            handleClose={toggleModal}
            lists={lists}
            refetch={refetch}
            wardId={wardId}
          />
        ) : (
          <DeleteStaffsFromWard
            handleDelete={handleDelete.bind(null, list?._id)}
            msg={`${list.firstName} ${list.lastName}`}
            handleClose={toggleModal}
            deleteBtnLoading={deleteBtnLoading}
          />
        )}
      </CustomModal>
    </Stack>
  );
};
export default StaffList;
