import { Stack } from "@chakra-ui/react";
import { useState } from "react";
import ReactSelect, { SingleValue } from "react-select";
import useSWRMutation from "swr/mutation";

import { axiosPost } from "libs";

import type { MandalFormOption } from "types";
import type { Sabha } from "@prisma/client";

interface Props {
  mandals: MandalFormOption[];
}

export default function PointsComponent({ mandals }: Props) {
  const [selectedMandal, setSelectedMandal] = useState<number>();
  const [sabha, setSabha] = useState<{ value: number; label: Date }[]>([]);

  const { trigger: getSabha } = useSWRMutation(
    "/api/sabha/get-list",
    axiosPost<{ mandalId: number }, Sabha[]>,
    {
      onSuccess(data) {
        const result = data.data.map(({ id, date }) => ({
          value: id,
          label: date,
        }));

        setSabha(result);
      },
    }
  );

  const handleMandalSelect = (e: SingleValue<MandalFormOption>) => {
    if (e?.value) getSabha({ mandalId: e?.value });
  };

  const handleSabhaSelect = (
    e: SingleValue<{ value: number; label: Date }>
  ) => {
    console.log(e);
  };

  return (
    <Stack spacing="4">
      <ReactSelect
        options={mandals}
        placeholder="Select Mandal"
        onChange={handleMandalSelect}
      />

      <ReactSelect
        options={sabha}
        placeholder="Select Sabha"
        onChange={handleSabhaSelect}
      />
    </Stack>
  );
}
