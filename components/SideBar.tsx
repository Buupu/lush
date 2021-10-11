import React, { ChangeEvent } from "react";
import { Box, Flex, AspectRatio } from "@chakra-ui/layout";
import { AiOutlineSearch } from "react-icons/ai";
import Image from "next/image";
import Icon from "@chakra-ui/icon";
import { InputGroup, Input, InputRightElement } from "@chakra-ui/input";

interface SideBarProps {
  handleSearch?: (e: ChangeEvent<HTMLInputElement>) => void;
  searchInput?: string;
}

export const SideBar: React.FC<SideBarProps> = ({
  handleSearch,
  searchInput,
  children,
}) => (
  <Box
    bg="white"
    boxShadow={["md", "md", "none"]}
    left={0}
    maxHeight="100vh"
    overflowY="auto"
    p={[1, 1, 2]}
    position={["sticky", "sticky", "fixed"]}
    top={0}
    w={["100%", "100%", "250px"]}
    zIndex={50}
  >
    <Flex direction={["row", "row", "column"]} alignItems="center">
      <AspectRatio w="100px" ratio={16 / 5} m={4}>
        <Image
          src="/lush-logo.png"
          alt="lush logo"
          layout="fill"
          objectFit="contain"
        />
      </AspectRatio>

      {handleSearch && (
        <InputGroup size="md" border="none" mb={[0, 0, 4]} ml={[4, 8, 0]}>
          <Input
            onChange={handleSearch}
            value={searchInput}
            placeholder="search"
            pr="40px"
            border="none"
            _placeholder={{ color: "blackAlpha.500" }}
          />
          <InputRightElement>
            <Icon fontSize="26px" as={AiOutlineSearch} />
          </InputRightElement>
        </InputGroup>
      )}
    </Flex>

    {children}
  </Box>
);
