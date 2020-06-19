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

    }
}
