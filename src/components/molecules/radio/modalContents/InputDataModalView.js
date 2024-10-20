import {
  Box,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import React, { useMemo } from "react";

import CustomTextInput from "components/atoms/CustomTextInput";
import { v4 as uuidv4 } from "uuid";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import CustomModal from "components/atoms/CustomModal";
import CancelIcon from "@mui/icons-material/Cancel";
import { red } from "@mui/material/colors";
import InputDataStockTable from "components/molecules/tabels/radio/InputDataStockTable";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { GET_RADIOLOGY_TEST_INFO, GET_TEST_INFO } from "utils/reactQueryKeys";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import FileUploadButton from "components/atoms/FileUploadButton";
import CustomSelect from "components/atoms/Select";
import { type } from "@testing-library/user-event/dist/type";
import ColorCodeChip from "components/atoms/ColorCodeChip";

const Details = ({ title, desc }) => {
  return (
    <Stack
      direction={"column"}
      spacing={1}
      alignItems={"flex-start"}
      justifyContent="center"
    >
      <Typography variant="caption" sx={{ opacity: 0.7 }}>
        {title}
      </Typography>
      <Typography textTransform={"capitalize"} variant="body1">
        {desc}
      </Typography>
    </Stack>
  );
};
const formatApiData = (testResultFields, otherFields) => {
  let testResultObj = {};
  // const formData = new FormData();
  // testResultFields.forEach((result) => {
  //   testResultObj[result.name] = result.value;
  // });

  testResultFields.forEach((result) => {
    testResultObj[result.name] = {
      value: result.value,
    };
  });
  // if (otherFields.files.length) {
  //   formData.append("dynamicFields", testResultObj);
  //   formData.append("resultSummary", otherFields.comment);

  //   otherFields.files.forEach((file) => formData.append("resultFiles", file));

  //   return formData;
  // }

  return {
    dynamicFields: testResultObj,
    resultSummary: otherFields.comment,
  };
};
const formatCompleteInvestigationData = (stockUsed) => {
  const formatStockUsed = stockUsed.map((stock) => ({
    item: stock.item,
    quantity: +stock.quantity,
  }));
  return {
    stockUsed: formatStockUsed,
  };
};
function InputDataModalView({ handleClose, modalData }) {
  const modalRef = React.useRef(null);
  const queryClient = useQueryClient();
  const [modalFormsState, setmodalFormsState] = React.useState({
    name: "",
  });
  const [testResultFields, settestResultFields] = React.useState([]);
  const [otherFields, setotherFields] = React.useState({
    comment: "",
    files: [],
  });

  React.useMemo(() => {
    if (modalData?.test?.otherFields)
      settestResultFields(modalData?.test?.otherFields);
  }, [modalData?.test?.otherFields]);
  const [stockUsed, setstockUsed] = React.useState([]);

  //complete investigation data
  const { mutateAsync: completeTest, isLoading: completeTestLoading } =
    useCustomMutation(
      {
        url: `/radiology/complete-investigation/${modalData._id}`,
        method: "patch",
        data: {
          ...formatCompleteInvestigationData(stockUsed),
        },
        avoidCancelling: false,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(GET_RADIOLOGY_TEST_INFO);
          toast.success("Success");
          handleClose();
        },

        onError: (error) => {
          toast.error(error.message);
        },
      }
    );

  //fill investigation report
  const {
    mutateAsync: fillInvestigationResult,
    isLoading: fillInvestigationResultLoading,
  } = useCustomMutation(
    {
      url: `/investigation/fill-investigation-result/${modalData._id}`,
      method: "patch",
      data: formatApiData(testResultFields, otherFields),
      avoidCancelling: false,
    },
    {
      onSuccess: () => {
        completeTest();
      },

      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
  //upload investigation report
  const { mutateAsync: uploadFiles, isLoading: uploadFilesLoading } =
    useCustomMutation(
      {
        url: `/investigation/upload-investigation-result-files/${modalData._id}`,
        method: "patch",
        avoidCancelling: false,
      },
      {
        onSuccess: () => {
          fillInvestigationResult();
        },

        onError: (error) => {
          toast.error(error.message);
        },
      }
    );

  const submitReport = async () => {
    if (otherFields.files.length) {
      const formData = new FormData();
      otherFields.files.forEach((file) => {
        formData.append("resultFiles", file);
      });
      uploadFiles(formData);
    } else {
      fillInvestigationResult();
    }
  };

  const handleChange = (i, e) => {
    settestResultFields((prev) => {
      const copy = [...prev];
      const field = copy[i];
      const fieldWithvalue = {
        ...field,
        value: e.target.value,
      };
      copy[i] = fieldWithvalue;
      return copy;
    });
  };
  const handleChangeStockDetail = (i, e) => {
    setstockUsed((prev) => {
      const copy = [...prev];
      const field = copy[i];
      const fieldWithvalue = {
        ...field,
        [e.target.name]: e.target.value,
      };
      copy[i] = fieldWithvalue;
      return copy;
    });
  };
  const handleDeleteStock = (uid) => {
    setstockUsed(() => {
      const data = stockUsed.filter((result) => result.uid !== uid);
      return data;
    });
  };
  const handleDeleteTestResultField = (id) => {
    settestResultFields(() => {
      const data = testResultFields.filter((result) => result.id !== id);
      return data;
    });
  };

  const openModal = () => {
    modalRef?.current?.handleToggle();
  };

  const handleAddNewField = () => {
    if (!modalFormsState.name) return toast.error("Please add a name");

    const newRow = {
      id: uuidv4(),
      value: "",
      addedFromInputDataModal: true,
      ...modalFormsState,
    };
    settestResultFields((prev) => {
      return [...prev, newRow];
    });
    setmodalFormsState({
      name: "",
    });
    openModal();
  };
  const handleAddStock = () => {
    const newRow = {
      uid: uuidv4(),
      item: "",
      // unit: "",
      quantity: "",
    };
    setstockUsed((prev) => {
      return [...prev, newRow];
    });
  };
  const handleCompleteTest = () => {
    fillInvestigationResult();
    // completeTest();
  };

  const handleFileChange = (files) => {
    setotherFields((prev) => {
      return {
        ...prev,
        files: [...prev.files, ...Array.from(files)],
      };
    });
  };

  const handleDeleteFile = (fileName) => {
    setotherFields((prev) => {
      const data = prev.files.filter((file) => file.name !== fileName);
      return {
        ...prev,
        files: data,
      };
    });
  };
  const handleModalFormChange = (e) => {
    setmodalFormsState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <>
      <Stack
        direction={"column"}
        spacing={3}
        sx={{ width: "100%", mt: 3, p: 3 }}
      >
        <Stack direction={"column"} spacing={1}>
          <Typography variant="displayMd">Input Data</Typography>
          <Typography>{modalData?.test?.testName}</Typography>
        </Stack>

        <Divider />
        <Stack
          direction={"row"}
          spacing={2}
          alignItems={"center"}
          justifyContent="space-between"
          sx={{
            p: 2,
            borderRadius: "10px",
            backgroundColor: "background.gray3",

            width: "100%",
            border: "1px dashed rgba(0,0,0,0.5)",
          }}
        >
          <Stack direction={"row"} spacing={2}>
            <Details
              title="PATIENT NAME"
              desc={`${modalData?.patient?.firstName} ${modalData?.patient?.lastName}`}
            />
            <Details
              title="AGE/Gender"
              desc={`${modalData?.patient?.age}Yrs/${modalData?.patient?.gender}`}
            />
            <Details title="Unique id" desc={modalData?.patient?.ID} />
          </Stack>
        </Stack>
        <Stack direction={"row"} width="100%" justifyContent={"flex-end"}>
          {/* <CustomButton
            variant="containedBrown"
            text="Add New Field"
            startIcon={<AddCircleIcon color="primary" />}
            onClick={openModal}
          /> */}
        </Stack>
        <Grid container spacing={3} sx={{ mt: 1, width: "100%" }}>
          {testResultFields.map((field, i) => (
            <Grid key={field.id} item xs={12} sm={6}>
              <Stack>
                <Stack
                  direction={"row"}
                  alignItems="center"
                  justifyContent={"center"}
                  width="100%"
                  gap={1}
                >
                  <CustomTextInput
                    title={field.name}
                    value={field?.value || ""}
                    name={field.name}
                    handleChange={handleChange.bind(null, i)}
                    placeholder="Input value"
                    boxSx={{ width: "100% !important" }}
                  />
                  {field?.addedFromInputDataModal && (
                    <IconButton
                      onClick={handleDeleteTestResultField.bind(null, field.id)}
                      size="small"
                      sx={{ mt: "20px !important" }}
                    >
                      <CancelIcon sx={{ color: red[500], fontSize: "17px" }} />
                    </IconButton>
                  )}
                </Stack>
              </Stack>
            </Grid>
          ))}
        </Grid>
        <Stack gap={2}>
          <Typography
            sx={{ fontSize: "12px", fontWeight: "700", lineHeight: "16px" }}
          >
            File Document{" "}
          </Typography>
          {otherFields?.files?.map((file) => (
            <Stack
              key={file.name}
              direction={"row"}
              gap={1}
              alignItems={"center"}
            >
              <Typography>{file.name} </Typography>
              <IconButton
                onClick={handleDeleteFile.bind(null, file.name)}
                size="small"
              >
                <CancelIcon sx={{ color: red[500], fontSize: "17px" }} />
              </IconButton>
            </Stack>
          ))}
          <FileUploadButton
            accept="*"
            multiple={true}
            CustomButton={
              <CustomButton
                variant="containedBrown"
                text={"Add New Document"}
                startIcon={<AddCircleIcon color="primary" />}
              />
            }
            onFileChange={handleFileChange}
          />
        </Stack>
        <Stack spacing={1.5}>
          <Typography variant="heading">Stock usage</Typography>
          <InputDataStockTable
            data={stockUsed}
            handleChangeDetail={handleChangeStockDetail}
            handleDeleteStock={handleDeleteStock}
            handleAddStock={handleAddStock}
            investigationId={modalData?._id}
          />
        </Stack>

        <CustomTextInput
          title={"Summary/Comment"}
          value={otherFields?.comment || ""}
          name={"comment"}
          handleChange={(e) =>
            setotherFields((prev) => ({ ...prev, comment: e.target.value }))
          }
          placeholder="Text/Number goes in here"
          multiline
          rows={4}
        />

        <Stack spacing={2} width="20%">
          <CustomButton
            text={"Save"}
            color="secondary"
            onClick={submitReport}
            // onClick={handleCompleteTest}
            disabled={
              completeTestLoading ||
              fillInvestigationResultLoading ||
              uploadFilesLoading
            }
          />
        </Stack>
      </Stack>
      <CustomModal
        ref={modalRef}
        childrenContSx={{
          p: 3,
          pt: 5,
          height: "fit-content !important",
          minWidth: "30vw !important",
        }}
      >
        <Stack spacing={2}>
          <CustomTextInput
            title="Field Name"
            value={modalFormsState.name}
            name={"name"}
            handleChange={handleModalFormChange}
            boxSx={{ width: "100%" }}
            placeholder="Input field name"
          />

          <Box>
            <CustomButton
              text={"Add"}
              onClick={handleAddNewField}
              variant="contained"
              color="secondary"
            />
          </Box>
        </Stack>
      </CustomModal>
    </>
  );
}

export default InputDataModalView;
