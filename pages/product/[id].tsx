import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import {
  AspectRatio,
  Box,
  Heading,
  Button,
  SimpleGrid,
  VStack,
  Select,
} from "@chakra-ui/react";
import Head from "next/head";
import React, { ChangeEvent, ReactNode, useState } from "react";
import {
  MediaModal,
  ProductModal,
  VariantModal,
} from "../../modal/ProductModal";
import Image from "next/image";
import Link from "next/link";
import { SideBar } from "../../components/SideBar";
import { Layout } from "../../components/Layout";

interface ProductPageProps {
  product: ProductModal;
}

export default function Product({ product }: ProductPageProps) {
  const [mainImage, setMainImage] = useState<MediaModal>(
    product.media[0] || {
      alt: "Placeholder Image",
      url: "/placeholder-image.png",
    },
  );

  const [selectedVariant, setSelectedVariant] = useState<VariantModal>(
    product.variants[0],
  );

  const getDescriptionBlocks = () => {
    const parsedDesc = JSON.parse(product.description);

    const elements: ReactNode[] = [];

    parsedDesc?.blocks?.forEach(
      (block: { type: string; data: { text: string } }, index: number) => {
        if (block.type === "paragraph")
          elements.push(
            <Box
              py={2}
              key={`${product.name}-block-${index}`}
              dangerouslySetInnerHTML={{ __html: block.data?.text }}
            ></Box>,
          );
      },
    );

    return elements;
  };

  const handleSelectVariant = (e: ChangeEvent<HTMLSelectElement>) => {
    const newSelectedVariant = product.variants?.find(
      (variant) => variant.id === e.target.value,
    );

    if (newSelectedVariant) setSelectedVariant(newSelectedVariant);
  };

  return (
    <div>
      <Head>
        <title>{product.name} | Lush</title>
        <meta name="description" content="Looking for soap? Look no further." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <SideBar>
          <Link href="/" passHref>
            <Button variant="secondary">Return to products</Button>
          </Link>
        </SideBar>
        <SimpleGrid columns={[1, 1, 2]} w="full" px={[2, 2, 0]} py={6} gap={6}>
          <Box>
            <AspectRatio ratio={1 / 1} bg="gray.50">
              <Image
                src={mainImage.url}
                alt={mainImage.alt}
                layout="fill"
                objectFit="contain"
              />
            </AspectRatio>

            {product.media?.length > 0 && (
              <SimpleGrid columns={4} mt={2} gap={2}>
                {product.media?.map((media) => {
                  return (
                    <AspectRatio
                      key={media.id}
                      w="full"
                      ratio={1 / 1}
                      border={mainImage.id === media.id ? "2px" : "none"}
                      borderColor="#8EC2ED"
                      bg="gray.50"
                      cursor="pointer"
                      _hover={{ border: "2px", borderColor: "#8EC2ED" }}
                      onClick={() => setMainImage(media)}
                    >
                      <Image
                        src={media.url}
                        alt={media.alt}
                        layout="fill"
                        objectFit="cover"
                      />
                    </AspectRatio>
                  );
                })}
              </SimpleGrid>
            )}
          </Box>
          <Box>
            <Heading as="h2" fontWeight="normal" mb={3}>
              {product.name}
            </Heading>

            <Heading fontWeight="normal" fontSize="18px" mb={6}>
              {selectedVariant.pricing?.price?.gross?.amount?.toFixed(2)}{" "}
              {selectedVariant.pricing?.price?.gross?.currency}
            </Heading>

            {product.variants?.length > 1 && (
              <Select
                value={selectedVariant.id}
                onChange={handleSelectVariant}
                borderRadius="0"
                mb={8}
              >
                {product.variants.map((variant) => {
                  return (
                    <option key={variant.id} value={variant.id}>
                      {variant.name}
                    </option>
                  );
                })}
              </Select>
            )}

            <Button
              size="md"
              bg="transparent"
              _hover={{ bg: "blackAlpha.900", color: "white" }}
              mb={8}
            >
              Add to basket
            </Button>

            <VStack spacing={0} align="left">
              {getDescriptionBlocks().map((element) => element)}
            </VStack>
          </Box>
        </SimpleGrid>
      </Layout>
    </div>
  );
}

export async function getStaticPaths() {
  const client = new ApolloClient({
    uri: "https://twstg2.eu.saleor.cloud/graphql/",
    cache: new InMemoryCache(),
  });

  let totalCount: number = 0;
  let paths: { params: { id: string } }[] = [];
  let endCursor: string = "";

  do {
    const { data } = await client.query({
      query: gql`
        query {
          products(channel: "uk", first: 100, after: "${endCursor}") {
            totalCount
            pageInfo {
              endCursor
            }
            edges {
              node {
                id  
              }
            }
          }
        }
      `,
    });

    totalCount = data.products?.totalCount;
    endCursor = data.products?.pageInfo.endCursor;
    data.products.edges.forEach((edge: { node: { id: string } }) => {
      paths.push({ params: { id: edge.node?.id } });
    });
  } while (totalCount > paths.length);

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: any }) {
  const client = new ApolloClient({
    uri: "https://twstg2.eu.saleor.cloud/graphql/",
    cache: new InMemoryCache(),
  });

  const { data } = await client.query({
    query: gql`
        query {
          product(channel: "uk", id: "${params.id}") {
            name
            description
            defaultVariant{
              name
              id
            }
            variants {
              name
              id
              pricing {
                price {
                  gross {
                    amount
                    currency
                  }
                }
              }
            }
            media {
              id
              url
              alt
            }
          }
        }
      `,
  });

  return {
    props: {
      product: data.product,
    },
  };
}
