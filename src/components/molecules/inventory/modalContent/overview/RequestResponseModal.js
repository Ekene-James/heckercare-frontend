import { Grid, Stack, Typography } from "@mui/material";
import CustomAccordion from "components/atoms/CustomAccordion";
import CustomButton from "components/atoms/CustomButton";
import CustomTextInput from "components/atoms/CustomTextInput";
import CustomSelect from "components/atoms/Select";

import React from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import {
  GET_INVENTORY_PRODUCT_BATCH,
  GET_REQUEST_HISTORY,
  RADIOLOGY_STOCK_HISTORY,
} from "utils/reactQueryKeys";

const AccordionComponent = ({ i, item, values, handleChange }) => {
  //get all item types

  const { data: batches } = useCustomQuery(
    [GET_INVENTORY_PRODUCT_BATCH, item?.item?._id],
    {
      url: `/itemproduct/get-item-batches/${item?.item?._id}`,
      // url: `/itemproduct/get-all-batches`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      select: (data) => {
        const formattedData = data.data.batches.map((type) => {
          return {
            name: `${type.product.itemName} - ${type.batchNumber} - Qty(${type.quantity})`,
            value: type._id,
          };
        });
        return formattedData;
      },
    }
  );

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={6}>
        <CustomTextInput
          title="Available Qty"
          value={item?.item?.availableQuantity || "0"}
          placeholder={"Enter quantity"}
          disabled="true"
          readOnly
          type="text"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextInput
          title="Requested Qty"
          value={item?.quantity}
          placeholder={"Enter quantity"}
          disabled="true"
          readOnly
        />
      </Grid>
      <Grid item xs={12} sm={8}>
        <CustomSelect
          options={batches}
          label="Batch"
          state={values[i].batchId}
          handleChange={handleChange.bind(null, i)}
          name="batchId"
          haveTopLabel={true}
          placeholder="Select batch"
          emptyOptionsText="No batch for this item"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextInput
          title="Quantity"
          value={values[i].quantity}
          placeholder={"Enter quantity"}
          type="number"
          name="quantity"
          handleChange={handleChange.bind(null, i)}
        />
      </Grid>
    </Grid>
  );
};

function RequestResponseModal({ data, closeModal, requesDetail }) {
  const queryClient = useQueryClient();
  const [values, setvalues] = React.useState([]);

  React.useMemo(() => {
    const stateVal = data.map((d) => ({
      item: d?.item?._id,
      quantity: d.quantity,
      batchId: "",
      note: d.note,
    }));
    setvalues(stateVal);
  }, [data]);

  //grant request
  const { mutate: grantRequest, isLoading: grantRequestLoading } =
    useCustomMutation(
      {
        url: `/inventory/grant-request/${requesDetail?._id}`,
        method: "post",
        data: {
          items: values,
          approval: "APPROVED",
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries([GET_REQUEST_HISTORY]);
          queryClient.invalidateQueries([RADIOLOGY_STOCK_HISTORY]);
          toast.success("Success");
          closeModal();
        },

        onError: (error) => {
          if (Array.isArray(error.message)) {
            return error.message.map((msg) => toast.error(msg));
          }

          return toast.error(error.message);
        },
      }
    );

  const handleChange = (idx, e) => {
    setvalues((prev) => {
      const copy = [...prev];
      const itemObj = copy[idx];
      const item = {
        ...itemObj,
        [e.target.name]:
          e.target.name === "quantity" ? +e.target.value : e.target.value,
      };
      copy[idx] = item;

      return copy;
    });
  };
  const handleApprove = () => {
    const isNoBatchId = values.some((val) => val.batchId === "");
    const isNoQuantity = values.some(
      (val) => val.quantity <= 0 || val.quantity === null
    );

    if (isNoBatchId) {
      return toast.error(
        "Please select batch of each item, If no batch exists for any item, kindly remove from selected list"
      );
    }
    if (isNoQuantity) {
      return toast.error("Please select quantity of each item");
    }
    grantRequest();
  };
  return (
    <Stack spacing={3}>
      <Typography variant="displayMd">Request Response</Typography>
      <Stack spacing={1.5}>
        {data.map((item, i) => (
          <CustomAccordion
            key={i}
            item={{
              title: item.item?.itemName,
              changeOnExpanded: false,
              detailsComponent: (
                <AccordionComponent
                  i={i}
                  item={item}
                  handleChange={handleChange}
                  values={values}
                />
              ),
            }}
          />
        ))}
      </Stack>
      <Stack spacing={1} direction="row">
        <CustomButton
          text="Grant"
          color="success"
          onClick={handleApprove}
          disabled={grantRequestLoading}
        />
        <CustomButton text="Cancel" color="primary" onClick={closeModal} />
      </Stack>
    </Stack>
  );
}

export default RequestResponseModal;
