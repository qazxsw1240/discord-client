import { MessageQueue } from "../queue";

describe("message queue test", () => {
    test("message queue creation test", () => {
        const receiver1 = MessageQueue.getReceiver("test-channel");
        const receiver2 = MessageQueue.getReceiver("test-channel");
        expect(receiver1).toEqual(receiver2);
    });

    test("message broker reception test", () => {
        MessageQueue.getReceiver("test-channel 2")
            .addReceiver<string>(data => {
                expect(data.sender).toBe("test-sender");
                expect(data.data).toBe("test");
            });
        const sender = MessageQueue.getSender("test-sender");
        sender.send("test-channel 2", "test");
    });

    test("message broker delayed reception test", () => {
        const sender = MessageQueue.getSender("test-sender");
        sender.send("test-channel 2", "test");
        MessageQueue.getReceiver("test-channel 2")
            .addReceiver<string>(data => {
                expect(data.sender).toBe("test-sender");
                expect(data.data).toBe("test");
            });
    });
});
