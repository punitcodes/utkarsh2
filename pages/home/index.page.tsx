import Layout from "components/Layout";
import prisma from "libs/prisma";

import type { GetServerSideProps } from "next";
import ReactSelect, { SingleValue } from "react-select";

import type { MandalFormOption } from "types";

interface Props {
  mandals: MandalFormOption[];
}

export default function HomePage({ mandals = [] }: Props) {
  const handleMandalSelect = (e: SingleValue<MandalFormOption>) => {
    console.log(e?.value);
  };

  return (
    <Layout>
      <ReactSelect options={mandals} onChange={handleMandalSelect} />
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
