import Button from "@/components/Button";
import { BUCHAREST_COORDS } from "@/constants";
import dict from "@/constants/dict";
import queryKeys from "@/constants/query-keys";
import useAlert from "@/features/alert/alert.store";
import { useDrawer } from "@/features/drawer/drawer.store";
import { getParkingLots } from "@/features/map/api/getParkingLots";
import { useReserverParkingLot } from "@/features/map/api/reserveParkingLot";
import ParkingLotForm from "@/features/map/components/ParkingLotForm";
import GoogleMapReact from "google-map-react";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { LocationPayload, ParkingLotDTO } from "types";

const Map = () => {
  const { setIsOpen, setConfig } = useDrawer();
  const { error } = useAlert();

  const [map, setMap] = useState<google.maps.Map>();
  const [marker, setMarker] = useState<google.maps.Marker>();
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  const reserveParkingLotHandler = useReserverParkingLot();

  const { data: parkingLots } = useQuery(
    queryKeys.parkingLots,
    getParkingLots,
    {
      refetchOnWindowFocus: false,
    }
  );

  const zoomToPosition = useCallback(
    (lat: number, lng: number) => {
      if (!map) return;

      const currentZoom = map.getZoom();
      map.moveCamera({
        center: { lat, lng },
        zoom: currentZoom && currentZoom < 15 ? 15 : currentZoom,
      });
    },
    [map]
  );

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

      zoomToPosition(lat, lng);

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
        )?.long_name;

        location = { ...location, street, city, country };
      } catch (err: unknown) {
        console.error(err);

        if (!(err instanceof Error)) return;

        error(err.message);
      }

      setConfig({
        body: <ParkingLotForm location={location} />,
      });
      setIsOpen(true);
    },
    [map, marker, getAddressComponent]
  );

  const onMarkerClick = useCallback(
    ({ domEvent }: { domEvent: MouseEvent }, parkingLot: ParkingLotDTO) => {
      const { location: { lat, lng } = {} } = parkingLot;

      if (!lat || !lng) return;

      domEvent.stopImmediatePropagation();
      marker?.setMap(null);
      zoomToPosition(lat, lng);

      setConfig({
        body: <ParkingLotForm parkingLot={parkingLot} />,
        footer: (
          <div className="flex w-full items-center justify-between">
            <span className="text-sm">
              {parkingLot.occupiedSpaces}/{parkingLot.capacity}{" "}
              {dict.en.occupied_spaces}
            </span>

            <Button
              aria-label={dict.en.reserve}
              title={dict.en.reserve}
              onClick={async () => {
                if (!parkingLot.id) return;

                const res = await reserveParkingLotHandler(parkingLot.id);

                if (!res) return;

                setIsOpen(false);
              }}
            >
              {dict.en.reserve}
            </Button>
          </div>
        ),
      });
      setIsOpen(true);
    },
    [marker, zoomToPosition]
  );

  useEffect(() => {
    if (!parkingLots || !map || typeof google === "undefined") return;

    const newMarkers: typeof markers = [];

    parkingLots.forEach((parkingLot) => {
      const { location } = parkingLot;

      if (!location?.lat || !location?.lng) return;

      newMarkers.push(
        new google.maps.Marker({
          map,
          position: new google.maps.LatLng({
            lat: location?.lat,
            lng: location.lng,
          }),
          clickable: true,
        })
      );
    });

    if (markers.length) {
      markers.forEach((marker) => marker.setMap(null));
    }

    setMarkers(newMarkers);

    return () => {
      markers.forEach((m) => m.unbindAll());
    };
  }, [map, parkingLots]);

  useEffect(() => {
    if (!parkingLots) return;

    markers.forEach((m, i) =>
      m.addListener("click", (event: { domEvent: MouseEvent }) =>
        onMarkerClick(event, parkingLots[i])
      )
    );

    return () => {
      markers.forEach((m) => m.unbindAll());
    };
  }, [parkingLots, markers, marker]);

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
