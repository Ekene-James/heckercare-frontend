import { IconButton, Stack, Typography } from "@mui/material";

import React from "react";

import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CustomDotMenu from "components/atoms/CustomDotMenu";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import CustomModal from "components/atoms/CustomModal";
import Delete from "./modalContents/Delete";
import { useNavigate } from "react-router-dom";
import StaffListModalParent from "./modalContents/StaffListModalParent";

const StaffList = ({
  selectedItems = [],
  list,
  handleSelect,
  handleUnSelect,
  deleteAction = () => {},
  showDotMenu = true,
  deptData = {},
  deleteBtnLoading = false,
  hideTransferStaff = false,
}) => {
  const modalRef = React.useRef(null);
  const navigate = useNavigate();
  const [modalType, setmodalType] = React.useState("remove");
  const isSelected = selectedItems.includes(list.id);
  const toggleModal = (type) => {
    setmodalType(type);
    modalRef?.current?.handleToggle();
  };
  const handleDelete = (params) => {
    deleteAction(params);
    toggleModal();
  };
  let menuItems = [
    {
      caption: "View Profile",
      icon: <PersonOutlineOutlinedIcon sx={{ mr: 1 }} />,
      action: () => navigate(`/home/staff/${list?._id}`),
    },

    {
      caption: "Transfer Staff",
      icon: <PersonOutlineOutlinedIcon sx={{ mr: 1 }} />,
      action: () => toggleModal("transfer"),
    },
  ];

  if (hideTransferStaff)
    menuItems = [
      {
        caption: "View Profile",
        icon: <PersonOutlineOutlinedIcon sx={{ mr: 1 }} />,
        action: () => navigate(`/home/staff/${list._id}`),
      },
    ];
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
          {/* <Typography variant="caption" sx={{}}>
            {list.position}
          </Typography> */}
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
        {showDotMenu && (
          <CustomDotMenu
            items={menuItems}
            iconBtn={<MoreHorizOutlinedIcon />}
          />
        )}
      </Stack>
      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
          width: {
            xs: "90%",
            lg: "65%",
          },
        }}
        ariaLabel="delete-staff-modal"
      >
        <StaffListModalParent
          handleDelete={handleDelete.bind(this, list._id)}
          msg={`${list.firstName} ${list.lastName}`}
          handleClose={toggleModal}
          modalType={modalType}
          transferBtnLoading={false}
          staffData={list}
          deptData={deptData}
          deleteBtnLoading={deleteBtnLoading}
        />
      </CustomModal>
    </Stack>
  );
};
export default StaffList;
