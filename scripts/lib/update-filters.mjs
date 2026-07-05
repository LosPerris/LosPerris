/**
 * Filtros de novedades — reexporta la lógica de update-intent.mjs.
 *
 * Marcas manuales:
 *   [novedad] / [update]  → siempre publica
 *   [skip update]         → nunca publica
 *
 * Sin marcas: infiere del texto (español libre, feat:/fix:, contexto de producto…).
 */
export {
  analyzeCommit,
  shouldPublishCommit,
  filterStats,
  inferUpdateTag,
  cleanCommitTitle,
  splitCommitMessage,
} from "./update-intent.mjs";
