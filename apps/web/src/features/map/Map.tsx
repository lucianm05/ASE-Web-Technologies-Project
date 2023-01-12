import ParkingLotForm from "@/components/forms/ParkingLotForm";
import { BUCHAREST_COORDS } from "@/constants";
import { useDrawer } from "@/features/drawer/drawer.store";
import GoogleMapReact from "google-map-react";
import { useCallback, useState } from "react";
import { ICoords, ILocation } from "types";

const Map = () => {
  const { setIsOpen, setConfig } = useDrawer();

  const [map, setMap] = useState<google.maps.Map>();
  const [marker, setMarker] = useState<google.maps.Marker>();

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
      if (!map) return;

      const coords: ICoords = { lat, lng };
      const currentZoom = map.getZoom();

      if (currentZoom && currentZoom < 15) {
        map.setZoom(15);
      }

      marker?.setMap(null);

      setMarker(
        new google.maps.Marker({
          map,
          position: new google.maps.LatLng({ lat, lng }),
        })
      );

      let location: ILocation = {
        coords,
      };

      try {
        const geocoder = new google.maps.Geocoder();

        const { results } = await geocoder.geocode({
          location: { lat, lng },
          language: "ro",
        });
        const [result] = results;

        const { address_components } = result;

        console.log(address_components);

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

      console.log(location);

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
      />
    </div>
  );
};

export default Map;
