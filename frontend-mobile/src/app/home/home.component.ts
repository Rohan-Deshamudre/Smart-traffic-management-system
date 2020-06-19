import { Component, OnInit } from "@angular/core";
import { DataService } from "../shared/data.service";
import { Notification } from "~/app/shared/notification.object";

@Component({
    selector: "Home",
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {

    items: Array<Notification> = [];

    loading = true;

    constructor(private data: DataService) {

    }

    ngOnInit(): void {
        this.data.getItems().subscribe(
            (notifications) => {
                this.loading = true;
                setTimeout(
                    () => {
                        this.items = [...notifications];
                        this.loading = false;
                    },
                    500
                );
            });
    }
}
