

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

export type JobUserData = {
  id: number;
  url: string;
  name: string;
  description: string;
  isBlueVerified: boolean;
  profilePicture: string;
  coverPicture: string;
  location: string;
  followers: number;
  following: number;
  canDm: boolean;
  createdAt: string;
  statusesCount: number;
  display_url: string;
  expanded_url: string;
};

export type Job = {
  row_number?: number;
  id: string;
  url: string;
  text: string;
  retweetCount: number;
  replyCount: number;
  likeCount: number;
  quoteCount: number;
  viewCount: number;
  bookmarkCount: number;
  createdAt: string;
  isReply: boolean;
  conversationId: string;
  images: string;
  VideoUrl?: string;
  VideoPresent?: boolean;
  applied_status: 'PENDING' | 'APPLIED';
  card_image?: string;
  card_description?: string;
  card_domain?: string;
  card_found?: boolean;
  card_title?: string;
  card_url?: string;
  userData: JobUserData;
};

export type TelegramJob = {
  row_number: number;
  id: number;
  date: string;
  Job_Title: string;
  Company_Name: string;
  Job_Location: string;
  Job_Salary: string;
  Apply_link: string;
  Application_Deadline?: string;
  display_url?: string;
  sender_id: number;
};


export type ReplySuggestion = {
  content: string[];
};

export type UserProfile = {
  id: number;
  name: string;
  handle: string;
  avatar: string;
  countryFlag?: string;
};

export type Founder = {
  row_number: number;
  id: number | string;
  url: string;
  name: string;
  description: string;
  isBlueVerified: boolean;
  profilePicture: string;
  coverPicture: string;
  location: string;
  followers: number;
  following: number;
  canDm: boolean;
  createdAt: string;
  statusesCount: number;
  display_url: string;
  expanded_url: string;
  dm_status: boolean;
  userName: string;
};

