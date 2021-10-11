import { Flex } from "@chakra-ui/layout";

export const Layout: React.FC = ({ children }) => (
  <main>
    <Flex
      pb={20}
      pl={[0, 0, "250px", "250px"]}
      pr={[0, 0, 2, 2, "250px"]}
      w="full"
      justify="center"
      flexDirection={["column", "column", "row"]}
    >
      {children}
    </Flex>
  </main>
);
