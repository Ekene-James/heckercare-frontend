import { Stack } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import React from "react";
import CustomSwitch from "components/atoms/Switch";
import VendorDetails from "./VendorDetails";
import ProductDetails from "./ProductDetail";
import { vendorDetails } from "../purchaseOrder/data";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { useQueryClient } from "react-query";
import {
  GET_ALL_INVENTORY_REQUISITIONS,
  GET_ALL_NEW_VENDORS,
} from "utils/reactQueryKeys";
import { toast } from "react-toastify";

function ViewVendor({ edit, detail }) {
  const [screen, setscreen] = React.useState(0);
  const queryClient = useQueryClient();
  const [status, setstatus] = React.useState(detail?.active);
  const firstLoad = React.useRef(true);

  //toggle status
  const { mutate: toggleStatus, isLoading: toggleStatusLoading } =
    useCustomMutation(
      {
        url: `/newvendor/toggle-vendor/${detail._id}`,
        method: "patch",
        data: {
          active: status,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(GET_ALL_NEW_VENDORS);

          toast.success("Success");
        },

        onError: (error) => {
          // setstatus((prev) => !prev);
          if (Array.isArray(error.message)) {
            return error.message.map((msg) => toast.error(msg));
          }

          return toast.error(error.message);
        },
      }
    );

  React.useMemo(() => {
    if (firstLoad.current) {
      return (firstLoad.current = false);
    }
    toggleStatus();
  }, [status]);
  const handleCheck = (state) => {
    setstatus(state);
  };
  let view;
  switch (screen) {
    case 0:
      view = <VendorDetails edit={edit} detail={detail} />;

      break;
    case 1:
      view = <ProductDetails detail={detail} />;

      break;

    default:
      break;
  }
  return (
    <Stack spacing={4} width="100%">
      <Stack
        spacing={1}
        width="100%"
        direction={"row"}
        justifyContent="space-between"
      >
        <Stack spacing={1} direction={"row"} alignItems="center">
          <CustomButton
            text="Vendor Details"
            variant={screen === 0 ? "containedBrown" : "text"}
            onClick={() => setscreen(0)}
            sx={{ minWidth: "15%" }}
          />
          <CustomButton
            text="Product Details"
            variant={screen === 1 ? "containedBrown" : "text"}
            onClick={() => setscreen(1)}
            sx={{ minWidth: "15%" }}
          />
        </Stack>
        <CustomSwitch
          color={"success"}
          checkedTitle="Active"
          unCheckedTitle="Inactive"
          successTextcolor="primary.success"
          handleCheck={handleCheck}
          initialState={status}
          disabled={toggleStatusLoading}
        />
      </Stack>
      {view}
    </Stack>
  );
}

export default ViewVendor;
