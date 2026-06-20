export interface Channel {
  id: string;
  name: string;
  slug: string;
  category: string;
  country: string;
  language: string;
  logo: string;
  streamUrl: string;
  featured: boolean;
  active: boolean;
  icon?: string;
}

/**
 * Category type for the application
 */
export type ChannelCategory = 
  | 'Kids'
  | 'Nigerian'
  | 'News'
  | 'Music'
  | 'Religious'
  | 'Entertainment'
  | 'Sports'
  | 'Movies';
