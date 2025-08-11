import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { router } from '../src/routes/notify.routes';

jest.mock('../src/messaging/rabbit', () => ({
  publishInput: jest.fn().mockResolvedValue(undefined),
  publishStatus: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../src/statusStore', () => ({
  setStatus: jest.fn(),
  getStatus: jest.fn(),
}));


import * as rabbit from '../src/messaging/rabbit';
import * as statusStore from '../src/statusStore';

const app = express();
app.use(express.json());
app.use(router);

describe('Notification API', () => {
  it('returns 400 when messageContent is empty', async () => {
    const res = await request(app).post('/api/notify').send({});
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'messageContent is empty' });
  });

  it('accepts a valid notification', async () => {
    const res = await request(app).post('/api/notify').send({ messageContent: 'Hello test' });

    expect(res.status).toBe(202);
    expect(res.body).toHaveProperty('messageId');
    expect(rabbit.publishInput).toHaveBeenCalledTimes(1);
    expect(statusStore.setStatus).toHaveBeenCalledWith(
      expect.any(String),
      'PROCESSING_PENDING'
    );
  });

  it('returns status for a given messageId', async () => {
    (statusStore.getStatus as jest.Mock).mockReturnValueOnce('PROCESSED_SUCCESS');

    const res = await request(app).get('/api/notification/status/123');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ messageId: '123', status: 'PROCESSED_SUCCESS' });
  });

  it('returns 404 when status not found', async () => {
    (statusStore.getStatus as jest.Mock).mockReturnValueOnce(null);

    const res = await request(app).get('/api/notification/status/unknown');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ messageId: 'unknown', status: null });
  });
});