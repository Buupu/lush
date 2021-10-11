import {
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  VStack,
  Box,
} from "@chakra-ui/react";

interface FilterAccordationItemProps {
  expandButtonLabel: string;
}

export const FilterAccordationItem: React.FC<FilterAccordationItemProps> = ({
  expandButtonLabel,
  children,
}) => (
  <AccordionItem w="full">
    <AccordionButton w="full">
      <Box flex="1" textAlign="left" fontSize="14px">
        {expandButtonLabel}
      </Box>
      <AccordionIcon />
    </AccordionButton>
    <AccordionPanel>
      <VStack align="flex-start" spacing={0} w="full">
        {children}
      </VStack>
    </AccordionPanel>
  </AccordionItem>
);
