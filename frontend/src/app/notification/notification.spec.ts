import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { NotificationComponent } from './notification.component';
import { NotificationService } from '../notification.service';

class NotificationServiceMock {
  generateMessageId = jest.fn(() => 'mock-id-123');
  send = jest.fn((messageContent: string, messageId: string) => of({ messageId }));
  status = jest.fn((id: string) => of({ messageId: id, status: 'PROCESSED_SUCCESS' }));
}


describe('NotificationComponent (Jest)', () => {
  let component: NotificationComponent;
  let service: NotificationServiceMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationComponent],
      providers: [{ provide: NotificationService, useClass: NotificationServiceMock }]
    }).compileComponents();

    const fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(NotificationService) as unknown as NotificationServiceMock;

    jest.spyOn(component as any, 'ngOnInit').mockImplementation(() => {});
  });

  it('não deve enviar se conteúdo vazio', () => {
    component.content = '   ';
    component.send();
    expect(service.send).not.toHaveBeenCalled();
    expect(component.items.length).toBe(0);
  });

  it('deve enviar e inserir item com status AGUARDANDO_PROCESSAMENTO', () => {
    component.content = 'Hello test';
    component.send();

    expect(service.generateMessageId).toHaveBeenCalled();
    expect(service.send).toHaveBeenCalledWith('Hello test', 'mock-id-123');

    expect(component.items[0]).toEqual({
      messageId: 'mock-id-123',
      messageContent: 'Hello test',
      status: 'PROCESSING_PENDING'
    });

    expect(component.content).toBe('');
  });

  it('deve atualizar status para PROCESSED_SUCCESS ao executar tick()', () => {
    component.items = [
      { messageId: 'mock-id-123', messageContent: 'Hello test', status: 'PROCESSING_PENDING' }
    ];
    component.tick();
    expect(service.status).toHaveBeenCalledWith('mock-id-123');
    expect(component.items[0].status).toBe('PROCESSED_SUCCESS');
  });
});
