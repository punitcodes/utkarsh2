import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

import Layout from "components/Layout";
import PointsComponent from "./Points";
import YuvakComponent from "./Yuvak";
import SabhaComponent from "./Sabha";
import TeamComponent from "./Team";
import MandalComponent from "./Mandal";

import prisma from "libs/prisma";

import type { GetServerSideProps } from "next";
import type { MandalFormOption } from "types";

interface Props {
  mandals: MandalFormOption[];
}

export default function AdminPage({ mandals }: Props) {
  return (
    <Layout needAuth>
      <Tabs isLazy>
        <TabList overflowX="auto">
          <Tab>Points</Tab>
          <Tab>Yuvak</Tab>
          <Tab>Sabha</Tab>
          <Tab>Team</Tab>
          <Tab>Mandal</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <PointsComponent />
          </TabPanel>

          <TabPanel>
            <YuvakComponent mandals={mandals} />
          </TabPanel>

          <TabPanel>
            <SabhaComponent />
          </TabPanel>

          <TabPanel>
            <TeamComponent mandals={mandals} />
          </TabPanel>

          <TabPanel>
            <MandalComponent />
          </TabPanel>
        </TabPanels>
      </Tabs>
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
