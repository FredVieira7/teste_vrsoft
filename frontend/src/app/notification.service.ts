import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { v4 as uuid } from 'uuid'
import { Observable } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private api = 'http://localhost:3001'
  constructor(private http: HttpClient) {}
  generateMessageId(): string {
    return uuid()
  }
  send(messageContent: string, messageId: string): Observable<{ messageId: string }> {
    return this.http.post<{ messageId: string }>(`${this.api}/api/notify`, { messageId, messageContent })
  }
  status(id: string): Observable<{ messageId: string; status: string | null }> {
    return this.http.get<{ messageId: string; status: string | null }>(`${this.api}/api/notification/status/${id}`)
  }
}
