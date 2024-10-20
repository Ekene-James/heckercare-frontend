import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import CustomMenu from "components/atoms/CustomMenu";
import SearchBar from "components/atoms/SearchBar";
import React from "react";
import PrintIcon from "@mui/icons-material/Print";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import StaffListCard from "components/atoms/StaffListCard";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import CustomLoader from "components/atoms/CustomLoader";
import { useQueryClient } from "react-query";
import CsvDownloader from "react-csv-downloader";
import { exportToExcel } from "utils/exportToExcel";
import {
  GET_ROLES,
  GET_STAFFS,
  GET_WARDS,
  SEARCH_STAFFS_BY_WARD,
} from "utils/reactQueryKeys";
import Pagination from "components/molecules/pagination/Pagination";

const columns = [
  {
    id: "accountStatus",
    displayName: "accountStatus",
  },
  {
    id: "dateOfBirth",
    displayName: "dateOfBirth",
  },
  {
    id: "createdAt",
    displayName: "createdAt",
  },
  {
    id: "email",
    displayName: "email",
  },
  {
    id: "firstName",
    displayName: "firstName",
  },
  {
    id: "lastName",
    displayName: "lastName",
  },
  {
    id: "gender",
    displayName: "gender",
  },
  {
    id: "fullName",
    displayName: "fullName",
  },
  {
    id: "id",
    displayName: "id",
  },
  {
    id: "isFree",
    displayName: "isFree",
  },

  {
    id: "phoneNumber",
    displayName: "phoneNumber",
  },
  {
    id: "staffId",
    displayName: "staffId",
  },
  {
    id: "_id",
    displayName: "_id",
  },
];
const pageSize = 12;
function Staffs() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [role, setRole] = React.useState({ name: "Role" });
  const [wardDetails, setwardDetails] = React.useState({ name: "Ward" });
  const [search, setsearch] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  //getStaffs
  const {
    isLoading: staffListLoading,
    data: staffList,
    refetch,
  } = useCustomQuery(
    [
      GET_STAFFS,
      {
        page: currentPage,
        limit: pageSize,
        roleFilter: role?.name === "Role" ? null : role?.value,
      },
    ],
    {
      url: `/user/get-all-staff`,
      method: "post",
      data: {
        page: currentPage,
        search: "",
        roleFilter: role?.name === "Role" ? null : role?.value,
        limit: pageSize,
      },
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
  //search staffs
  const {
    isLoading: searchStaffsLoading,
    isFetching,
    refetch: refetchSearch,
  } = useCustomQuery(
    [
      GET_STAFFS,
      {
        page: currentPage,
        search,
        limit: pageSize,
      },
    ],
    {
      url: `/user/get-all-staff`,
      method: "post",
      data: {
        page: currentPage,
        search,
        // roleFilter: role?.name === "Role" ? null : role?.value,
        limit: pageSize,
      },
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        // queryClient.getQueryData()
        queryClient.setQueryData(
          [
            GET_STAFFS,
            {
              page: currentPage,
              // search,
              limit: pageSize,
              roleFilter: role?.name === "Role" ? null : role?.value,
            },
          ],
          (oldQueryData) => {
            return {
              ...response,
            };
          }
        );
      },
    }
  );

  //search staffs by wards
  useCustomQuery(
    [SEARCH_STAFFS_BY_WARD, wardDetails?.id],
    {
      url: `/wards/get-staff-in-single-ward/${wardDetails?.id}?search=`,
      method: "get",
    },
    {
      enabled: !!wardDetails?.id,
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        queryClient.setQueryData(
          [
            GET_STAFFS,
            {
              page: currentPage,
              limit: pageSize,
              roleFilter: role?.name === "Role" ? null : role?.value,
            },
          ],
          (oldQueryData) => {
            return {
              ...oldQueryData,
              data: {
                ...oldQueryData.data,
                data: [...response.data.staff],
              },
            };
          }
        );
      },
    }
  );

  //get wards
  const { data: wards } = useCustomQuery(
    GET_WARDS,
    {
      url: `/wards/get-all-wards`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  //get roles
  const {
    isLoading: rolesLoading,
    isError: rolesError,
    data: roles,
    refetch: refetchRoles,
  } = useCustomQuery(
    GET_ROLES,
    {
      url: `/role`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      select: (res) => {
        const formartedData = res?.data.data?.map((role) => {
          return { name: role?.name, value: role?._id };
        });
        return formartedData;
      },
    }
  );

  const handleExport = (item) => {
    if (item.name === "Excel") {
      exportToExcel(staffList?.data?.data, "my_hospital_staffs_excel");
    }
  };
  const handleClickWard = (item) => {
    setwardDetails(item);
  };
  const handleClickDesignation = (item) => {
    setRole(item);
  };

  const handleReset = () => {
    setsearch("");
    setCurrentPage(1);
    setwardDetails({ name: "Ward" });
    setRole({ name: "Role" });
    refetch();
  };

  return (
    <Box>
      <Typography variant="displayMd">Staff List</Typography>
      <Paper sx={{ p: 1, mt: 2 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={7} lg={8}>
            <SearchBar
              refetch={refetchSearch}
              placeholder="Search ‘Staff ID’ or Designation"
              width="100% !important"
              isLoading={searchStaffsLoading || isFetching}
              search={search}
              setsearch={setsearch}
            />
          </Grid>
          <Grid item xs={6} sm={2}>
            <CustomMenu
              caption="Export"
              icon={<PrintIcon />}
              onClickItem={handleExport}
              popperSx={{ width: "12%" }}
              disabled={!staffList?.data?.data?.length}
              items={[
                {
                  name: (
                    <CsvDownloader
                      filename="my_hospital_staffs"
                      extension=".csv"
                      columns={columns}
                      datas={staffList?.data?.data || []}
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
          </Grid>
          <Grid item xs={6} sm={3} lg={2}>
            <Button
              color="secondary"
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ width: "100%", fontSize: "12px", pt: 1, pb: 1 }}
              onClick={() => navigate("/home/staff/registration")}
            >
              Add Staff
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={1} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={11}>
            <Stack direction="row" spacing={1}>
              <CustomMenu
                caption={wardDetails.name}
                onClickItem={handleClickWard}
                items={wards?.data?.wards}
              />
              <CustomMenu
                caption={role?.name}
                onClickItem={handleClickDesignation}
                items={roles}
              />
            </Stack>
          </Grid>

          <Grid
            item
            xs={12}
            sm={1}
            sx={{ display: "flex", justifyContent: "end" }}
          >
            <Button variant="text" onClick={handleReset}>
              Reset
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Paper sx={{ p: 3, mt: 2 }}>
        {staffListLoading ? (
          <CustomLoader />
        ) : (
          <>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {staffList?.data?.data?.length ? (
                staffList?.data?.data?.map((item) => (
                  <Grid item xs={6} sm={4} lg={3} key={item._id}>
                    <StaffListCard item={item} />
                  </Grid>
                ))
              ) : (
                <Typography variant="heading">No Item to display</Typography>
              )}
            </Grid>
            <Stack maxWidth={"95%"}>
              <Pagination
                currentPage={currentPage}
                totalCount={staffList?.data?.count || 10}
                pageSize={pageSize}
                onPageChange={handlePageChange}
              />
            </Stack>
          </>
        )}
      </Paper>
    </Box>
  );
}

export default Staffs;
