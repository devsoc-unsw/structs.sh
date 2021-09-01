import axios from 'axios';
import { Image, ImageSearchOptions } from 'src/model/builder/Image';

/**
 * All resolvers for builder content operations
 */
export const builderResolver = {
  Query: {
    getImages: async (
      _,
      args: { query: string; searchOptions: ImageSearchOptions }
    ): Promise<Image[]> => {
      try {
        const { query, searchOptions } = args;
        if (!query) throw new Error("Query mustn't be empty");

        const searchQuery = searchOptions.preferWhiteBackground
          ? `${query} white background`
          : query;

        const url = new URL('https://serpapi.com/search.json');
        url.searchParams.append('q', searchQuery);
        url.searchParams.append('engine', 'google');
        url.searchParams.append(
          'api_key',
          '407442403f620a8f18f75958e76ae45611f1e0d0d606f1d4155587a96fb40529'
        );
        url.searchParams.append('ijn', '0');
        url.searchParams.append('google_domain', 'google.com');
        url.searchParams.append('tbm', 'isch');

        const results = await axios.get(url.href);
        const images: Image[] = results.data.images_results.map((img: any) => ({
          url: img.original,
        }));
        return images;
      } catch (err) {
        throw new Error(err.message);
      }
    },
  },
  Mutation: {},
};
