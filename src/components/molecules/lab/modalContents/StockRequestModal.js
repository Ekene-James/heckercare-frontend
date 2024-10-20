import { Divider, Grid, IconButton, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomTextInput from "components/atoms/CustomTextInput";
import CustomSelect from "components/atoms/Select";
import CustomSwitch from "components/atoms/Switch";
import UploadBoard from "components/atoms/UploadBoard";
import React from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import {
  GET_ALL_INVENTORY_PRODUCTS,
  GET_REQUEST_HISTORY,
} from "utils/reactQueryKeys";
import { v4 as uuidv4 } from "uuid";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomMenu from "components/atoms/CustomMenu";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";

export const UnitItem = [
  "TABLET",
  "VIAL",
  "PIECE",
  "CAPSULE",
  "SYRUP",
  "INJECTION",
  "DROPS",
  "GEL",
  "OINTMENT",
  "LOTION",
  "CREAM",
  "PASTE",
  "SOLUTION",
  "SUSPENSION",
  "EMULSION",
  "LIQUID",
  "PILL",
  "CARTON",
  "BOTTLE",
  "PACKET",
  "BOX",
  "BAG",
  "CAN",
  "TUBE",
  "BOTTLE_OF_100",
  "BOTTLE_OF_500",
  "BOTTLE_OF_1000",
];
// const formatData = (formState) => {
//   // if (!formState.image) {
//   //   return [
//   //     {
//   //       ...formState,
//   //       // unitOfItem: formState?.unit,
//   //       quantity: parseInt(formState?.quantity),
//   //     },
//   //   ];
//   // }
//   return {
//     ...formState,

//     quantity: parseInt(formState?.quantity),
//   };

//   // const formData = new FormData();
//   // formData.append("item", formState?.item);
//   // formData.append("quantity", parseInt(formState?.quantity));
//   // formData.append("unitOfItem", formState?.unit);
//   // formData.append("note", formState?.note);
//   // formData.append("image", formState?.image);

//   // return formData;
// };
const formatData = (formState) => {
  if (!formState.length) return [];
  const data = formState.map((state) => {
    return {
      item: state.item,
      quantity: +state.quantity,
      // unitOfItem: state.unitOfItem,
      note: state.note,
    };
  });

  return {
    items: data,
  };
};

function StockRequestModal({ handleClose }) {
  const [requests, setrequests] = React.useState([]);
  const queryClient = useQueryClient();

  const [formState, setformState] = React.useState({
    item: "",
    quantity: 0,

    note: "",
    // image: "",
  });
  //get all inventory products
  const { data: items } = useCustomQuery(
    [GET_ALL_INVENTORY_PRODUCTS],
    {
      url: `/itemproduct/getall?limit=1000`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      select: (res) => {
        return res.data.allItemProduct.map((item) => ({
          name: item.itemName,
          value: item._id,
        }));
      },
    }
  );
  const handleChange = (e) => {
    setformState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const { mutate: stockRequest, isLoading: requestLoading } = useCustomMutation(
    {
      url: `/lab-stock/submit-requisition-order`,
      method: "post",
      data: formatData(requests),
    },
    {
      refetchOnWindowFocus: false,

      onSuccess: () => {
        setformState({
          item: "",
          note: "",
          quantity: 0,
        });
        toast.success("Request successfully sent");
        queryClient.invalidateQueries(GET_REQUEST_HISTORY);
        handleClose();
      },

      onError: (error) => {
        console.log(error);
        toast.error("Failed to send Request");
      },
    }
  );

  const handleDelete = (uid) => {
    setrequests((prev) => {
      const filtered = prev.filter((d) => d.uid !== uid);
      return filtered;
    });
  };

  const handleAdd = () => {
    if (!formState.item) return toast.error("Please select an item");
    if (!formState.quantity) return toast.error("Please select a quantity");

    const data = {
      ...formState,
      uid: uuidv4(),
    };
    setrequests((prev) => [...prev, data]);
    setformState({
      item: "",
      note: "",
      quantity: 0,
    });
  };

  return (
    <Stack direction={"column"} sx={{ width: "100%" }} spacing={3}>
      <Stack direction={"column"} sx={{ width: "100%" }} spacing={1}>
        <Typography variant="displayMd">Stock Request</Typography>
      </Stack>
      <Divider />
      <Grid container spacing={1} sx={{ mt: 1, width: "100%" }}>
        <Grid item xs={12} sm={9}>
          <Grid container spacing={1} sx={{ mt: 1, width: "100%" }}>
            <Grid item xs={12}>
              <Stack spacing={0.5}>
                <Typography fontWeight={"bold"}>Add Item</Typography>

                <CustomMenu
                  caption={formState.itemName || "Select Item"}
                  items={items}
                  onClickItem={(view) =>
                    setformState({
                      ...formState,
                      item: view.value,
                      itemName: view.name,
                    })
                  }
                  buttonSx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: "50px !important",
                  }}
                  popperSx={{
                    width: "67%",
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <UploadBoard
                title="Upload an Image"
                title1="(Kindly upload a clear picture in .png or .jpg format)"
                onAddImg={(fileArr) => {
                  setformState((prev) => ({
                    ...prev,
                    image: fileArr,
                  }));
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextInput
                title="Quantity (in number)"
                value={formState.quantity}
                name="quantity"
                handleChange={handleChange}
                boxSx={{ width: "100%" }}
                placeholder="Type in number here"
                type="number"
              />
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <CustomSelect
                options={UnitItem}
                label="Unit"
                state={formState.unitOfItem}
                handleChange={handleChange}
                name="unitOfItem"
                haveTopLabel={true}
                placeholder="Select Unit"
              />
            </Grid> */}
            <Grid item xs={12}>
              <CustomTextInput
                title="Note"
                value={formState.note}
                name="note"
                handleChange={handleChange}
                boxSx={{ width: "100%" }}
                placeholder="Drop a note here"
                multiline
              />
            </Grid>
            <Grid item xs={12}>
              <CustomSwitch
                checkedTitle="Notify me when restocked into the inventory"
                handleCheck={() => {}}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <CustomButton
                text="Add"
                rgb="0, 132, 53"
                variant="custom"
                onClick={handleAdd}
              />
            </Grid>
            <Grid item xs={12} mt={4} mb={4}>
              <Stack
                spacing={1}
                width={{
                  xs: "80%",
                  sm: "75%",
                }}
              >
                <Typography variant="heading">Added Items</Typography>
                {requests.map((req, i) => (
                  <React.Fragment key={req.uid}>
                    <Stack
                      direction={"row"}
                      justifyContent="space-between"
                      alignItems="center"
                      width={"100%"}
                    >
                      <Typography>{i + 1}.</Typography>
                      <Typography fontWeight={"bold"}>
                        {req?.itemName}
                      </Typography>
                      <Typography fontWeight={"bold"}>
                        {req?.quantity}
                      </Typography>

                      <IconButton onClick={handleDelete.bind(null, req.uid)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Stack>
                    <Divider />
                  </React.Fragment>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={6} sm={4}>
              <CustomButton
                text="Send Request"
                color="secondary"
                onClick={stockRequest}
                disabled={requestLoading}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default StockRequestModal;
