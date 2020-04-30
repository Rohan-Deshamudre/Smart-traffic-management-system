import gql from 'graphql-tag';
import { schema } from "./schema";

export const resolvers = {
    Mutation: {
    	setSimulationScene: (_root, variables, { cache, getCacheKey }) => {
			const id = getCacheKey({ __typename: 'SimulationScene' });
			const data = { lng: variables.lng, lat: variables.lat, zoom: variables.zoom };
			cache.writeData({ data });
			return null;
		},
    	setMapFocusPoint: (_root, variables, { cache, getCacheKey }) => {
			const id = getCacheKey({ __typename: 'Coordinates' });
            const fragment = gql`
                fragment Coords on Coordinates {
                    lng
					lat
					zoom
                }
			`;
			// const coords = cache.readFragment({ fragment, id });
			const data = { lng: variables.lng, lat: variables.lat, zoom: variables.zoom };
			cache.writeData({ data });
			return null;
		},
    },
	Query: {
		getMapFocusPoint: (point, _, { cache }) => {
			const localQuery = gql`
				query {
					mapFocusPoint @client {
						lat
						lng
						y
					}
				}
			`;
			const result = cache.readQuery({ query: localQuery });
			return result;
		},
		getCurrentTree: (point, _, { cache }) => {
            const localQuery = gql`
                query {
                    currentTreeId @client
                }
			`;
			return cache.readQuery({query: localQuery});
        }
	},
};
