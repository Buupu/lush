import { ChangeEvent, useState } from "react";
import {
  Accordion,
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import gql from "graphql-tag";

import { CatalogProductCard } from "../components/CatalogProductCard";
import type { NextPage } from "next";
import Head from "next/head";
import { CatalogProductModal, CategoryModal } from "../modal/ProductModal";
import { useEffectSkipFirst } from "../hooks/useEffectSkipFirst";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { SideBar } from "../components/SideBar";
import { FilterAccordationItem } from "../components/FilterAccordationItem";

interface HomePageProps {
  products: CatalogProductModal[];
  categories: CategoryModal[];
  totalProducts: number;
  endCursor: string;
}

const sortByOptions = [
  {
    friendlyName: "A-Z",
    sorting: { field: "NAME", direction: "ASC" },
  },
  {
    friendlyName: "Z-A",
    sorting: { field: "NAME", direction: "DESC" },
  },
  {
    friendlyName: "Price high to low",
    sorting: { field: "MINIMAL_PRICE", direction: "DESC" },
  },
  {
    friendlyName: "Price low to high",
    sorting: { field: "MINIMAL_PRICE", direction: "ASC" },
  },
  {
    friendlyName: "What's new?",
    sorting: { field: "PUBLICATION_DATE", direction: "DESC" },
  },
];

const Home: NextPage<HomePageProps> = (results) => {
  const [products, setProducts] = useState<CatalogProductModal[]>(
    results.products,
  );
  const [totalProducts, setTotalProducts] = useState<number>(
    results.totalProducts,
  );
  const [endCursor, setEndCursor] = useState<string>(results.endCursor);

  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);

  const [searchInput, setSearchInput] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [sortBy, setSortBy] = useState<{
    friendlyName: string;
    sorting: { field: string; direction: string };
  }>(sortByOptions[0]);

  const toast = useToast();

  const loadMore = async () => {
    setIsLoadingMore(true);

    const results: any = await fetch("/api/LoadMoreProducts", {
      method: "post",
      body: JSON.stringify({
        endCursor,
        searchQuery: searchInput.length > 3 ? searchInput : "",
        categoryId,
        sortBy,
      }),
    });

    const { moreProducts, updatedEndCursor, error } = await results.json();

    if (error) {
      toast({
        title: "Something went wrong.",
        description: error,
        variant: "left-accent",
        duration: 9000,
        isClosable: true,
        status: "error",
      });
    } else {
      setEndCursor(updatedEndCursor);
      setProducts([...products, ...moreProducts]);
    }
    setIsLoadingMore(false);
  };

  const filterProducts = async (searchQuery: string) => {
    setIsLoadingProducts(true);

    const results: any = await fetch("/api/FilterProducts", {
      method: "post",
      body: JSON.stringify({
        categoryId,
        searchQuery: searchQuery.length > 3 ? searchQuery : "",
        sortBy,
      }),
    });

    const { newProducts, totalProducts, updatedEndCursor, error } =
      await results.json();

    if (error) {
      toast({
        title: "Something went wrong.",
        description: error,
        variant: "left-accent",
        duration: 9000,
        isClosable: true,
        status: "error",
      });
    } else {
      setEndCursor(updatedEndCursor);
      setTotalProducts(totalProducts);
      setProducts(newProducts);
    }

    setIsLoadingProducts(false);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    /* Clears filter if input query is deleted */
    if (
      (e.target.value.length < 4 && searchInput.length > 3) ||
      e.target.value.length > 3
    ) {
      filterProducts(e.target.value);
    }

    setSearchInput(e.target.value);
  };

  const handleChangeCategory = (newCategoryId: string) => {
    setSearchInput("");
    setCategoryId(newCategoryId);
  };

  useEffectSkipFirst(() => {
    filterProducts(searchInput);
  }, [categoryId, sortBy]);

  const handleChangeSortBy = (newSortBy: {
    friendlyName: string;
    sorting: { field: string; direction: string };
  }) => {
    setSortBy(newSortBy);
  };

  return (
    <div>
      <Head>
        <title>Lush</title>
        <meta name="description" content="Looking for soap? Look no further." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Flex
          flexDirection={["column", "column", "row"]}
          justify="space-between"
          pb={20}
          pl={[0, 0, "250px", "250px"]}
          pr={[0, 0, 2, 2, "250px"]}
          w="full"
        >
          <SideBar handleSearch={handleSearch} searchInput={searchInput}>
            <Accordion allowToggle w="full" borderColor="transparent">
              <FilterAccordationItem expandButtonLabel="Categories">
                <Button
                  variant="secondary"
                  fontWeight={categoryId === "" ? "bold" : "normal"}
                  onClick={() => handleChangeCategory("")}
                >
                  All Products
                </Button>
                {results.categories.map((category) => {
                  const node = category.node;
                  return (
                    <Button
                      variant="secondary"
                      fontWeight={categoryId === node?.id ? "bold" : "normal"}
                      onClick={() => handleChangeCategory(node?.id)}
                      key={node?.id}
                    >
                      {node?.name}
                    </Button>
                  );
                })}
              </FilterAccordationItem>

              <FilterAccordationItem expandButtonLabel="Sort by">
                {sortByOptions.map((sortByOption) => {
                  return (
                    <Button
                      variant="secondary"
                      fontWeight={
                        sortBy.friendlyName === sortByOption.friendlyName
                          ? "bold"
                          : "normal"
                      }
                      onClick={() => handleChangeSortBy(sortByOption)}
                      key={sortByOption.friendlyName}
                    >
                      {sortByOption.friendlyName}
                    </Button>
                  );
                })}
              </FilterAccordationItem>
            </Accordion>
          </SideBar>

          <Box p={[2, 2, 0]} flex={1}>
            {isLoadingProducts ? (
              <Flex w="full" justify="center" pt={20}>
                <Spinner size="xl" />
              </Flex>
            ) : (
              <>
                {products.length > 0 && (
                  <SimpleGrid
                    columns={[2, 2, 2, 3, 4, 5]}
                    spacingY={6}
                    spacingX={2}
                    py={6}
                  >
                    {products.map((product) => {
                      return (
                        <CatalogProductCard
                          key={product.node?.id}
                          product={product}
                        />
                      );
                    })}
                  </SimpleGrid>
                )}

                {products.length === 0 && (
                  <Heading as="h3" textAlign="center" fontSize={16} m={10}>
                    Oops.. I couldn{"'"}t find any products
                  </Heading>
                )}

                <Flex
                  w={["100%", "50%", "50%", "50%", "25%", "20%"]}
                  m="auto"
                  align="center"
                  direction="column"
                  justify="center"
                  mt={10}
                >
                  <Text fontSize="12px" mb={2}>
                    {products.length} / {totalProducts}
                  </Text>

                  {products.length < totalProducts && (
                    <Button
                      onClick={loadMore}
                      bg="transparent"
                      _hover={{ bg: "blackAlpha.900", color: "white" }}
                      size="sm"
                      isLoading={isLoadingMore}
                    >
                      Load More
                    </Button>
                  )}
                </Flex>
              </>
            )}
          </Box>
        </Flex>
      </main>
    </div>
  );
};

export default Home;

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: "https://twstg2.eu.saleor.cloud/graphql/",
    cache: new InMemoryCache(),
  });

  const { data } = await client.query({
    query: gql`
      query {
        categories(first: 50) {
          edges {
            node {
              name
              id
            }
          }
        }
        products(
          channel: "uk"
          first: 20
          sortBy: { field: NAME, direction: ASC }
        ) {
          pageInfo {
            endCursor
          }
          totalCount
          edges {
            node {
              id
              name
              pricing {
                priceRange {
                  start {
                    gross {
                      amount
                      currency
                    }
                  }
                }
              }
              thumbnail {
                url
                alt
              }
            }
          }
        }
      }
    `,
  });

  return {
    props: {
      products: data.products.edges,
      categories: data.categories.edges,
      totalProducts: data.products.totalCount,
      endCursor: data.products.pageInfo.endCursor,
    },
  };
}
