import { app } from './app';
import { env } from './env';
import { startConsumer } from './messaging/rabbit';

app.listen(env.port, async () => {
  await startConsumer();
});
