export interface IMessage {
    id: string;
    user: string;
    content: string;
    timestamp: number;
}

export interface IError {
    code: string;
    message: string;
}
