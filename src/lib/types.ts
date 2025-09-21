
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
  media: string | string[] | Media[];
  replyCount: number;
  retweetCount: number;
  likeCount: number;
  viewCount: number;
  bookmarkCount: number;
  isReplied?: boolean;
  replyList: Reply[]; 
  suggestions?: string[];
  
  // Flattened author properties
  authorName: string;
  authorUserName: string;
  authorProfilePicture: string;
  authorId: string;

  // Other properties
  url: string;
  isReply: boolean;
};

export type ReplySuggestion = {
    text: string;
};
