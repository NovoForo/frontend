export type Post = {
  Id: number;
  Title: string;
  User: User;
  CreatedAt: string;
  Content: string;
  Topic: Topic;
};

export type User = {
  Username: string;
  IsModerator: boolean;
  IsAdministrator: boolean;
};

export type Category = {
  Id: number;
  Name: string;
  Description: string;
  Forums: Forum[];
};

export type Forum = {
  Id: number;
  Name?: string;
  Description?: string;
};

export type Topic = {
  Id: number;
  ForumId: number;
  Title: string;
  Description: string;
  CreatedAt: string;
  UpdatedAt: string;
  Posts: Post[];
};
