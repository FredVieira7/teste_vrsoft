import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { NotificationService } from '../notification.service';
import { Subscription, interval } from 'rxjs';

type Item = { messageId: string; messageContent: string; status: string };

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [FormsModule, NgFor],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.css']
})
export class NotificationComponent implements OnInit, OnDestroy {
  content = '';
  items: Item[] = [];
  sub?: Subscription;

  constructor(private svc: NotificationService) {}

  ngOnInit(): void {
    this.sub = interval(3000).subscribe(() => this.tick());
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  send(): void {
    const c = this.content.trim();
    if (!c) return;
    const messageId = this.svc.generateMessageId();
    this.svc.send(c, messageId).subscribe(r => {
      this.items.unshift({ messageId: r.messageId, messageContent: c, status: 'PROCESSING_PENDING' });
      this.content = '';
    });
  }

  tick(): void {
    const pending = this.items.filter(i => i.status === 'PROCESSING_PENDING');
    pending.forEach(i => {
      this.svc.status(i.messageId).subscribe(r => {
        if (r.status) i.status = r.status;
      });
    });
  }
}
