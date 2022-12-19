import { useState, useMemo } from "react";
import { Box, Button, Stack, useToast } from "@chakra-ui/react";
import ReactSelect, { SingleValue } from "react-select";
import useSWRMutation from "swr/mutation";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";

import { axiosPost } from "libs";

import type { MandalFormOption } from "types";
import type { Sabha, Yuvak, Team, Points } from "@prisma/client";
import TeamTable from "./TeamTable";
import YuvakTable from "./YuvakTable";
import { useGetPoints } from "../../hooks";
import { processPoints } from "./utils";

interface Props {
  mandals: MandalFormOption[];
}

export default function PointsComponent({ mandals }: Props) {
  const [selectedMandal, setSelectedMandal] = useState<number>();
  const [selectedSabha, setSelectedSabha] = useState<number>();

  const [sabha, setSabha] = useState<{ value: number; label: string }[]>([]);
  const [teams, setTeams] = useState<Omit<Team, "createdAt" | "updatedAt">[]>(
    []
  );
  const [yuvaks, setYuvaks] = useState<
    Omit<Yuvak, "createdAt" | "updatedAt">[]
  >([]);
  const [points, setPoints] = useState<Points[]>([]);

  const toast = useToast();
  const getPoints = useGetPoints();

  const hookForm = useForm();
  const { handleSubmit, reset } = hookForm;

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
        const result = data.data.map(({ id, name, mandalId }) => ({
          id,
          name,
          mandalId,
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
        const result = data.data.map(
          ({ id, name, phone, role, mandalId, teamId }) => ({
            id,
            name,
            phone,
            role,
            mandalId,
            teamId,
          })
        );

        setYuvaks(result);
      },
    }
  );

  const { trigger: createPoints } = useSWRMutation(
    "/api/points/create",
    axiosPost<{ sabhaId: number; points: any }, any>
  );

  const handleMandalSelect = (e: SingleValue<MandalFormOption>) => {
    if (!e?.value) return;

    setSelectedMandal(e?.value);

    getSabha({ mandalId: e?.value });
    getTeams({ mandalId: e?.value });
    getYuvaks({ mandalId: e?.value });
  };

  const handleSabhaSelect = async (value: number) => {
    if (!value) return;

    setSelectedSabha(value);

    const result = await getPoints({ sabhaId: value });
    setPoints(result);
  };

  const onSubmit = handleSubmit(async (data) => {
    const processedData = processPoints(data);

    if (!selectedSabha) return;

    await createPoints({ sabhaId: selectedSabha, points: processedData });

    // wait one sec
    await new Promise((res) =>
      setTimeout(() => {
        res("ok");
      }, 1000)
    );

    await handleSabhaSelect(selectedSabha);

    reset();

    toast({
      title: "Success",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  });

  return (
    <Stack as="form" spacing="4" mb="16" onSubmit={onSubmit}>
      <ReactSelect
        options={mandals}
        placeholder="Select Mandal"
        onChange={handleMandalSelect}
        isSearchable
      />

      <ReactSelect
        options={sabha}
        placeholder="Select Sabha"
        onChange={(e) => e?.value && handleSabhaSelect(e.value)}
        isSearchable
      />

      {showTeamTable && (
        <TeamTable teams={teams} points={points} hookForm={hookForm} />
      )}

      {showYuvakTable && (
        <YuvakTable yuvaks={yuvaks} points={points} hookForm={hookForm} />
      )}

      <Box
        sx={{
          position: "fixed",
          right: 0,
          bottom: 0,
          display: showTeamTable || showYuvakTable ? "block" : "none",
        }}
      >
        <Button
          type="submit"
          sx={{
            margin: "0 16px 16px 0",
            width: "160px",
          }}
        >
          Save
        </Button>
      </Box>
    </Stack>
  );
}
