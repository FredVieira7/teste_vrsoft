import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { publishInput } from '../messaging/rabbit';
import { getStatus, setStatus } from '../statusStore';
import { MessageInput } from '../types/messaging'
import { Status } from '../types/status'

export const router = Router();

router.post('/api/notify', async (req, res) => {
  const body = req.body as Partial<MessageInput>;
  const messageId = body.messageId || uuid();
  const messageContent = String(body.messageContent || '').trim();

  if (!messageContent) return res.status(400).json({ message: 'messageContent is empty' });

  setStatus(messageId, 'PROCESSING_PENDING');
  await publishInput(Buffer.from(JSON.stringify({ messageId, messageContent })));
  return res.status(202).json({ messageId });
});

router.get('/api/notification/status/:id', (req, res) => {
  const id = req.params.id;
  const status = getStatus(id) as Status | null;
  if (!status) return res.status(404).json({ messageId: id, status: null });
  return res.json({ messageId: id, status });
});