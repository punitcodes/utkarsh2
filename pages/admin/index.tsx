import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

import Layout from "components/Layout";
import Points from "./Points";
import Yuvak from "./Yuvak";
import Sabha from "./Sabha";
import Team from "./Team";
import Mandal from "./Mandal";

export default function AdminPage() {
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
            <Points />
          </TabPanel>

          <TabPanel>
            <Yuvak />
          </TabPanel>

          <TabPanel>
            <Sabha />
          </TabPanel>

          <TabPanel>
            <Team />
          </TabPanel>

          <TabPanel>
            <Mandal />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Layout>
  );
}
