import { Textarea, Box, Button, useToast } from "@chakra-ui/react";
import Layout from "components/Layout";
import { FormEvent } from "react";

import useSWRMutation from "swr/mutation";

import { axiosPost } from "libs";

export default function BulkYuvakCreate() {
  const toast = useToast();

  const { trigger: createYuvaks } = useSWRMutation(
    "/api/yuvak/create",
    axiosPost<any, any>
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // @ts-ignore ---
    const val = JSON.parse(e.target[0].value);

    await createYuvaks({ yuvaks: val });

    toast({
      title: "Success",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Layout needAuth>
      {/* @ts-ignore */}
      <Box as="form" onSubmit={handleSubmit}>
        <Textarea name="yuvaks-json" rows={20} isRequired />

        <Button type="submit">Create</Button>
      </Box>
    </Layout>
  );
}
