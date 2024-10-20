import {
  Box,
  Button,
  Grid,
  InputAdornment,
  Stack,
  Typography,
} from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomTextInput from "components/atoms/CustomTextInput";
import CustomSelect from "components/atoms/Select";
import React from "react";
import ListIcon from "@mui/icons-material/List";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddIcon from "@mui/icons-material/Add";
import { v4 as uuidv4 } from "uuid";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import {
  GET_ALL_PENDING_TRANSACTIONS,
  GET_ALL_PHARMACY_PRODUCTS,
} from "utils/reactQueryKeys";
import { useFormik } from "formik";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import SearchDropdown from "components/atoms/SearchDropdown";
import { useQueryClient } from "react-query";

const foodRelationEnum = [
  {
    name: "Before meal",
    value: "BEFORE_MEAL",
  },
  {
    name: "After meal",
    value: "AFTER_MEAL",
  },
  {
    name: "With meal",
    value: "WITH_MEAL",
  },
  {
    name: "Empty stomach",
    value: "EMPTY_STOMACH ",
  },
];
const initialValues = {
  product: "",
  notes: "",
  frequency: "",
  routeOfAdmin: "",
  duration: 0, //number of days
  amount: 0, //number of tablets
  foodRelation: "",
  genericName: "",
};
const routeOfAdminEnum = [
  "ORAL",
  "TOPICAL",
  "INHALATION",
  "INJECTION",
  "SUBCUTANEOUS",
  "INTRAVENOUS",
  "INTRAMUSCULAR",
  "RECTAL",
  "NASAL",
  "OPHTHALMIC",
  "OROPHARYNGEAL",
  "NASOPHARYNGEAL",
  "INTRATRACHEAL",
  "INTRACARDIAC",
  "INTRACEREBRAL",
  "INTRACOCCLEAR",
  "INTRACORNEAL",
  "INTRADERMAL",
  "INTRADISCAL",
  "INTRADUCTAL",
  "INTRAEPIDERMAL",
  "INTRAESOPHAGEAL",
  "INTRAGASTRIC",
  "INTRAGINGIVAL",
  "INTRAHEPATIC",
  "VAGINAL",
];
const frequencyEnum = [
  "OD",
  "BD",
  "TDS",
  "QDS",
  "QID",
  "QHS",
  "STAT",
  "PRN",
  "SOS",
  "Q4H",
  "Q8H",
  "Q12H",
  "Q24H",
  "HS",
];
const formatPresList = (prescriptionList) => {
  if (!prescriptionList.length) return;
  const data = prescriptionList.map((pres) => {
    const copy = pres;

    return {
      product: copy.product,
      notes: copy.notes,
      frequency: copy.frequency,
      routeOfAdmin: copy.routeOfAdmin,
      duration: copy.duration,
      amount: copy.amount,
      foodRelation: copy.foodRelation,
    };
  });
  return data;
};

function Prescription({
  handleNext,
  values: stateValue,
  setValues: setStateValues,
  mutate: postVisitItem,
  isLoading: postVisitItemLoading,
  isActiveVisit,
}) {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [prescriptionList, setprescriptionList] = React.useState([]);

  const [search, setsearch] = React.useState("");

  const [onSelectProduct, setonSelectProduct] = React.useState(false);
  const { handleChange, values, resetForm, setValues } = useFormik({
    initialValues,
  });

  //get all pharmacy products
  const {
    isLoading: productsLoading,

    data: pharmacyProdutcs,
    refetch: refetchProdutcs,
  } = useCustomQuery(
    [GET_ALL_PHARMACY_PRODUCTS, search],
    {
      url: `/product/getall?search=${search}&limit=10000`,
      method: "get",
      avoidCancelling: false,
    },
    {
      select: (res) => {
        if (res?.data?.products) return res;
        return {
          ...res,
          data: {
            products: res.data,
          },
        };
      },
      enabled: !!search && !onSelectProduct,
      refetchOnWindowFocus: false,
    }
  );

  //post  {prescription}
  const { mutate, isLoading } = useCustomMutation(
    {
      url: `/product/create-prescription`,
      method: "post",
      avoidCancelling: true,
      data: {
        items: formatPresList(prescriptionList),
        patient: id,
      },
    },
    {
      onSuccess: (res) => {
        setStateValues({
          ...stateValue,
          prescription: [...stateValue.prescription, res.data._id],
        });
        queryClient.invalidateQueries([GET_ALL_PENDING_TRANSACTIONS]);
        setprescriptionList([]);
        toast.success("Success");

        // handleNext();
      },

      onError: (error) => {
        if (Array.isArray(error.message)) {
          return error.message.map((msg) => toast.error(msg));
        }

        return toast.error(error.message);
      },
    }
  );

  const handleSearchOnChange = (text) => {
    setonSelectProduct(false);
    setsearch(text);
  };

  const handleDelete = (id) => {
    const newState = prescriptionList.filter((pres) => pres.uid !== id);
    setprescriptionList(newState);

    resetForm();
  };

  const handleEdit = (pres) => {
    setsearch(pres.drugName);
    setonSelectProduct(true);
    setValues(pres);

    //delete from the array since its been edited
    const newState = prescriptionList.filter(
      (prescription) => prescription.uid !== pres.uid
    );
    setprescriptionList(newState);
  };

  const handleAdd = () => {
    if (!values.product) return toast.error("Please select a drug");
    if (!values.amount) return toast.error("Please add an amount");
    if (!values.frequency) return toast.error("Please select frequency");
    if (!values.routeOfAdmin)
      return toast.error("Please select route of Admin");
    if (!values.duration) return toast.error("Please add duration");
    if (!values.foodRelation) return toast.error("Please select food relation");
    if (!values.notes) return toast.error("Please add instructions");

    setprescriptionList([...prescriptionList, { ...values, uid: uuidv4() }]);

    resetForm();
    handleSearchOnChange("");
  };
  const handleProductOnselect = (res) => {
    setonSelectProduct(true);
    setValues({
      ...values,
      product: res._id,
      brandName: res.brandName,
      drugName: res.drugName,
      genericName: res.genericName.activeIngredient,
    });
    setsearch(res.drugName);
  };

  return (
    <Box>
      <Stack direction="column" spacing={1} sx={{ mt: 2, mb: 2 }}>
        {prescriptionList.map((Prescription, i, arr) => (
          <Stack
            sx={{
              width: {
                xs: "100%",
                sm: "80%",
              },
              p: 1,
              borderBottom: i !== arr.length - 1 && "1px solid rgba(0,0,0,0.2)",
            }}
            direction="row"
            alignItems={"center"}
            justifyContent="space-between"
            spacing={1}
            key={Prescription.uid}
          >
            <Typography sx={{ fontWeight: "bold" }}>
              {Prescription.drugName}
            </Typography>
            <Typography sx={{ fontWeight: "bold" }}>
              {Prescription.brandName}
            </Typography>
            <Stack direction="row" spacing={1}>
              <CustomButton
                text={"Edit"}
                variant="custom"
                rgb="10, 132, 255"
                endIcon={<CreateIcon />}
                onClick={handleEdit.bind(this, Prescription)}
              />
              <CustomButton
                text={"Delete"}
                color="error"
                endIcon={<DeleteIcon />}
                onClick={handleDelete.bind(this, Prescription.uid)}
              />
            </Stack>
          </Stack>
        ))}
      </Stack>
      <Grid
        container
        spacing={1}
        sx={{
          width: {
            xs: "100%",
            sm: "80%",
          },
        }}
      >
        <Grid item xs={12} sm={7}>
          <SearchDropdown
            placeholder="Search drug name"
            handleOnselect={handleProductOnselect}
            title="Drug Name"
            boxSx={{ width: "100%" }}
            data={pharmacyProdutcs?.data?.products}
            isLoading={productsLoading}
            search={search}
            setsearch={handleSearchOnChange}
            reFetch={refetchProdutcs}
            trayItemKeys={["drugName", "brandName", "availableQuantity"]}
            traySx={{ minWidth: "25vw", bottom: "-125px" }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextInput
            title="Generic Name"
            value={values.genericName}
            name="genericName"
            handleChange={handleChange}
            disabled="true"
            readOnly
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <CustomTextInput
            title="Amount (Number of Tablets/Drugs)"
            value={values.amount}
            name="amount"
            handleChange={handleChange}
            placeholder="Enter Amount"
            type="number"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomSelect
            options={frequencyEnum}
            label="Frequency"
            state={values.frequency}
            handleChange={handleChange}
            name="frequency"
            haveTopLabel={true}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomSelect
            options={routeOfAdminEnum}
            label="Route of administration(e.g Oral/Injection)"
            state={values.routeOfAdmin}
            handleChange={handleChange}
            name="routeOfAdmin"
            haveTopLabel={true}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextInput
            title="Duration (Number of days)"
            value={values.duration}
            name="duration"
            handleChange={handleChange}
            type="number"
            inputProps={{ inputProps: { min: 0 } }}
            placeholder="Enter number of days here"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <CustomSelect
            options={foodRelationEnum}
            label="Food Relation"
            state={values.foodRelation}
            handleChange={handleChange}
            name="foodRelation"
            haveTopLabel={true}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomTextInput
            title="Instructions"
            value={values.notes}
            name="notes"
            handleChange={handleChange}
            placeholder="Add an instruction"
            multiline={true}
          />
        </Grid>
      </Grid>
      <CustomButton
        text={"Add"}
        color="secondary"
        sx={{ mt: 2 }}
        startIcon={<AddIcon />}
        onClick={handleAdd}
      />
      <Stack
        direction={"row"}
        spacing={1}
        justifyContent="space-between"
        sx={{ mt: 3, width: { xs: "100%" } }}
      >
        <Stack direction={"row"} spacing={1}>
          <CustomButton
            text={"Proceed"}
            sx={{ width: "100%" }}
            onClick={mutate}
            disabled={isLoading}
          />
          <CustomButton
            text={"Next"}
            onClick={handleNext}
            variant="containedBrown"
            sx={{ width: "100%" }}
          />
        </Stack>
        <CustomButton
          text={"Done"}
          onClick={postVisitItem}
          disabled={postVisitItemLoading || !isActiveVisit}
        />
      </Stack>
    </Box>
  );
}

export default React.memo(Prescription);
