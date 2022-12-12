import { useColorMode, useToken } from "@chakra-ui/react";
import { default as ReactSelect, Props } from "react-select";

export const Select = (props: Props) => {
  const { colorMode } = useColorMode();
  const [menuDarkBg, menuDarkHover] = useToken("colors", [
    "gray.500",
    "gray.700",
  ]);

  return (
    <ReactSelect
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary:
            colorMode === "light" ? theme.colors.primary25 : menuDarkHover,
          primary25:
            colorMode === "light" ? theme.colors.primary25 : menuDarkBg,
        },
      })}
      {...props}
    />
  );
};
