import { useMemo } from "react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Stack,
  Button,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ReactSelect from "react-select";
import useSWRMutation from "swr/mutation";
import axios, { AxiosResponse } from "axios";

import { axiosPost } from "libs";
import type { MandalFormOption, TForm } from "types";
import type { Yuvak, Team, YuvakRole } from "@prisma/client";

const yuvakRoles: { value: YuvakRole; label: string }[] = [
  {
    value: "YUVAK",
    label: "Yuvak",
  },
  {
    value: "LEADER",
    label: "Leader",
  },
  {
    value: "MENTOR",
    label: "Mentor",
  },
];

const getTeamsFunc = (
  url: string,
  { arg }: { arg: { mandalId: number } }
): Promise<AxiosResponse<Team[], any>> => axios.post(url, arg);

// @ts-ignore fix type
const schema: yup.SchemaOf<TForm<Yuvak>> = yup
  .object({
    name: yup.string().min(3).max(20).required(),
    phone: yup.string().min(10).max(10),
    role: yup.string().oneOf(["YUVAK", "LEADER", "MENTOR"]).required(),
    mandalId: yup.number().required(),
    teamId: yup.number().required(),
  })
  .required();

interface Props {
  mandals: MandalFormOption[];
}

export default function YuvakComponent({ mandals }: Props) {
  const { trigger: getTeams, data: teams } = useSWRMutation(
    "/api/team/get-list",
    axiosPost<{ mandalId: number }, Team[]>
  );

  const { trigger: createYuvak } = useSWRMutation(
    "/api/team/create",
    axiosPost<TForm<Yuvak>, any>
  );

  const teamsOptions: { value: number; label: string }[] = useMemo(() => {
    if (teams && teams.data.length > 0) {
      return teams?.data.map(({ id, name }: { id: number; name: string }) => ({
        value: id,
        label: name,
      }));
    }

    return [];
  }, [teams]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      phone: null,
      role: "YUVAK" as YuvakRole,
      mandalId: mandals[0].value,
      teamId: teamsOptions?.[0]?.value,
    },
  });

  const handleMandalChange = async (e: MandalFormOption | null) => {
    if (!e?.value) return;

    setValue("mandalId", e.value);

    getTeams({ mandalId: e.value });
  };

  const onSubmit = handleSubmit(async (data) => {
    const result = await createYuvak(data);

    // TODO: add notification
    console.log("result --->", result);
  });

  return (
    <Stack as="form" spacing="4" onSubmit={onSubmit}>
      <FormControl isInvalid={!!errors?.name}>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          placeholder="Enter yuvak name"
          required={true}
          {...register("name")}
        />
        <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors?.phone}>
        <FormLabel>Phone</FormLabel>
        <Input
          type="text"
          placeholder="Enter phone number"
          {...register("phone")}
        />
        <FormErrorMessage>{errors?.phone?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors?.role}>
        <FormLabel>Role</FormLabel>
        <ReactSelect
          options={yuvakRoles}
          onChange={(e) => !!e?.value && setValue("role", e.value)}
          required
        />
        <FormErrorMessage>{errors?.role?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors?.role}>
        <FormLabel>Select Mandal</FormLabel>
        <ReactSelect options={mandals} onChange={handleMandalChange} required />
        <FormErrorMessage>{errors?.role?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors?.teamId}>
        <FormLabel>Select Team</FormLabel>
        <ReactSelect
          options={teamsOptions}
          onChange={(e) => !!e?.value && setValue("teamId", e.value)}
          required
        />
        <FormErrorMessage>{errors?.teamId?.message}</FormErrorMessage>
      </FormControl>

      <Button type="submit" disabled={Object.keys(errors).length > 0}>
        Create
      </Button>
    </Stack>
  );
}
