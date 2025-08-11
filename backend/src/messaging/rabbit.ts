import { connect, type Channel, type Connection, type ConsumeMessage } from 'amqplib';
import { env } from '../env';
import { setStatus } from '../statusStore';
import { Status } from '../types/status';

let connectionRef: Connection | null = null;
let channelRef: Channel | null = null;

const queueInput = `queue.notification.input.${env.userName}`;
const queueStatus = `queue.notification.status.${env.userName}`;

const getConnection = async (): Promise<Connection> => {
  if (connectionRef) return connectionRef;
  const conn = await connect(env.amqpUrl);
  connectionRef = conn;
  return conn;
};

export const getChannel = async (): Promise<Channel> => {
  if (channelRef) return channelRef;
  const conn = await getConnection();
  const ch = await conn.createChannel();
  await ch.assertQueue(queueInput, { durable: true });
  await ch.assertQueue(queueStatus, { durable: true });
  channelRef = ch;
  return ch;
};

export const publishInput = async (message: Buffer): Promise<void> => {
  const ch = await getChannel();
  ch.sendToQueue(queueInput, message, { persistent: true });
};

export const publishStatus = async (message: Buffer): Promise<void> => {
  const ch = await getChannel();
  ch.sendToQueue(queueStatus, message, { persistent: true });
};

export const startConsumer = async (): Promise<void> => {
  const ch = await getChannel();
  await ch.consume(queueInput, async (message: ConsumeMessage | null) => {
    if (!message) return;
    const data = JSON.parse(message.content.toString()) as { messageId: string; messageContent: string };
    await new Promise(r => setTimeout(r, 1000 + Math.floor(Math.random() * 1000)));
    const randomNumber = 1 + Math.floor(Math.random() * 10);
    const status: Status = randomNumber <= 2 ? 'PROCESSING_FAILED' : 'PROCESSED_SUCCESS';
    setStatus(data.messageId, status);
    await publishStatus(Buffer.from(JSON.stringify({ messageId: data.messageId, status })));
    ch.ack(message);
  });
};
