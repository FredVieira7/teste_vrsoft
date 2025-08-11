import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT || 3001),
  amqpUrl: String(process.env.AMQP_URL),
  userName: String(process.env.SEU_NOME || 'FRED')
};
