import { Component, OnInit } from "@angular/core";
import { DataService } from "../shared/data.service";
import { Notification } from "~/app/shared/notification.object";

@Component({
    selector: "Home",
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
    items: Array<Notification>;

    constructor(private data: DataService) {
        this.data.getItems().subscribe(
            (notifications) => this.items = [...notifications]);
    }

    ngOnInit(): void {
        this.data.addItem(new Notification(
            this.data.getNextId(),
            'A10 - Rotterdam',
            'Baan afgesloten door werkzaamheden en ongeluk'
        ));

        this.data.addItem(new Notification(
            this.data.getNextId(),
            'A4 - Amsterdam',
            'Spitsstrook open'
        ));
    }
}
