import { Box, Paper, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomModal from "components/atoms/CustomModal";
import SearchBar from "components/atoms/SearchBar";
import PermissionTable from "components/molecules/tabels/settings/permissiontable";
import React, { useRef } from "react";
import { CreatePermissionModal } from "./createnewpermission";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { GET_ROLES_FOR_USERS } from "utils/reactQueryKeys";
import CustomLoader from "components/atoms/CustomLoader";
import Pagination from "components/molecules/pagination/Pagination";
import { useQueryClient } from "react-query";

const Permissions = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [search, setsearch] = React.useState("");
  const modalRef = useRef(null);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  //get user roles
  const { data: roles, isLoading: getrolesLoading } = useCustomQuery(
    [
      GET_ROLES_FOR_USERS,
      {
        page: currentPage,
        limit: 10,
      },
    ],
    {
      url: `/role?page=${currentPage}&limit=10`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  //search roles
  const { isLoading: searchRolesLoading, refetch } = useCustomQuery(
    [
      GET_ROLES_FOR_USERS,
      {
        search,
      },
    ],
    {
      url: `/role?search=${search}&limit=100`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        queryClient.setQueryData(
          [
            GET_ROLES_FOR_USERS,
            {
              page: currentPage,
              limit: 10,
            },
          ],
          (oldQueryData) => {
            return {
              ...response,
            };
          }
        );
      },
      enabled: false,
    }
  );

  const handleModal = () => {
    modalRef?.current?.handleToggle();
  };

  return (
    <>
      <Stack spacing={2}>
        <Typography variant="h4">Role & Permission Management</Typography>
        <Paper sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              width: "100%",
              gap: 2,
            }}
          >
            <CustomButton
              text={"Create New Role"}
              variant="contained"
              color="secondary"
              onClick={handleModal}
            />
            <SearchBar
              placeholder="Search role..."
              search={search}
              setsearch={setsearch}
              isLoading={searchRolesLoading}
              refetch={refetch}
            />
          </Box>
          {getrolesLoading ? (
            <CustomLoader />
          ) : (
            <>
              <PermissionTable data={roles?.data?.data} />
              <Pagination
                currentPage={currentPage}
                totalCount={roles?.data?.count || 5}
                pageSize={10}
                activeColor="secondary.main"
                onPageChange={handlePageChange}
                displayShowResults={false}
              />
            </>
          )}
        </Paper>
      </Stack>
      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
          height: "fit-content !important",
          width: {
            xs: "97% !important",
            sm: "43vw !important",
          },
        }}
      >
        <CreatePermissionModal handleModal={handleModal} />
      </CustomModal>
    </>
  );
};

export default Permissions;
