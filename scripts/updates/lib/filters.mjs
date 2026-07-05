/**
 * Filtros de actualizaciones — reexporta la lógica de intent.mjs.
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
} from "./intent.mjs";
