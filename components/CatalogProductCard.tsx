import { Text, Box, AspectRatio } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CatalogProductModal, PriceModal } from "../modal/ProductModal";

export const CatalogProductCard = ({
  product,
}: {
  product: CatalogProductModal;
}) => {
  const grossPrice: PriceModal = product.node?.pricing?.priceRange?.start;
  return (
    <Link href={`/product/${product.node?.id}`} passHref>
      <Box cursor="pointer">
        <Box
          transition="0.3s ease-out"
          bg="gray.50"
          mb={1}
          _hover={{ transform: "scale(1.02)" }}
        >
          <AspectRatio ratio={2 / 3}>
            <Image
              alt={product.node?.thumbnail?.alt || "Placeholder image"}
              src={product.node?.thumbnail?.url || "/placeholder-image.png"}
              layout="fill"
              objectFit="contain"
            />
          </AspectRatio>
        </Box>
        <Text fontSize={14}>{product.node?.name}</Text>
        <Text fontSize={12}>{`${grossPrice?.gross?.amount.toFixed(2)} ${
          grossPrice?.gross?.currency
        }`}</Text>
      </Box>
    </Link>
  );
};
