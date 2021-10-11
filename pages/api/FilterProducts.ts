import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { NextApiRequest, NextApiResponse } from "next";

const client = new ApolloClient({
  uri: "https://twstg2.eu.saleor.cloud/graphql/",
  cache: new InMemoryCache(),
});

export default async function FilterProducts(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { searchQuery, categoryId, sortBy } = JSON.parse(req.body);

  let filters = "";

  if (searchQuery) filters += `search: "${searchQuery}",`;

  if (categoryId) filters += `categories: "${categoryId}",`;

  try {
    const { data } = await client.query({
      query: gql`
        query {
          products(channel: "uk", first: 20,  sortBy: { field: ${sortBy.sorting.field}, direction: ${sortBy.sorting.direction} },  filter: {${filters}}) {
            totalCount
            pageInfo {
              endCursor
            }
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
                    stop {
                      gross {
                        amount
                        currency
                      }
                    }
                  }
                }
                thumbnail(size: 250) {
                  url
                  alt
                }
              }
            }
          }
        }
      `,
    });

    res.status(200).json({
      newProducts: data.products.edges,
      totalProducts: data.products.totalCount,
      updatedEndCursor: data.products.pageInfo.endCursor,
      error: null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
