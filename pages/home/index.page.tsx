// @ts-nocheck -- fix types

import { useState } from "react";
import { Stack, Button } from "@chakra-ui/react";
import ReactSelect, { MultiValue, SingleValue } from "react-select";
import dayjs from "dayjs";
import useSWRMutation from "swr/mutation";
import { useForm } from "react-hook-form";

import Layout from "components/Layout";
import prisma from "libs/prisma";
import { axiosPost } from "libs";

import type { GetServerSideProps } from "next";
import type { Points, Yuvak, Team, Sabha } from "@prisma/client";
import type { MandalFormOption } from "types";
import PointsTable from "./PointsTable";

interface Props {
  mandals: MandalFormOption[];
}

export default function HomePage({ mandals = [] }: Props) {
  const [pointsByTeam, setPointsByTeam] = useState([]);
  const [sabha, setSabha] = useState<{ value: number; label: string }[]>([]);

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      selectedMandal: null as unknown as number,
      selectedSabha: [] as number[],
    },
  });

  const { trigger: getPoints } = useSWRMutation(
    "/api/points/get-list",
    axiosPost<{ sabhaId: number[] }, Points[]>
  );

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
    axiosPost<{ mandalId: number }, Team[]>
  );

  const { trigger: getYuvaks } = useSWRMutation(
    "/api/yuvak/get-list",
    axiosPost<{ mandalId: number }, Yuvak[]>
  );

  const handleSabhaSelect = async (
    e: MultiValue<{ value: number; label: string }>
  ) => {
    if (!e?.length) return;

    const selectedSabha = e.map(({ value }) => value);

    setValue("selectedSabha", selectedSabha);
  };

  const handleMandalSelect = async (
    e: SingleValue<{ value: number; label: string }>
  ) => {
    if (!e?.value) return;

    setValue("selectedMandal", e?.value);

    await getSabha({ mandalId: e?.value });
  };

  const onSubmit = handleSubmit(async (data) => {
    if (!data.selectedMandal || !data.selectedSabha) return;

    const [points, teams, yuvaks] = await Promise.all([
      getPoints({ sabhaId: data.selectedSabha }),
      getTeams({ mandalId: data.selectedMandal }),
      getYuvaks({ mandalId: data.selectedMandal }),
    ]);

    const teamMap = teams?.data.reduce(
      (acc, cur) => ({ ...acc, [cur.id]: cur.name }),
      {} as { [key: number]: string }
    );

    const result = points?.data.reduce((allPoints, currentPoint) => {
      const { type, teamId, yuvakId } = currentPoint;

      if (type === "team") {
        if (!teamId) return allPoints;

        const existingTeamIndex = allPoints.findIndex(
          (e) => e.teamId === currentPoint.teamId
        );

        if (existingTeamIndex === -1) {
          return [
            ...allPoints,
            {
              teamId,
              teamName: teamMap?.[teamId],
              [currentPoint.name]: currentPoint.value,
            },
          ];
        }

        const temp = [...allPoints];

        temp[existingTeamIndex] = {
          ...temp[existingTeamIndex],
          [currentPoint.name]: currentPoint.value,
        };

        return temp;
      }

      if (type === "yuvak") {
        const teamId = yuvaks?.data.find((e) => e.id === yuvakId)?.teamId;

        if (!teamId) return allPoints;

        const existingTeamIndex = allPoints.findIndex(
          (e) => e.teamId === teamId
        );

        if (existingTeamIndex === -1) {
          return [
            ...allPoints,
            {
              teamId,
              teamName: teamMap?.[teamId],
              [currentPoint.name]: currentPoint.value,
            },
          ];
        }

        const existingValue =
          allPoints[existingTeamIndex][currentPoint.name] ?? 0;

        const temp = [...allPoints];

        temp[existingTeamIndex] = {
          ...temp[existingTeamIndex],
          [currentPoint.name]: existingValue + currentPoint.value,
        };

        return temp;
      }
    }, [] as any);

    setPointsByTeam(result);
  });

  return (
    <Layout>
      <Stack as="form" spacing="4" onSubmit={onSubmit}>
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
          isMulti
        />

        <Button type="submit" disabled={Object.keys(errors).length > 0}>
          Get Result
        </Button>

        {pointsByTeam.length > 0 && <PointsTable pointsByTeam={pointsByTeam} />}
      </Stack>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const mandalsFromDB = await prisma.mandal.findMany();

  const mandals = mandalsFromDB.map(({ id, name }) => ({
    value: id,
    label: name,
  }));

  return {
    props: { mandals: JSON.parse(JSON.stringify(mandals)) },
  };
};
