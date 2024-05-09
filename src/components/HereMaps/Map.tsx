import { forwardRef, useEffect, useRef } from "react";
import H from "@here/maps-api-for-javascript";
import { Position } from "../../config/define";

type MapProps = {
  apikey: string;
  initialPosition: Position | null;
  className?: string;
};

export const Map = forwardRef<H.Map, MapProps>(
  (
    {
      apikey,
      initialPosition = { lat: -30.001862, lng: -51.310945 },
      className,
    },
    ref,
  ) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const map = useRef<H.Map | null>(null);
    const platform = useRef<H.service.Platform | null>(null);
    useEffect(() => {
      // Check if the map object has already been created
      if (!map.current) {
        // Create a platform object with the API key and useCIT option
        platform.current = new H.service.Platform({
          apikey,
        });
        // Obtain the default map types from the platform object:
        const defaultLayers = platform.current.createDefaultLayers({
          pois: true,
        }) as any;
        // Create a new map instance with the Tile layer, center and zoom level
        // Instantiate (and display) a map:
        const newMap = new H.Map(
          mapRef.current!,
          defaultLayers.vector.normal.map,
          {
            zoom: 14,
            center: initialPosition ?? undefined,
          },
        );

        // Add panning and zooming behavior to the map
        // new H.mapevents.Behavior(new H.mapevents.MapEvents(newMap));

        // Set the map object to the reference
        map.current = newMap;
        if (typeof ref === "function") {
          ref(newMap);
        }
        if (typeof ref === "object" && ref !== null) {
          ref.current = newMap;
        }
      }
    }, [apikey, ref]);

    // Return a div element to hold the map
    return (
      <div
        className={className}
        style={{ width: "100%", height: "500px" }}
        ref={mapRef}
      />
    );
  },
);
