import { useRef } from "react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Stack,
  Button,
  Box,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ReactSelect from "react-select";
import DatePicker from "react-datepicker";
import useSWRMutation from "swr/mutation";

import { axiosPost } from "libs";
import type { MandalFormOption, TForm } from "types";
import type { Sabha } from "@prisma/client";

import "react-datepicker/dist/react-datepicker.css";

interface Props {
  mandals: MandalFormOption[];
}

const schema: yup.SchemaOf<TForm<Sabha>> = yup
  .object({
    date: yup.date().required(),
    mandalId: yup.number().required(),
  })
  .required();

export default function SabhaComponent({ mandals }: Props) {
  const toast = useToast();
  const mandalSelectRef = useRef<any>(null);

  const {
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      date: new Date(),
      mandalId: undefined as number | undefined,
    },
  });

  const { trigger: createSabha } = useSWRMutation(
    "/api/sabha/create",
    axiosPost<{ mandalId: number }, any>
  );

  const onSubmit = handleSubmit(async (data) => {
    // @ts-ignore TODO: fix type
    await createSabha(data);

    toast({
      title: "Success",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    reset();
    mandalSelectRef.current?.clearValue();
  });

  return (
    <Stack as="form" spacing="4" onSubmit={onSubmit}>
      <FormControl isInvalid={!!errors?.date}>
        <FormLabel>Date</FormLabel>
        <Box
          sx={{
            border: "2px solid",
            borderColor: "inherit",
            borderRadius: "md",
            p: 2,
          }}
        >
          <DatePicker
            className="date-picker"
            selected={new Date()}
            onChange={(date: Date) => setValue("date", date)}
            required={true}
            wrapperClassName="date-picker-wrapper"
          />
        </Box>
        <FormErrorMessage>{errors?.date?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors?.mandalId}>
        <FormLabel>Select Mandal</FormLabel>
        <ReactSelect
          ref={mandalSelectRef}
          options={mandals}
          onChange={(e) => !!e?.value && setValue("mandalId", e.value)}
          isSearchable
          required
        />
        <FormErrorMessage>{errors?.mandalId?.message}</FormErrorMessage>
      </FormControl>

      <Button type="submit" disabled={Object.keys(errors).length > 0}>
        Create
      </Button>
    </Stack>
  );
}
