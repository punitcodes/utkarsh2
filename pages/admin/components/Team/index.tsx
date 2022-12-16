import { useRef } from "react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Stack,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ReactSelect from "react-select";
import useSWRMutation from "swr/mutation";

import { axiosPost } from "libs";
import type { MandalFormOption, TForm } from "types";
import type { Team } from "@prisma/client";

interface Props {
  mandals: MandalFormOption[];
}

const schema: yup.SchemaOf<TForm<Team>> = yup
  .object({
    name: yup.string().min(3).max(20).required(),
    mandalId: yup.number().required(),
  })
  .required();

export default function TeamComponent({ mandals }: Props) {
  const toast = useToast();
  const mandalSelectRef = useRef<any>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      mandalId: undefined as number | undefined,
    },
  });

  const { trigger: createTeam } = useSWRMutation(
    "/api/team/create",
    axiosPost<{ mandalId: number }, any>
  );

  const onSubmit = handleSubmit(async (data) => {
    // @ts-ignore TODO: fix type
    await createTeam(data);

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
      <FormControl isInvalid={!!errors?.name}>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          placeholder="Enter team name"
          required={true}
          {...register("name")}
        />
        <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
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
