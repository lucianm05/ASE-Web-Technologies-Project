import ParkingLotForm from "@/components/forms/ParkingLotForm";
import { BUCHAREST_COORDS } from "@/constants";
import { useDrawer } from "@/features/drawer/drawer.store";
import { getParkingLots } from "@/features/map/api/getParkingLots";
import GoogleMapReact from "google-map-react";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { LocationPayload } from "types";

const Map = () => {
  const { setIsOpen, setConfig } = useDrawer();

  const [map, setMap] = useState<google.maps.Map>();
  const [marker, setMarker] = useState<google.maps.Marker>();
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  const { data: parkingLots } = useQuery("parking-lots", getParkingLots);

  useEffect(() => {
    if (!parkingLots || !map || typeof google === "undefined") return;

    const newMarkers: typeof markers = [];

    parkingLots.forEach((parkingLot) => {
      const { location } = parkingLot;

      if (!location?.lat || !location?.lng) return;

      const newMarker = new google.maps.Marker({
        map,
        position: new google.maps.LatLng({
          lat: location?.lat,
          lng: location.lng,
        }),
        clickable: true,
      });

      newMarker.addListener("click", (event: { domEvent: MouseEvent }) => {
        event.domEvent.stopImmediatePropagation();
        console.log("parking lot", parkingLot.id);

        if (!location?.lat || !location?.lng) return;

        map.setCenter({
          lat: location.lat,
          lng: location.lng,
        });
      });

      newMarkers.push(newMarker);
    });

    setMarkers(newMarkers);

    return () => {
      markers.forEach((m) => m.unbindAll());
    };
  }, [map, parkingLots]);

  const getAddressComponent = useCallback(
    (
      addressComponents: google.maps.GeocoderAddressComponent[],
      types: string | string[]
    ) => {
      if (typeof types === "string")
        return addressComponents.find((comp) => comp.types.includes(types));

      for (const type of types) {
        const comp = addressComponents.find((c) => c.types.includes(type));
        if (comp) return comp;
      }
    },
    []
  );

  const onClick = useCallback(
    async ({ lat, lng }: GoogleMapReact.ClickEventValue) => {
      marker?.setMap(null);

      if (!map) return;

      const currentZoom = map.getZoom();
      map.moveCamera({
        center: { lat, lng },
        zoom: currentZoom && currentZoom < 15 ? 15 : currentZoom,
      });

      setMarker(
        new google.maps.Marker({
          map,
          position: new google.maps.LatLng({ lat, lng }),
        })
      );

      let location: LocationPayload = {
        lat,
        lng,
      };

      try {
        const geocoder = new google.maps.Geocoder();

        const { results } = await geocoder.geocode({
          location: { lat, lng },
          language: "ro",
        });
        const [result] = results;

        const { address_components } = result;

        const street = getAddressComponent(address_components, [
          "route",
          "establishment",
        ])?.short_name;
        const city = getAddressComponent(
          address_components,
          "locality"
        )?.short_name;
        const country = getAddressComponent(
          address_components,
          "country"
        )?.short_name;

        location = { ...location, street, city, country };
      } catch (err) {
        console.error(err);
      }

      setConfig({
        body: <ParkingLotForm location={location} />,
      });
      setIsOpen(true);
    },
    [map, marker]
  );

  return (
    <div className="h-screen w-full">
      <GoogleMapReact
        center={BUCHAREST_COORDS}
        zoom={12}
        bootstrapURLKeys={{ key: import.meta.env.VITE_GOOGLE_API_KEY }}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map }) => {
          setMap(map);
        }}
        onClick={onClick}
        onChildClick={(hoverKey, childProps) => {
          console.log("onChildClick");
          console.log(hoverKey, childProps);
        }}
      />
    </div>
  );
};

export default Map;
