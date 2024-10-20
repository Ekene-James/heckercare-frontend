import { Box, Stack, Typography } from "@mui/material";
import CustomButton from "components/atoms/CustomButton";
import CustomTextInput from "components/atoms/CustomTextInput";
import React, { useMemo, useState } from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { useCustomMutation } from "store/hooks/react-query/mutate/useMutateFunc";
import { GET_SAMPLE_STANDARDS } from "utils/reactQueryKeys";

import ColorCodeChip from "components/atoms/ColorCodeChip";
import { fromCamelCase } from "utils/handleCamelse";

function SampleStandardsModal({ data, close }) {
  const queryClient = useQueryClient();
  const [form, setform] = useState({ lower: "", higher: "" });

  useMemo(() => {
    setform({ higher: data?.normal?.max, lower: data?.normal?.min });
  }, [data]);

  //edit sample standards
  const { mutate: editSampleStandards, isLoading: editSampleStandardsLoading } =
    useCustomMutation(
      {
        url: `/visit/item/vital-signs/settings`,
        method: "post",
        data: {
          [data.name]: {
            type: data.type,
            normal: {
              min: form.lower,
              max: form.higher,
            },
          },
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(GET_SAMPLE_STANDARDS);
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
  const handleChange = (e) => {
    setform((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <Stack spacing={3}>
      <Stack spacing={1.5}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: "700",
            fontSize: "14px",
            lineHeight: "14px",
            opacity: "0.5",
          }}
        >
          Set Vitals Range
        </Typography>
        <Typography
          variant="displaySm"
          sx={{
            fontWeight: "800",
            fontSize: "21px",
            lineHeight: "26px",
            textTransform: "capitalize",
          }}
        >
          {fromCamelCase(data.name)}
        </Typography>
      </Stack>

      <Stack>
        <Stack direction={"row"} alignItems={"center"} gap={2}>
          <Typography
            variant="displaySm"
            sx={{ fontWeight: "700", fontSize: "16px", lineHeight: "24px" }}
          >
            Normal Range
          </Typography>
          <ColorCodeChip type={"normal"} />
        </Stack>
        <Typography
          variant="displaySm"
          sx={{
            fontWeight: "400",
            fontSize: "14px",
            lineHeight: "18.2px",
            opacity: "0.5",
          }}
        >
          The established physiological range for healthy individuals.
        </Typography>

        <Stack
          alignItems={"center"}
          justifyContent={"center"}
          direction={"row"}
          gap={2}
        >
          <CustomTextInput
            title="Lower Limit"
            value={form.lower}
            name={"lower"}
            handleChange={handleChange}
            placeholder={"Enter Value"}
            variant="filled"
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

          {/* <ArrowRightAltIcon sx={{ opacity: "0.5" }} fontSize="30px" /> */}
          <CustomTextInput
            title="Higher Limit"
            value={form.higher}
            name={"higher"}
            handleChange={handleChange}
            placeholder={"Enter Value"}
            variant="filled"
          />
        </Stack>
      </Stack>

      <Stack>
        <CustomButton
          text={"Save Changes"}
          color="secondary"
          onClick={editSampleStandards}
          sx={{ width: "fit-content" }}
          disabled={editSampleStandardsLoading}
        />
      </Stack>
    </Stack>
  );
}

export default SampleStandardsModal;
