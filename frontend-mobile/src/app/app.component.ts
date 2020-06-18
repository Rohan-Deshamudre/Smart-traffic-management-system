import { Component, OnInit } from "@angular/core";
import { Message } from "nativescript-plugin-firebase";

const firebase = require("nativescript-plugin-firebase");

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {

    constructor() {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        firebase.init({
            // Optionally pass in properties for database, authentication and cloud messaging,
            // see their respective docs.

            // This is for general notifications.
            onMessageReceivedCallback: (message: Message) => {
                console.log(`Title: ${message.title}`);
                console.log(`Body: ${message.body}`);

                // TODO save notifications to display in dashboard.

                // if your server passed a custom property called 'foo', then do this:
                // console.log(`Value of 'foo': ${message.data.foo}`);
            },

            // This is when we actually do notifications per user, filtered by locations.
            onPushTokenReceivedCallback: (token) => {
                // TODO save notifications to display in dashboard.
                console.log("Firebase push token: " + token);
            }

        }).then(
            () => {
                console.log("firebase.init done");
            },
            (error) => {
                console.log(`firebase.init error: ${error}`);
            }
        );

        firebase.subscribeToTopic("response-plans").then(() => console.log("Subscribed to topic"));
    }
}
