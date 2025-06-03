import EventEmitter from "node:events";
import { MessageReceiverNotFoundError, MessageSenderNotFoundError } from "./error.js";
import { MessageReceiver } from "./receiver.js";
import { MessageSender } from "./sender.js";


export interface QueuedMessage<T> {
    readonly sender: string;
    readonly receiver: string;
    readonly data: T;
    readonly createdAt: Date;
}

export interface MessageTopicHolder {
    readonly topic: string;
}

export const MessageQueueSendEvent = Symbol("send");

export type MessageQueueEventMap = {
    [MessageQueueSendEvent]: [topic: string, data: QueuedMessage<any>];
    [topic: string]: [data: QueuedMessage<any>];
};

export namespace MessageQueue {
    const senders = new Map<string, MessageSender>();
    const receivers = new Map<string, MessageReceiver>();
    const pendingMessages = new Array<QueuedMessage<any>>();
    const globalMessageQueue = new EventEmitter<MessageQueueEventMap>({ captureRejections: true });

    globalMessageQueue.on(MessageQueueSendEvent, (topic, message) => {
        if (!receivers.has(topic)) {
            pendingMessages.push(message);
        }
        const receiver = receivers.get(topic);
        if (!receiver) {
            throw new MessageReceiverNotFoundError(topic);
        }
        receiver.notify(message);
    });

    export const getSender = (topic: string): MessageSender => {
        if (!senders.has(topic)) {
            const sender = new MessageSender(topic, globalMessageQueue);
            senders.set(topic, sender);
        }
        const sender = senders.get(topic);
        if (!sender) {
            throw new MessageSenderNotFoundError(topic);
        }
        return sender;
    };

    export const getReceiver = (topic: string): MessageReceiver => {
        if (!receivers.has(topic)) {
            const receiver = new MessageReceiver(topic, pendingMessages);
            receivers.set(topic, receiver);
        }
        const receiver = receivers.get(topic);
        if (!receiver) {
            throw new MessageReceiverNotFoundError(topic);
        }
        return receiver;
    };
}
