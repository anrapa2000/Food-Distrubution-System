import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { MatchedDonation } from "../types/MatchedDonation";
import L from "leaflet";

interface MatchMapProps {
  matches: MatchedDonation[];
}

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MatchMap: React.FC<MatchMapProps> = ({ matches }) => {
  const center: [number, number] = [12.93, 77.61]; // Default center (Bangalore)

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "400px", width: "100%", margin: "1rem 0" }}
    >
      <TileLayer
        attribution='© <a href="https://osm.org">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {matches.map((match) => (
        <>
          <Marker
            key={match.donationId + "-donor"}
            position={[match.lat, match.lon]}
            icon={icon}
          >
            <Popup>
              🧑 <strong>Donor:</strong> {match.donorId}
              <br />
              Qty: {match.quantity}
            </Popup>
          </Marker>

          <Marker
            key={match.donationId + "-ngo"}
            position={[match.ngoLat, match.ngoLon]}
            icon={icon}
          >
            <Popup>
              🏥 <strong>NGO:</strong> {match.ngoName}
              <br />
              ID: {match.ngoId}
            </Popup>
          </Marker>
        </>
      ))}
    </MapContainer>
  );
};

export default MatchMap;
