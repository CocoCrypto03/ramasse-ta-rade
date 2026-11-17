"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import "leaflet/dist/leaflet.css";
import type { Collecte } from "@/lib/types";
import { formatDateCourteFr, formatHeureFr, jourMoisAbregeFr } from "@/lib/temps";

// Centre et zoom par défaut si on n'a aucun point à cadrer (rade de Brest).
const CENTRE_RADE: [number, number] = [48.375, -4.47];
const ZOOM_PAR_DEFAUT = 11;

function icone(couleur: string) {
  return L.divIcon({
    className: "",
    html: `<span style="display:block;width:22px;height:22px;border-radius:50%;background:${couleur};border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,.4)"></span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

// Pastille « jour / mois » pour repérer une collecte sans avoir à ouvrir sa
// bulle — grisée et estompée pour une collecte terminée, vive sinon
// (lisibilité pour des personnes âgées : contraste fort, grand texte).
function iconeCollecte(c: Collecte) {
  const { jour, moisAbrege } = jourMoisAbregeFr(c.debut);
  const terminee = c.statut === "terminee";
  const fond = terminee ? "#6b7a73" : "#ff5a1f";
  return L.divIcon({
    className: "",
    html: `<span style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;width:38px;height:38px;border-radius:9999px;background:${fond};border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,.45);color:white;font-family:system-ui,sans-serif;${
      terminee ? "opacity:.82;" : ""
    }">
        <span style="font-size:14px;font-weight:800;line-height:1;">${jour}</span>
        <span style="font-size:8px;font-weight:700;letter-spacing:.04em;line-height:1.2;">${moisAbrege}</span>
      </span>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -16],
  });
}

function GestionClic({ onClic }: { onClic?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClic?.(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

/**
 * Cadre automatiquement la vue pour que TOUS les points donnés soient
 * visibles, quelle que soit la largeur d'écran (US-01) — avec une marge, et
 * sans jamais trop zoomer quand il n'y a qu'un seul point. Se déclenche à
 * chaque changement de la liste de points (ex. sélection d'un emplacement
 * dans le formulaire de création), sans jamais gêner cette sélection : on ne
 * fait que recadrer la vue, jamais qu'on n'empêche le clic suivant.
 */
function AjusterVue({ points, interactif }: { points: [number, number][]; interactif: boolean }) {
  const carte = useMap();

  useEffect(() => {
    if (points.length === 0) {
      carte.setView(CENTRE_RADE, ZOOM_PAR_DEFAUT);
      return;
    }
    if (points.length === 1) {
      carte.setView(points[0], interactif ? 15 : 14);
      return;
    }
    carte.fitBounds(L.latLngBounds(points), { padding: [32, 32], maxZoom: 15 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(points), interactif]);

  return null;
}

export default function CarteCollectesInterne({
  collectes,
  pointSelectionne,
  onClicCarte,
  hauteurClasse = "h-[70vh]",
  interactif = true,
}: {
  collectes: Collecte[];
  pointSelectionne?: { lat: number; lng: number } | null;
  onClicCarte?: (lat: number, lng: number) => void;
  hauteurClasse?: string;
  /** false pour une mini-carte de consultation (page détail) : sans défilement ni zoom tactile. */
  interactif?: boolean;
}) {
  const points: [number, number][] = [
    ...collectes.map((c): [number, number] => [c.lat, c.lng]),
    ...(pointSelectionne ? [[pointSelectionne.lat, pointSelectionne.lng] as [number, number]] : []),
  ];

  return (
    <MapContainer
      center={CENTRE_RADE}
      zoom={ZOOM_PAR_DEFAUT}
      scrollWheelZoom={interactif}
      dragging={interactif}
      doubleClickZoom={interactif}
      touchZoom={interactif}
      zoomControl={interactif}
      className={`w-full ${hauteurClasse} z-0`}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <AjusterVue points={points} interactif={interactif} />

      {onClicCarte && <GestionClic onClic={onClicCarte} />}

      {pointSelectionne && (
        <Marker position={[pointSelectionne.lat, pointSelectionne.lng]} icon={icone("#1c7d96")} />
      )}

      {collectes.map((c) => (
        <Marker key={c.id} position={[c.lat, c.lng]} icon={iconeCollecte(c)}>
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
