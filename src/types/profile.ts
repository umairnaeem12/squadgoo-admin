export type FeedbackDirection = "given" | "received";
export type FeedbackType = "live chat" | "call";

export interface ProfileInfo {
  first: string;
  last: string;
  full: string;
}

export interface ProfileSocialLinks {
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
}

export interface ProfilePersonalInfo {
  email: string;
  phone: string;
  address: string;
  timezone: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export type ReviewChannel = "live chat" | "call" | "email";

export interface ProfileReview {
  id: string;
  rating: number;
  author: string;
  text: string;
  date: string;
  subject: string;
  channel: ReviewChannel;
  serviceArea: string;
}

export interface ProfileFeedback {
  id: string;
  type: FeedbackType;
  direction: FeedbackDirection;
  summary: string;
  timestamp: string;
  author: string;
  rating: number;
  status: "reviewed" | "actioned" | "follow-up";
}

export interface ProfileTask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  status: "assigned" | "pending" | "completed";
  priority: "high" | "medium" | "low";
  assignedBy: string;
  isToday: boolean;
}

export interface ProfilePayload {
  id: string;
  name: ProfileInfo;
  role: string;
  location: string;
  avatar: string;
  bio: string;
  social: ProfileSocialLinks;
  personalInfo: ProfilePersonalInfo;
  reviews: ProfileReview[];
  feedback: ProfileFeedback[];
  tasks: ProfileTask[];
}
