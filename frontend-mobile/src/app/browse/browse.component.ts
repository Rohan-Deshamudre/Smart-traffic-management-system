import { Component, OnInit } from "@angular/core";
import { MapboxView } from "nativescript-mapbox";

@Component({
    selector: "Browse",
    templateUrl: "./browse.component.html"
})
export class BrowseComponent implements OnInit {
    constructor() {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        // Use the "ngOnInit" handler to initialize data for the view.
    }

    onMapReady(args) {
        const mapView: MapboxView = args.map;
        const mapBox = mapView.getMapboxApi();

        mapBox.getUserLocation().then(
            (userLocation) => {
                console.log("Current user location: " +  userLocation.location.lat + ", " + userLocation.location.lng);
                console.log("Current user speed: " +  userLocation.speed);

                mapBox.setCenter(
                    {
                        lat: userLocation.location.lat,
                        lng: userLocation.location.lng
                    }
                );
            }
        );
    }
}
