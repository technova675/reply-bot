



export type Author = {
  name: string;
  userName: string;
  profilePicture: string;
  followers?: string;
  id?: string;
  isVerified?: boolean;
  isBlueVerified?: boolean;
  coverPicture?: string;
  following?: number;
  createdAt?: string;
};

export type Media = {
  media_url_https: string;
  type: string;
};

export type Reply = {
  id: string;
  text: string;
  replyCount: number;
  likeCount: number;
  viewCount: number;
  createdAt: string;
  media: string;
  url: string;
  retweetCount: number;
  quoteCount: number;
  bookmarkCount: number;
  conversationId: string
  isReply: boolean;
  authorUserName: string
  authorId: string
  authorProfilePicture: string
  authorName: string
};


export type Tweet = {
  id: string;
  createdAt: string;
  text: string;
  fullText?: string;
  images: string;
  replyCount: number;
  retweetCount: number;
  likeCount: number;
  viewCount: number;
  bookmarkCount: number;
  isReplied?: boolean;
  replyList?: Reply[]; 
  suggestions?: string[];
  isQuote?: boolean;
  isRetweeted?: boolean;
  quoteData?: any[]; 
  
  // Flattened author properties
  authorName: string;
  authorUserName: string;
  authorProfilePicture: string;
  authorId: string;
  authorIsBlueVerified?: boolean;

  // Other properties
  url: string;
  isReply: boolean;
  isReplyToId?: string;
  isReplyToUserId?: string;
  isReplyToUsername?: string;
  conversationId?: string;

  //status property
  replied_status?: string;

  //video
  VideoUrl?: string;
  VideoPresent?: boolean
};

export type ReplySuggestion = {
    text: string;
};

export type UserProfile = {
  id: number;
  name: string;
  handle: string;
  avatar: string;
  countryFlag?: string;
};
