import { useRef } from "react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Stack,
  Button,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useSWRMutation from "swr/mutation";

import { axiosPost } from "libs";
import type { MandalFormOption, TForm } from "types";
import type { Mandal } from "@prisma/client";

import "react-datepicker/dist/react-datepicker.css";

interface Props {
  mandals: MandalFormOption[];
}

const schema: yup.SchemaOf<TForm<Mandal>> = yup
  .object({
    name: yup.string().min(3).max(20).required(),
  })
  .required();

export default function MandalComponent({ mandals }: Props) {
  const toast = useToast();

  const {
    handleSubmit,
    formState: { errors },
    reset,
    register,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  const { trigger: createMandal } = useSWRMutation(
    "/api/mandal/create",
    axiosPost<{ name: string }, any>
  );

  const onSubmit = handleSubmit(async (data) => {
    // @ts-ignore TODO: fix type
    await createMandal(data);

    toast({
      title: "Success",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    reset();
  });

  return (
    <Stack as="form" spacing="4" onSubmit={onSubmit}>
      <FormControl isInvalid={!!errors?.name}>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          placeholder="Enter mandal name"
          required={true}
          {...register("name")}
        />
        <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
      </FormControl>

      <Button type="submit" disabled={Object.keys(errors).length > 0}>
        Create
      </Button>
    </Stack>
  );
}
