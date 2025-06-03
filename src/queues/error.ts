export class MessageSenderNotFoundError extends Error {
    public constructor(message?: string, options?: ErrorOptions) {
        super(message, options);
    }
}

export class MessageReceiverNotFoundError extends Error {
    public constructor(message?: string, options?: ErrorOptions) {
        super(message, options);
    }
}

export class MessageReceiverTopicError extends Error {
    public constructor(message?: string, options?: ErrorOptions) {
        super(message, options);
    }
}
