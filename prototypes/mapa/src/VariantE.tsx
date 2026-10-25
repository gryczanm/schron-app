// PROTOTYP wariant E: mapa na pełny ekran, legenda jako pływająca karta (zwijana), szczegóły w dymku przy punkcie.
import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { DOSTEPNOSC, Dane, Stopka, linkiNawigacji, useMapa, useZglosStan } from './shared';
import { Legenda, STYL_LIBERTY, dodajWarstwy, useFiltr, useWWidoku } from './mapaRunda2';

export const nazwa = 'Pełny ekran: pływająca legenda + dymek';

export function VariantE({ dane }: { dane: Dane }) {
  const { ref, mapa } = useMapa(STYL_LIBERTY);
  const [wybrany, setWybrany] = useState<number | null>(null);
  const [zwinieta, setZwinieta] = useState(false);
  const { filtry, przelacz } = useFiltr(mapa, dane);
  const wWidoku = useWWidoku(mapa, dane);
  const zglos = useZglosStan();
  const popup = useRef(new maplibregl.Popup({ maxWidth: '280px', offset: 12 }));

  useEffect(() => {
    if (!mapa) return;
    dodajWarstwy(mapa, dane, setWybrany);
    popup.current.on('close', () => setWybrany(null));
  }, [mapa]);
  useEffect(() => { zglos({ filtry: [...filtry].map((d) => DOSTEPNOSC[d].nazwa).join(', ') || '—', wybrany: wybrany != null ? dane.punkty[wybrany].id : '—', 'w widoku': wWidoku.join('/'), legenda: zwinieta ? 'zwinięta' : 'rozwinięta' }); }, [filtry, wybrany, wWidoku, zwinieta]);

  useEffect(() => {
    if (!mapa || wybrany == null) return;
    const p = dane.punkty[wybrany];
    const info = DOSTEPNOSC[p.d];
    const l = linkiNawigacji(p);
    popup.current.setLngLat([p.lng, p.lat]).setHTML(`
      <div style="font:13px system-ui">
        <div style="font-weight:600;font-size:14px">${p.adres}</div>
        <div style="color:#64748b;margin-bottom:6px">${p.gmina}</div>
        <div style="display:inline-block;padding:2px 8px;border-radius:99px;background:${info.kolor};color:#fff;font-weight:600">${info.nazwa}</div>
        <div style="margin:6px 0 8px">${info.opis}</div>
        <a href="${l.google}" target="_blank" style="display:block;text-align:center;padding:8px;border-radius:8px;background:#0f172a;color:#fff;text-decoration:none;font-weight:600">Prowadź</a>
      </div>`).addTo(mapa);
  }, [mapa, wybrany]);

  return (
    <div style={{ position: 'fixed', inset: 0, font: '14px system-ui' }}>
      <div ref={ref} style={{ position: 'absolute', inset: 0 }} />
      <div style={{
        position: 'absolute', top: 12, left: 12, width: 280, maxWidth: 'calc(100vw - 72px)', background: 'rgba(248,250,252,.96)',
        borderRadius: 14, boxShadow: '0 4px 16px rgba(0,0,0,.18)', padding: 12, boxSizing: 'border-box',
      }}>
        <button onClick={() => setZwinieta((z) => !z)} style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', border: 0, background: 'transparent', font: '800 16px system-ui', cursor: 'pointer', padding: 0, marginBottom: zwinieta ? 0 : 10 }}>
          Punkty schronienia <span style={{ fontSize: 14, color: '#64748b' }}>{zwinieta ? '▾' : '▴'}</span>
        </button>
        {!zwinieta && <Legenda filtry={filtry} przelacz={przelacz} wWidoku={wWidoku} />}
      </div>
      <Stopka stan={dane.stan} style={{ position: 'absolute', left: 12, bottom: 70, background: 'rgba(255,255,255,.9)', padding: '6px 8px', borderRadius: 6 }} />
    </div>
  );
}
