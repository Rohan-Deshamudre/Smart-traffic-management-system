import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/internal/operators";
import { Notification } from "~/app/shared/notification.object";

@Injectable({
    providedIn: "root"
})
export class DataService {

    private counter = 0;

    private notifications: BehaviorSubject<Array<Notification>> = new BehaviorSubject<Array<Notification>>([]);

    getItems(): Observable<Array<Notification>> {
        return this.notifications.asObservable();
    }

    addItem(notification: Notification): void {
        const temp = this.notifications.getValue();
        temp.push(notification);
        this.notifications.next(temp);
    }

    removeItem(notification: Notification): void {
        this.notifications.next(this.notifications.getValue().filter((n) => n.id !== notification.id));
    }

    getItem(id: number): Observable<Notification> {
        return this.notifications.pipe(
            map(
                (notifications) => notifications.find((n) => n.id === id)
            )
        );
    }

    getNextId(): number {
        return ++this.counter;
    }
}
