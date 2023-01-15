export interface PostInterface {
    id: number;
    title: string;
    body: string;
    categories: Array<string>;
    user_id: number;
    likes: number;
    dislikes: number;
    saves: number;
    created_at: string;
    updated_at: string;
    user?: UserInterface;
    replies?: Array<ReplyInterface>;
}

export interface UserInterface {
    id: number;
    username: string;
    posts?: Array<PostInterface>;
    replies?: Array<ReplyInterface>;
    liked?: Array<PostInterface>;
    disliked?: Array<PostInterface>;
    saved?: Array<PostInterface>;
}

export interface ReplyInterface {
    id: number;
    body: string;
    post_id: number;
    reply_id: number;
    likes: number;
    dislikes: number;
    replies_count: number;
    created_at: string;
    updated_at: string;
    user?: UserInterface;
}