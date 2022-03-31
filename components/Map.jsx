import GoogleMapReact from "google-map-react";

export const Map = ({ coordinates }) => {
  const center = {
    lat: coordinates.latitude,
    lng: coordinates.longitude,
  };

  const handleApiLoaded = ({ map, maps }) => {
    new maps.Marker({
      map,
      position: center,
    });
  };

  return (
    <div style={{ height: "30vh", width: "100%" }}>
      <GoogleMapReact
        // bootstrapURLKeys={{ key: process.env.GOOGLE_MAP_API_KEY }}
        bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY }}
        defaultCenter={center}
        defaultZoom={18}
        onGoogleApiLoaded={handleApiLoaded}
      ></GoogleMapReact>
    </div>
  );
};
