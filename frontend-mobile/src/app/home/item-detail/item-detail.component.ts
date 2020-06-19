import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";

import { DataService } from "../../shared/data.service";
import { Notification } from "~/app/shared/notification.object";

@Component({
    selector: "ItemDetail",
    templateUrl: "./item-detail.component.html"
})
export class ItemDetailComponent implements OnInit {

    item: Notification;

    constructor(
        private data: DataService,
        private _route: ActivatedRoute,
        private _routerExtensions: RouterExtensions
    ) { }

    ngOnInit(): void {
        const id = +this._route.snapshot.params.id;
        this.data.getItem(id).subscribe(
            (notification) => this.item = notification);
    }

    onBackTap(): void {
        this._routerExtensions.back();
    }
}
