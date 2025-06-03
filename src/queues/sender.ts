import type EventEmitter from "node:events";
import type { MessageQueueEventMap, MessageTopicHolder, QueuedMessage } from "./queue";

const createQueuedMessage = <T>(sender: string, receiver: string, data: T): QueuedMessage<T> => {
    const now = new Date();
    return {
        sender,
        receiver,
        data,
        createdAt: now
    };
};

export class MessageSender implements MessageTopicHolder {
    private readonly _topic: string;
    private readonly _eventEmitter: EventEmitter<MessageQueueEventMap>;

    public constructor(
        topic: string,
        eventEmitter: EventEmitter<MessageQueueEventMap>
    ) {
        this._topic = topic;
        this._eventEmitter = eventEmitter;
    }

    public get topic(): string {
        return this._topic;
    }

    public send<T>(topic: string, data: T): void {
        this._eventEmitter.emit(topic, createQueuedMessage(this.topic, topic, data));
    }
}
