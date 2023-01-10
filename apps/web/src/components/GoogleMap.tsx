import { BUCHAREST_COORDS } from "@/constants";
import GoogleMapReact from "google-map-react";
import { useCallback, useState } from "react";

const GoogleMap = () => {
  const [map, setMap] = useState<google.maps.Map>();
  const [marker, setMarker] = useState<google.maps.Marker>();

  const onClick = useCallback(
    ({ lat, lng }: GoogleMapReact.ClickEventValue) => {
      if (!map) return;

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
    },
    [map, marker]
  );

  return (
    <div className="h-screen w-full">
      <GoogleMapReact
        center={BUCHAREST_COORDS}
        zoom={12}
        bootstrapURLKeys={{ key: "AIzaSyC2AE8Jgsf4KWQAQia9O0pZdKpVY7Zy29M" }}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map }) => {
          setMap(map);
        }}
        onClick={onClick}
      >
        {/* <div
          className="w-4 h-4 bg-red"
          lat={BUCHAREST_COORDS.lat}
          lng={BUCHAREST_COORDS.lng}
        ></div> */}
      </GoogleMapReact>
    </div>
  );
};

export default GoogleMap;
