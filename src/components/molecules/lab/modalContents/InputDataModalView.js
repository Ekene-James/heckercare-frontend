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
import InputDataStockTable from "components/molecules/tabels/lab/InputDataStockTable";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { GET_TEST_INFO } from "utils/reactQueryKeys";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
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
const formatApiData = (testResultFields) => {
  let testResultObj = {};
  testResultFields.forEach((result) => {
    testResultObj[result.name] = {
      value: result.value,
      range: {
        type: result.type === "text" ? "text" : "digit",
        normal:
          result.type === "text"
            ? result.textVal
            : {
                min: result.lower,
                max: result.higher,
              },
      },
    };
  });
  //   testResultFields?.forEach((result) => {
  //     testResultObj[result.name] = {
  //       name: result.name,
  //       value: result.value,
  //       type: result.type === "text" ? "text" : "digit",
  //       textRange: result?.textVal,
  //       min: result?.lower,
  //       max: result?.higher,
  //     };
  //   }
  // );

  return {
    dynamicFields: testResultObj,
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
  const queryClient = useQueryClient();

  const [testResultFields, settestResultFields] = React.useState([]);

  React.useMemo(() => {
    if (modalData?.test?.otherFields) {
      const formattedData = modalData?.test?.otherFields.map((field) => {
        const [fieldType] = Object.entries(field);
        const fieldName = fieldType[0];
        const fieldVal = fieldType[1];

        return {
          name: fieldName,
          value: "",
          type: fieldVal?.range?.type === "digit" ? "number" : "text",
          textVal:
            fieldVal?.range?.type === "text" ? fieldVal?.range?.normal : "",
          higher:
            fieldVal?.range?.type === "digit" ? fieldVal?.range?.normal.max : 0,
          lower:
            fieldVal?.range?.type === "digit" ? fieldVal?.range?.normal.min : 0,
        };
      });

      settestResultFields(formattedData, modalData?.test?.otherFields);
    }
  }, [modalData?.test?.otherFields]);
  const [stockUsed, setstockUsed] = React.useState([]);

  //complete investigation data
  const { mutate: completeTest, isLoading: completeTestLoading } =
    useCustomMutation(
      {
        url: `/laboratory/complete-investigation/${modalData._id}`,
        method: "patch",
        data: formatCompleteInvestigationData(stockUsed),
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(GET_TEST_INFO);
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
    mutate: fillInvestigationResult,
    isLoading: fillInvestigationResultLoading,
  } = useCustomMutation(
    {
      url: `/investigation/fill-investigation-result/${modalData._id}`,
      method: "patch",
      data: formatApiData(testResultFields),
    },
    {
      onSuccess: () => {
        completeTest();
        // queryClient.invalidateQueries(GET_TEST_INFO);
        // toast.success("Success");
        // handleClose();
      },

      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

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

        <Grid container spacing={4} rowGap={2} sx={{ mt: 1, width: "100%" }}>
          {testResultFields.map((field, i) => (
            <Grid key={field.name} item xs={12} sm={6}>
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
                </Stack>
                {field?.type && (
                  <>
                    {field?.type === "number" ? (
                      <Stack mt={2}>
                        <Stack direction={"row"} alignItems={"center"} gap={2}>
                          <Typography
                            variant="displaySm"
                            sx={{
                              fontWeight: "700",
                              fontSize: "13px",
                            }}
                          >
                            Normal Range
                          </Typography>
                          <ColorCodeChip
                            type={"normal"}
                            style={{ height: "20px", width: "50px" }}
                          />
                        </Stack>
                        <Typography
                          variant="displaySm"
                          sx={{
                            fontWeight: "400",
                            fontSize: "10px",
                            opacity: "0.5",
                          }}
                        >
                          The established physiological range for healthy
                          individuals.
                        </Typography>

                        <Stack
                          alignItems={"center"}
                          justifyContent={"center"}
                          direction={"row"}
                          gap={2}
                        >
                          <CustomTextInput
                            title="Lower Limit"
                            value={field.lower}
                            name={"lower"}
                            type="number"
                            disabled="true"
                            readOnly
                          />
                          <Box sx={{ mt: 3 }}>
                            <svg
                              width="33"
                              height="13"
                              viewBox="0 0 33 13"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1 5.5C0.447715 5.5 0 5.94772 0 6.5C0 7.05228 0.447715 7.5 1 7.5V5.5ZM33 6.5L23 0.726497V12.2735L33 6.5ZM1 7.5H24V5.5H1V7.5Z"
                                fill="#D9D9D9"
                              />
                            </svg>
                          </Box>

                          <CustomTextInput
                            title="Higher Limit"
                            value={field.higher}
                            name={"higher"}
                            type="number"
                            disabled="true"
                            readOnly
                          />
                        </Stack>
                      </Stack>
                    ) : (
                      <Stack mt={4.5}>
                        <Typography
                          variant="displaySm"
                          sx={{
                            fontWeight: "400",
                            fontSize: "10px",
                            opacity: "0.5",
                          }}
                        >
                          The established physiological range for healthy
                          individuals.
                        </Typography>

                        <Stack
                          alignItems={"center"}
                          justifyContent={"center"}
                          direction={"row"}
                          gap={2}
                          mt={3}
                        >
                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            gap={2}
                          >
                            <Typography
                              variant="displaySm"
                              sx={{
                                fontWeight: "700",
                                fontSize: "13px",
                                textWrap: "nowrap",
                              }}
                            >
                              Normal Range
                            </Typography>
                            <ColorCodeChip
                              type={"normal"}
                              style={{ height: "40px", width: "50px" }}
                            />
                          </Stack>
                          <Box>
                            <svg
                              width="33"
                              height="13"
                              viewBox="0 0 33 13"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1 5.5C0.447715 5.5 0 5.94772 0 6.5C0 7.05228 0.447715 7.5 1 7.5V5.5ZM33 6.5L23 0.726497V12.2735L33 6.5ZM1 7.5H24V5.5H1V7.5Z"
                                fill="#D9D9D9"
                              />
                            </svg>
                          </Box>
                          <CustomTextInput
                            value={field.textVal}
                            name={"textVal"}
                            disabled="true"
                            readOnly
                          />
                        </Stack>
                      </Stack>
                    )}
                  </>
                )}
              </Stack>
            </Grid>
          ))}
        </Grid>
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

        <Stack spacing={2} width="20%">
          <CustomButton
            text={"Save"}
            color="secondary"
            onClick={handleCompleteTest}
            disabled={completeTestLoading || fillInvestigationResultLoading}
          />
        </Stack>
      </Stack>
    </>
  );
}

export default InputDataModalView;
