import { Box, Grid, IconButton, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import React, { useMemo, useState } from "react";
import VerifiedIcon from "@mui/icons-material/Verified";
import CustomTextInput from "components/atoms/CustomTextInput";
import CustomSelect from "components/atoms/Select";
import { GET_PACKAGES, GET_TEST_LIST } from "utils/reactQueryKeys";
import { useCustomQuery } from "store/hooks/react-query/query/useQuery";
import { toast } from "react-toastify";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { useQueryClient } from "react-query";
import CustomAccordion from "components/atoms/CustomAccordion";
const initialState = {
  title: "",
  summary: "",
  name: "",
  amount: "",
};
const calculateAmount = (tests) => {
  return tests.map((test) => test?.rate).reduce((a, b) => a + b, 0);
};
function AddPackages({
  close,
  typeText,
  disableFields = false,
  clickedCard = {},
}) {
  const [form, setform] = useState(initialState);
  const [summaryArr, setsummaryArr] = useState([]);
  const [testArr, settestArr] = useState([]);

  const queryClient = useQueryClient();

  useMemo(() => {
    if (Object.keys(clickedCard).length) {
      setform({ name: clickedCard.name, amount: clickedCard.amount });
      setsummaryArr(clickedCard?.examinations);
      settestArr(
        clickedCard?.tests.map((test) => ({
          ...test,
          name: test?.testName,
          value: test._id,
        }))
      );
    }
  }, [clickedCard]);

  // // calculate amount
  // useMemo(() => {
  //   const amount = calculateAmount(testArr);
  //   setform((prev) => ({ ...prev, amount }));
  // }, [testArr]);

  const handleChange = (e) => {
    setform({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  //edit transaction type
  const { mutate: editTransactionType, isLoading: editTransactionTypeLoading } =
    useCustomMutation(
      {
        url: `/package/${clickedCard?._id}`,
        method: "patch",
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(GET_PACKAGES);
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

  //create package
  const { mutate: createPackage, isLoading: createPackageLoading } =
    useCustomMutation(
      {
        url: `/package`,
        method: "post",
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(GET_PACKAGES);
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

  //get lab

  const { data: testList } = useCustomQuery(
    [GET_TEST_LIST, { departmentType: "LABORATORY" }],
    {
      url: `/test?departmentType=LABORATORY`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      select: (data) =>
        data?.data?.map((d) => {
          return {
            name: d.testName,
            value: d._id,
            rate: d.rate,
            duration: d.duration,
          };
        }),
    }
  );
  // get radiology
  const { data: radiologyList } = useCustomQuery(
    [GET_TEST_LIST, { departmentType: "RADIOLOGY" }],
    {
      url: `/test?departmentType=RADIOLOGY`,
      method: "get",
    },
    {
      refetchOnWindowFocus: false,
      select: (data) =>
        data?.data?.map((d) => {
          return {
            name: d.testName,
            value: d._id,
            rate: d.rate,
            duration: d.duration,
          };
        }),
    }
  );

  const saveExaminations = (e) => {
    e.preventDefault();
    if (!form.title || !form.summary)
      return toast.error("Please fill all fields");
    setsummaryArr((prev) => [...prev, form]);
    setform((prev) => ({ ...prev, summary: "", title: "" }));
  };
  const deleteExamination = (title) => {
    setsummaryArr((prev) => prev.filter((exam) => exam.title !== title));
  };
  const deleteTest = (id) => {
    const filteredTest = testArr.filter((test) => test.value !== id);
    const amount = calculateAmount(filteredTest);
    setform((prev) => ({ ...prev, amount }));
    settestArr(filteredTest);
  };
  const handleSelectTest = (e) => {
    const id = e.target.value;
    const doesExist = testArr.some((test) => test.value === id);
    if (doesExist) return;

    const selectedTest = testList.find((test) => test.value === id);

    const amount = calculateAmount([...testArr, selectedTest]);
    setform((prev) => ({ ...prev, amount }));

    settestArr((prev) => [...prev, selectedTest]);
  };
  const handleSelectTest1 = (e) => {
    const id = e.target.value;
    const doesExist = testArr.some((test) => test.value === id);
    if (doesExist) return;

    const selectedTest = radiologyList.find((test) => test.value === id);

    const amount = calculateAmount([...testArr, selectedTest]);
    setform((prev) => ({ ...prev, amount }));
    settestArr((prev) => [...prev, selectedTest]);
  };

  return (
    <Stack spacing={3}>
      <Stack spacing={1.5}>
        <Typography variant="displaySm">{typeText}</Typography>
      </Stack>
      <form onSubmit={saveExaminations}>
        <Stack>
          <CustomTextInput
            title="Package"
            value={form.name}
            name={"name"}
            handleChange={handleChange}
            placeholder={"Enter Package Name"}
            disabled={disableFields ? "true" : "false"}
            readOnly={disableFields}
          />
          <Box mt={2} mb={2}>
            <Typography
              variant="displaySm"
              sx={{ fontSize: "1rem", lineHeight: "24px" }}
            >
              Physical Examination
            </Typography>
          </Box>

          <CustomTextInput
            title="Examination Title"
            value={form.title}
            name={"title"}
            handleChange={handleChange}
            placeholder={"Enter Title"}
            disabled={disableFields ? "true" : "false"}
            readOnly={disableFields}
          />
          <CustomTextInput
            title="Description"
            value={form.summary}
            name="summary"
            handleChange={handleChange}
            placeholder="Enter description"
            multiline
            rows={6}
            helperText={`${form?.summary?.length || 0}/200`}
            disabled={disableFields ? "true" : "false"}
            readOnly={disableFields}
          />
        </Stack>
        <CustomButton
          text={"Save"}
          color="secondary"
          type={"submit"}
          variant="lightSecondary"
          sx={{ width: "fit-content" }}
          disabled={disableFields}
        />
      </form>
      <Stack gap={3}>
        {summaryArr.length ? (
          <Typography
            variant="displaySm"
            sx={{ fontSize: "14px", lineHeight: "14px" }}
          >
            Summary
          </Typography>
        ) : null}

        {summaryArr.map((summary) => (
          <CustomAccordion
            key={summary.title}
            item={{
              titleSx: {
                width: {
                  xs: "150px",
                  md: "350px",
                },
              },
              bgColor: "transparent",
              title: summary.title,
              changeOnExpanded: false,
              detailsComponent: (
                <Stack
                  gap={1}
                  alignItems={"flex-start"}
                  justifyContent={"flex-start"}
                  p={{
                    xs: 2,
                    md: 4,
                  }}
                  sx={{ m: 0, pt: 0 }}
                >
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    width={"100%"}
                    alignItems={"flex-start"}
                  >
                    <Typography
                      sx={{
                        fontSize: "14px",
                        lineHeight: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      Description
                    </Typography>
                    <IconButton
                      onClick={() => deleteExamination(summary.title)}
                      disabled={disableFields}
                    >
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 17 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          opacity: disableFields ? 0.4 : 1,
                        }}
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M6.60959 4.27273C6.60959 4.13286 6.71999 4.01948 6.85616 4.01948H10.1438C10.28 4.01948 10.3904 4.13286 10.3904 4.27273V4.94805C10.3904 5.08791 10.28 5.2013 10.1438 5.2013H6.85617C6.71999 5.2013 6.60959 5.08791 6.60959 4.94805V4.27273ZM5.14762 5.2013C5.1361 5.11859 5.13014 5.03403 5.13014 4.94805V4.27273C5.13014 3.29368 5.90291 2.5 6.85616 2.5H10.1438C11.0971 2.5 11.8699 3.29368 11.8699 4.27273V4.94805C11.8699 5.03403 11.8639 5.11859 11.8524 5.2013H12.4452H13.7603C14.1688 5.2013 14.5 5.54144 14.5 5.96104C14.5 6.38063 14.1688 6.72078 13.7603 6.72078H13.1849V13.7273C13.1849 14.7063 12.4122 15.5 11.4589 15.5H5.63252C4.6874 15.5 3.91804 14.7193 3.90662 13.7487L3.82395 6.72078H3.23973C2.83119 6.72078 2.5 6.38063 2.5 5.96104C2.5 5.54144 2.83119 5.2013 3.23973 5.2013H4.55479H5.14762ZM6.85617 6.72078H5.30351L5.38597 13.7303C5.3876 13.869 5.49751 13.9805 5.63252 13.9805H11.4589C11.5951 13.9805 11.7055 13.8671 11.7055 13.7273V6.72078H10.1438H6.85617ZM7.92466 7.98701C7.92466 7.56742 7.59347 7.22727 7.18493 7.22727C6.77639 7.22727 6.44521 7.56742 6.44521 7.98701V12.039C6.44521 12.4585 6.77639 12.7987 7.18493 12.7987C7.59347 12.7987 7.92466 12.4585 7.92466 12.039V7.98701ZM9.81507 7.22727C10.2236 7.22727 10.5548 7.56742 10.5548 7.98701V12.039C10.5548 12.4585 10.2236 12.7987 9.81507 12.7987C9.40653 12.7987 9.07534 12.4585 9.07534 12.039V7.98701C9.07534 7.56742 9.40653 7.22727 9.81507 7.22727Z"
                          fill="#DB1E36"
                        />
                      </svg>
                    </IconButton>
                  </Stack>
                  <Box
                    sx={{
                      border: "1px solid rgba(0,0,0,0.2)",
                      p: 3,
                      borderRadius: "3px",
                      width: "100%",
                      opacity: disableFields ? 0.8 : 1,
                    }}
                  >
                    <Typography variant="body2">{summary.summary}</Typography>
                  </Box>
                </Stack>
              ),
            }}
          />
        ))}
      </Stack>
      <Stack gap={2}>
        <Typography
          variant="displaySm"
          sx={{ fontSize: "1rem", lineHeight: "24px" }}
        >
          Select Applicable/Corresponding Test
        </Typography>
        <CustomSelect
          options={testList}
          label="Laboratory"
          handleChange={handleSelectTest}
          name="testName"
          haveTopLabel={true}
          placeholder="Select from list of test"
          disabled={disableFields}
        />
        <CustomSelect
          options={radiologyList}
          label="Radio"
          handleChange={handleSelectTest1}
          name="testName"
          haveTopLabel={true}
          placeholder="Select from list of test"
          disabled={disableFields}
        />
      </Stack>

      <Grid container rowSpacing={1} sx={{ width: "100%" }}>
        {testArr.length ? (
          <Grid item xs={12}>
            <Typography
              variant="displaySm"
              sx={{ fontSize: "14px", lineHeight: "14px" }}
            >
              Summary
            </Typography>
          </Grid>
        ) : null}
        {testArr.map((test) => (
          <Grid key={test.value} item xs={12} sm={6}>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              width={"100%"}
              alignItems={"center"}
            >
              <Typography
                sx={{ fontSize: "14px", lineHeight: "14px", opacity: 0.8 }}
              >
                {test.name}
              </Typography>

              <IconButton
                onClick={() => deleteTest(test.value)}
                disabled={disableFields}
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 17 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    opacity: disableFields ? 0.4 : 1,
                  }}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.60959 4.27273C6.60959 4.13286 6.71999 4.01948 6.85616 4.01948H10.1438C10.28 4.01948 10.3904 4.13286 10.3904 4.27273V4.94805C10.3904 5.08791 10.28 5.2013 10.1438 5.2013H6.85617C6.71999 5.2013 6.60959 5.08791 6.60959 4.94805V4.27273ZM5.14762 5.2013C5.1361 5.11859 5.13014 5.03403 5.13014 4.94805V4.27273C5.13014 3.29368 5.90291 2.5 6.85616 2.5H10.1438C11.0971 2.5 11.8699 3.29368 11.8699 4.27273V4.94805C11.8699 5.03403 11.8639 5.11859 11.8524 5.2013H12.4452H13.7603C14.1688 5.2013 14.5 5.54144 14.5 5.96104C14.5 6.38063 14.1688 6.72078 13.7603 6.72078H13.1849V13.7273C13.1849 14.7063 12.4122 15.5 11.4589 15.5H5.63252C4.6874 15.5 3.91804 14.7193 3.90662 13.7487L3.82395 6.72078H3.23973C2.83119 6.72078 2.5 6.38063 2.5 5.96104C2.5 5.54144 2.83119 5.2013 3.23973 5.2013H4.55479H5.14762ZM6.85617 6.72078H5.30351L5.38597 13.7303C5.3876 13.869 5.49751 13.9805 5.63252 13.9805H11.4589C11.5951 13.9805 11.7055 13.8671 11.7055 13.7273V6.72078H10.1438H6.85617ZM7.92466 7.98701C7.92466 7.56742 7.59347 7.22727 7.18493 7.22727C6.77639 7.22727 6.44521 7.56742 6.44521 7.98701V12.039C6.44521 12.4585 6.77639 12.7987 7.18493 12.7987C7.59347 12.7987 7.92466 12.4585 7.92466 12.039V7.98701ZM9.81507 7.22727C10.2236 7.22727 10.5548 7.56742 10.5548 7.98701V12.039C10.5548 12.4585 10.2236 12.7987 9.81507 12.7987C9.40653 12.7987 9.07534 12.4585 9.07534 12.039V7.98701C9.07534 7.56742 9.40653 7.22727 9.81507 7.22727Z"
                    fill="#DB1E36"
                  />
                </svg>
              </IconButton>
            </Stack>
          </Grid>
        ))}
      </Grid>
      <CustomTextInput
        title="Amount"
        value={form.amount || 0}
        name={"amount"}
        handleChange={handleChange}
        disabled={"true"}
        readOnly={true}
        sx={{
          width: {
            md: "50%",
          },
        }}
      />
      <Stack>
        <CustomButton
          text={typeText === "Add New" ? "Save" : "Save Changes"}
          color="secondary"
          onClick={() =>
            typeText === "Add New"
              ? createPackage({
                  name: form.name,
                  amount: +form.amount,
                  tests: testArr.map((test) => test.value),
                  examinations: summaryArr.map((summary) => ({
                    title: summary.title,
                    summary: summary.summary,
                  })),
                })
              : editTransactionType({
                  name: form.name,
                  amount: +form.amount,
                  tests: testArr.map((test) => test.value),
                  examinations: summaryArr.map((summary) => ({
                    title: summary.title,
                    summary: summary.summary,
                  })),
                })
          }
          sx={{ width: "fit-content" }}
          disabled={
            editTransactionTypeLoading || createPackageLoading || disableFields
          }
        />
      </Stack>
    </Stack>
  );
}

export default AddPackages;
