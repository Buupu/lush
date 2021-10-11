import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { NextApiRequest, NextApiResponse } from "next";

const client = new ApolloClient({
  uri: "https://twstg2.eu.saleor.cloud/graphql/",
  cache: new InMemoryCache(),
});

export default async function LoadMoreProducts(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { endCursor, searchQuery, categoryId, sortBy } = JSON.parse(req.body);

  let filters = "";

  if (searchQuery) filters += `search: "${searchQuery}",`;

  if (categoryId) filters += `categories: "${categoryId}",`;

  try {
    const { data } = await client.query({
      query: gql`
        query {
            products(channel: "uk", first: 20, after: "${endCursor}", filter: {${filters}}, sortBy: { field: ${sortBy.sorting.field}, direction: ${sortBy.sorting.direction} }) {
                pageInfo {
                  endCursor
                }
                edges {
                cursor
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

    res.status(200).json({
      moreProducts: data.products.edges,
      updatedEndCursor: data.products.pageInfo.endCursor,
      error: null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
