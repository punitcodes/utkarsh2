import { useMemo } from "react";

import { Select } from "components/common";
import Layout from "components/Layout";
import prisma from "libs/prisma";

import type { GetServerSideProps } from "next";
import type { Mandal } from "@prisma/client";

interface Props {
  mandals: Mandal[];
}

export default function HomePage({ mandals = [] }: Props) {
  const createMandal = async () => {
    const body = { name: "test mandal" };

    fetch("/api/mandal/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  };

  const mandalsSelectOption = useMemo(() => {
    return mandals.map(({ id, name }) => ({ value: id, label: name }));
  }, [mandals]);

  return (
    <Layout>
      <Select options={mandalsSelectOption} />

      {/* <Button onClick={createMandal}>Create</Button> */}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const mandals = await prisma.mandal.findMany();

  return {
    props: { mandals: JSON.parse(JSON.stringify(mandals)) },
  };
};
