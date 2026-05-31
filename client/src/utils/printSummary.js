import { findBottle, findPump, findCap, PUMP_COLORS, COATING_OPTIONS } from '../config/catalog';
import { findPack, NEXERA } from '../config/nexera';

export const printSummaryPdf = (stateProxy) => {
  const bottle = findBottle(stateProxy.bottleCatalogId);
  const pump = findPump(stateProxy.pumpId);
  const cap = findCap(stateProxy.capCatalogId);
  const pack = findPack(stateProxy.selectedPack);
  const pumpColorLabel = PUMP_COLORS.find((c) => c.hex === stateProxy.pumpColor)?.label ?? '—';
  const coatingLabel = COATING_OPTIONS.find((c) => c.id === stateProxy.coatingType)?.label ?? '—';

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${NEXERA.name} — Récapitulatif</title>
<style>
  body { font-family: Arial, sans-serif; padding: 40px; color: #1A1A1A; }
  h1 { font-size: 22px; margin-bottom: 24px; }
  h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; margin: 20px 0 8px; color: #666; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
  td { padding: 6px 0; border-bottom: 1px solid #eee; font-size: 13px; }
  td:first-child { color: #888; width: 40%; }
  .footer { margin-top: 32px; font-size: 11px; color: #999; }
</style></head><body>
  <h1>${NEXERA.name} — Configuration packaging</h1>
  <h2>Projet</h2>
  <table>
    <tr><td>Univers</td><td>${stateProxy.selectedUniverse ?? 'parfumerie'}</td></tr>
    <tr><td>Pack</td><td>${pack?.name ?? '—'}</td></tr>
  </table>
  <h2>Flacon</h2>
  <table>
    <tr><td>Nom</td><td>${bottle?.name ?? '—'}</td></tr>
    <tr><td>Catégorie</td><td>${bottle?.category ?? '—'}</td></tr>
    <tr><td>Volume</td><td>${bottle?.volumeMl ? `${bottle.volumeMl} ml` : '—'}</td></tr>
    <tr><td>Couleur</td><td>${stateProxy.color}</td></tr>
  </table>
  <h2>Pompe</h2>
  <table>
    <tr><td>Nom</td><td>${stateProxy.showPump ? pump?.name ?? '—' : 'Aucune'}</td></tr>
    <tr><td>Couleur</td><td>${stateProxy.showPump ? pumpColorLabel : '—'}</td></tr>
  </table>
  <h2>Bouchon</h2>
  <table>
    <tr><td>Nom</td><td>${cap?.name ?? '—'}</td></tr>
    <tr><td>Forme</td><td>${cap?.shape ?? '—'}</td></tr>
    <tr><td>Matériau</td><td>${cap?.material ?? '—'}</td></tr>
    <tr><td>Finition</td><td>${cap?.capFinish ?? '—'}</td></tr>
  </table>
  <h2>Design</h2>
  <table>
    <tr><td>Revêtement</td><td>${coatingLabel}</td></tr>
    <tr><td>Parfum</td><td>${stateProxy.fragranceName ?? '—'}</td></tr>
    <tr><td>Logo</td><td>${stateProxy.isLogoTexture ? 'Oui' : 'Non'}</td></tr>
  </table>
  <p class="footer">${NEXERA.address} — Les couleurs à l'écran peuvent différer du produit final.</p>
</body></html>`;

  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
};
