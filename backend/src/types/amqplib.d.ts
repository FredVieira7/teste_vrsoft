// types/amqplib.d.ts
declare module 'amqplib' {
  export interface Options {
    heartbeat?: number;
    clientProperties?: Record<string, any>;
  }

  export interface Replies {
    AssertQueue: { queue: string; messageCount: number; consumerCount: number };
  }

  export interface Message {
    content: Buffer;
    fields: any;
    properties: any;
  }

  export type ConsumeMessage = Message | null;

  export interface Channel {
    assertQueue(queue: string, options?: { durable?: boolean }): Promise<Replies.AssertQueue>;
    sendToQueue(queue: string, content: Buffer, options?: { persistent?: boolean }): boolean;
    consume(queue: string, onMessage: (msg: ConsumeMessage) => void): Promise<void>;
    ack(message: Message): void;
    close(): Promise<void>;
  }

  export interface Connection {
    createChannel(): Promise<Channel>;
    close(): Promise<void>;
  }

  export function connect(url: string, options?: Options): Promise<Connection>;
}
