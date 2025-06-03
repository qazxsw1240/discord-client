import { MessageReceiverTopicError } from "./error";
import type { MessageTopicHolder, QueuedMessage } from "./queue";

export class MessageReceiver implements MessageTopicHolder {
    private readonly _receivers = new Set<(data: QueuedMessage<any>) => void>();

    private readonly _topic: string;
    private readonly _messages: QueuedMessage<any>[];
    private _idle: boolean;

    public constructor(topic: string, messages: QueuedMessage<any>[]) {
        this._topic = topic;
        this._messages = messages.filter(message => message.receiver === this._topic);
        this._idle = true;
        this.startExecution();
    }

    public get topic(): string {
        return this._topic;
    }

    public notify(message: QueuedMessage<any>) {
        if (message.receiver !== this.topic) {
            throw new MessageReceiverTopicError(`Invalid topic: ${message.receiver}, expected ${this.topic}`);
        }
        this._messages.push(message);
        this.startExecution();
    }

    public addReceiver<T>(callback: (message: QueuedMessage<T>) => void): void {
        this._receivers.add(callback);
    }

    public removeReceiver<T>(callback: (message: QueuedMessage<T>) => void): void {
        this._receivers.delete(callback);
    }

    public removeAllReceivers(): void {
        this._receivers.clear();
    }

    private async startExecution() {
        if (this._idle) {
            return;
        }
        try {
            this._idle = false;
            for (let message = this._messages.shift();
                message;
                message = this._messages.shift()) {
                const receivers = [...this._receivers];
                receivers.forEach(receiver => receiver(message));
            }
        } finally {
            this._idle = true;
        }
    }
}
