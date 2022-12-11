import { useEffect } from "react";
import { Button } from "@chakra-ui/react";

import Layout from "components/Layout";
import prisma from "libs/prisma";

import type { GetServerSideProps } from "next";

export default function HomePage(props: { hello: string }) {
  console.log(props);

  useEffect(() => {}, []);

  const createMandal = async () => {
    const body = { name: "test mandal" };

    fetch("/api/mandal/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  };

  return (
    <Layout>
      <Button onClick={createMandal}>Create</Button>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const mandals = await prisma.mandal.findMany();

  console.log(mandals);

  return {
    props: { hello: "hi", mandals: JSON.parse(JSON.stringify(mandals)) },
  };
};
