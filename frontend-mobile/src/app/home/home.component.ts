import { Component, OnInit } from "@angular/core";

import { DataService, DataItem } from "../shared/data.service";
import { EventData, Color } from "tns-core-modules/ui/page/page";
import { ListViewEventData, PullToRefreshStyle, RadListView } from "nativescript-ui-listview";

@Component({
    selector: "Home",
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
    items: Array<DataItem>;

    constructor(private _itemService: DataService) { }

    ngOnInit(): void {
        this.items = [];
        this.items = this._itemService.getItems();
    }

    /**
     * Refresh when user pulls RadListView containing documents.
     * @param args
     */
    refreshList(args: ListViewEventData) {
        const listView: RadListView = args.object;
        listView.notifyPullToRefreshFinished();
    }
}
