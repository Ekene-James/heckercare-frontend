import { Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import React, { useMemo, useState } from "react";
import VerifiedIcon from "@mui/icons-material/Verified";
import CustomTextInput from "components/atoms/CustomTextInput";
import CustomSelect from "components/atoms/Select";
import {
  GET_DESIGNATIONS,
  GET_ROLE_DESIGNATIONS,
  GET_ROLES_FOR_USERS,
  GET_TRANSACTION_TYPES,
  GET_WARDS,
} from "utils/reactQueryKeys";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { toast } from "react-toastify";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { useQueryClient } from "react-query";
const initialState = {
  specialty: "",
  amount: "",
  ward: "",
  name: "",
};

const doctorsRoleId = "662123e0ac18d4fd7678d50c";

const formatEditData = (data, type) => {
  if (type === "Consultations") {
    return {
      type: "CONSULTATION",
      amount: +data.amount,
      specialty: data.specialty,
      name: data.name,
    };
  } else if (type === "Regitration fee") {
    return {
      type: "REGISTRATION FEE",
      amount: +data.amount,
    };
  } else {
    return {
      type: "ADMISSION",
      amount: +data.amount,
      ward: data.ward,
    };
  }
};

function AddTransactionType({
  close,
  typeText,
  transactionType,

  clickedCard = {},
}) {
  const [form, setform] = useState(initialState);
  const queryClient = useQueryClient();

  //get user roles
  const { data: docRoleId, isLoading: getrolesLoading } = useCustomQuery(
    [
      GET_ROLES_FOR_USERS,
      {
        limit: 1000,
      },
    ],
    {
      url: `/role?limit=100`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      select: (res) => {
        return res.data.data.find(
          (role) => role.name.toLowerCase() === "doctor"
        )?.id;
      },
    }
  );

  useMemo(() => {
    if (Object.keys(clickedCard).length) {
      setform(clickedCard);
    }
  }, [clickedCard]);

  //get role designations
  const { data: designations } = useCustomQuery(
    [GET_ROLE_DESIGNATIONS, docRoleId],
    {
      url: `/designation/role/${docRoleId}`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,

      select: (res) => {
        const formartedData = res?.data?.map((role) => {
          return { name: role?.name, value: role?._id };
        });
        return formartedData;
      },
      enabled: !!docRoleId,
    }
  );

  const handleChange = (e) => {
    setform((prev) => {
      if (e.target.name === "specialty") {
        return {
          ...prev,
          [e.target.name]: e.target.value,
          name: designations.find((desig) => desig.value === e.target.value)
            .name,
        };
      } else {
        return { ...prev, [e.target.name]: e.target.value };
      }
    });
  };

  //edit transaction type
  const { mutate: editTransactionType, isLoading: editTransactionTypeLoading } =
    useCustomMutation(
      {
        url: `/transaction-type/${form?._id}`,
        method: "patch",
        data: formatEditData(form, transactionType),
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(GET_TRANSACTION_TYPES);
          toast.success("Success");
          close();
        },
        onError: (error) => {
          if (typeof error?.message === "object") {
            return error?.message?.map((msg) => toast.error(msg));
          }
          return toast.error(error.message);
        },
      }
    );

  //create transaction type
  const {
    mutate: createTransactionType,
    isLoading: createTransactionTypeLoading,
  } = useCustomMutation(
    {
      url: `/transaction-type`,
      method: "post",
      data: formatEditData(form, transactionType),
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(GET_TRANSACTION_TYPES);
        toast.success("Success");
        close();
      },
      onError: (error) => {
        if (typeof error?.message === "object") {
          return error?.message?.map((msg) => toast.error(msg));
        }
        return toast.error(error.message);
      },
    }
  );

  return (
    <Stack spacing={3}>
      <Stack spacing={1.5}>
        <Typography variant="displaySm">{typeText}</Typography>
      </Stack>

      <Stack>
        <CustomTextInput
          title="Transaction Type"
          value={transactionType}
          readOnly
        />
        {transactionType === "Consultations" ? (
          <CustomSelect
            options={designations || []}
            label="Specialist"
            state={form.specialty || ""}
            handleChange={handleChange}
            name="specialty"
            haveTopLabel={true}
            placeholder="Select"
          />
        ) : clickedCard?.ward ? (
          <CustomTextInput
            title="Ward"
            value={form.name || ""}
            disabled="true"
            placeholder={"Ward"}
            // sx={{ width: "50%" }}
            readOnly
          />
        ) : null}

        <CustomTextInput
          title="Amount"
          value={form.amount}
          name={"amount"}
          handleChange={handleChange}
          placeholder={"Select Amount"}
          sx={{ width: "50%" }}
        />
      </Stack>

      <Stack>
        <CustomButton
          text={typeText === "Add New" ? "Save" : "Save Changes"}
          color="secondary"
          onClick={
            typeText === "Add New" ? createTransactionType : editTransactionType
          }
          sx={{ width: "fit-content" }}
          disabled={editTransactionTypeLoading || createTransactionTypeLoading}
        />
      </Stack>
    </Stack>
  );
}

export default AddTransactionType;
