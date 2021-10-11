import { Flex } from "@chakra-ui/layout";

export const Layout: React.FC = ({ children }) => (
  <main>
    <Flex
      pb={20}
      pl={[2, 2, "250px", "250px"]}
      pr={[2, 2, 2, 2, "250px"]}
      w="full"
      justify="center"
      flexDirection={["column", "column", "row"]}
    >
      {children}
    </Flex>
  </main>
);
