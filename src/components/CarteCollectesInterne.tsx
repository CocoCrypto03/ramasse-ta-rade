"use client";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import "leaflet/dist/leaflet.css";
import type { Collecte } from "@/lib/types";
import { formatDateCourteFr, formatHeureFr } from "@/lib/temps";

// Centre par défaut : la rade de Brest.
const CENTRE_RADE: [number, number] = [48.375, -4.47];

function icone(couleur: string) {
  return L.divIcon({
    className: "",
    html: `<span style="display:block;width:22px;height:22px;border-radius:50%;background:${couleur};border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,.4)"></span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

const ICONE_A_VENIR = icone("#ff5a1f");
const ICONE_TERMINEE = icone("#6b7a73");

function GestionClic({ onClic }: { onClic?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClic?.(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function CarteCollectesInterne({
  collectes,
  pointSelectionne,
  onClicCarte,
  hauteurClasse = "h-[70vh]",
}: {
  collectes: Collecte[];
  pointSelectionne?: { lat: number; lng: number } | null;
  onClicCarte?: (lat: number, lng: number) => void;
  hauteurClasse?: string;
}) {
  return (
    <MapContainer
      center={CENTRE_RADE}
      zoom={12}
      scrollWheelZoom
      className={`w-full ${hauteurClasse} z-0`}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {onClicCarte && <GestionClic onClic={onClicCarte} />}

      {pointSelectionne && (
        <Marker position={[pointSelectionne.lat, pointSelectionne.lng]} icon={icone("#1c7d96")} />
      )}

      {collectes.map((c) => (
        <Marker
          key={c.id}
          position={[c.lat, c.lng]}
          icon={c.statut === "terminee" ? ICONE_TERMINEE : ICONE_A_VENIR}
        >
          <Popup>
            <div className="min-w-[180px]">
              <p className="font-semibold text-encre">{c.titre}</p>
              <p className="text-sm text-encre/70">
                {c.lieu}, {c.commune}
              </p>
              <p className="text-sm text-encre/70">
                {formatDateCourteFr(c.debut)} à {formatHeureFr(c.debut)}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-golfe">
                {c.statut === "terminee" ? "Terminée" : "À venir"}
              </p>
              <Link href={`/collecte/${c.id}`} className="mt-2 inline-block text-sm font-semibold text-bouee-dark underline">
                Voir le détail
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
