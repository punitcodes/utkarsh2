import { useState, useMemo } from "react";
import { Stack } from "@chakra-ui/react";
import ReactSelect, { SingleValue } from "react-select";
import useSWRMutation from "swr/mutation";
import dayjs from "dayjs";

import { axiosPost } from "libs";

import type { MandalFormOption } from "types";
import type { Sabha, Yuvak, Team } from "@prisma/client";
import TeamTable from "./TeamTable";
import YuvakTable from "./YuvakTable";

interface Props {
  mandals: MandalFormOption[];
}

export default function PointsComponent({ mandals }: Props) {
  const [selectedMandal, setSelectedMandal] = useState<number>();
  const [selectedSabha, setSelectedSabha] = useState<number>();

  const [sabha, setSabha] = useState<{ value: number; label: string }[]>([]);
  const [teams, setTeams] = useState<{ id: number; name: string }[]>([]);
  const [yuvaks, setYuvaks] = useState<
    {
      id: number;
      name: string;
      phone: string | null;
    }[]
  >([]);

  const { showTeamTable, showYuvakTable } = useMemo(() => {
    if (!selectedMandal || !selectedSabha)
      return { showTeamTable: false, showYuvakTable: false };

    return {
      showTeamTable: teams.length > 0,
      showYuvakTable: yuvaks.length > 0,
    };
  }, [selectedMandal, selectedSabha, teams.length, yuvaks.length]);

  const { trigger: getSabha } = useSWRMutation(
    "/api/sabha/get-list",
    axiosPost<{ mandalId: number }, Sabha[]>,
    {
      onSuccess(data) {
        const result = data.data.map(({ id, date }) => ({
          value: id,
          label: dayjs(date).format("DD/MM/YYYY"),
        }));

        setSabha(result);
      },
    }
  );

  const { trigger: getTeams } = useSWRMutation(
    "/api/team/get-list",
    axiosPost<{ mandalId: number }, Team[]>,
    {
      onSuccess(data) {
        const result = data.data.map(({ id, name }) => ({
          id,
          name,
        }));

        setTeams(result);
      },
    }
  );

  const { trigger: getYuvaks } = useSWRMutation(
    "/api/yuvak/get-list",
    axiosPost<{ mandalId: number }, Yuvak[]>,
    {
      onSuccess(data) {
        const result = data.data.map(({ id, name, phone }) => ({
          id,
          name,
          phone,
        }));

        setYuvaks(result);
      },
    }
  );

  const handleMandalSelect = (e: SingleValue<MandalFormOption>) => {
    if (!e?.value) return;

    setSelectedMandal(e?.value);
    getSabha({ mandalId: e?.value });
    getTeams({ mandalId: e?.value });
    getYuvaks({ mandalId: e?.value });
  };

  const handleSabhaSelect = (
    e: SingleValue<{ value: number; label: string }>
  ) => {
    if (!e?.value) return;

    setSelectedSabha(e?.value);
  };

  return (
    <Stack spacing="4">
      <ReactSelect
        options={mandals}
        placeholder="Select Mandal"
        onChange={handleMandalSelect}
        isSearchable
      />

      <ReactSelect
        options={sabha}
        placeholder="Select Sabha"
        onChange={handleSabhaSelect}
        isSearchable
      />

      {showTeamTable && <TeamTable teams={teams} />}

      {showYuvakTable && <YuvakTable yuvaks={yuvaks} />}
    </Stack>
  );
}
