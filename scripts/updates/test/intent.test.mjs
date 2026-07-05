import { test } from "node:test";
import assert from "node:assert/strict";
import { analyzeCommit, inferUpdateTag } from "../lib/intent.mjs";

const GOLDEN = [
  {
    message: "[novedad] Lanzar panel nuevo",
    publish: true,
    reason: "marker:forced",
  },
  {
    message: "[skip update] algo",
    publish: false,
    reason: "marker:skip-update",
  },
  {
    message: "chore: actualizar lockfile de pnpm",
    publish: false,
    reason: "maintenance-subject",
  },
  {
    message: "feat: añadir selector de región BR",
    publish: true,
    reason: "conventional:publish:feat",
  },
  {
    message:
      "corregir vista previa del QR cuando el logo supera el tamaño máximo",
    publish: true,
    reason: "user-facing:descriptive-subject",
  },
  {
    message: "fix: typo",
    publish: false,
    reason: "maintenance-subject",
  },
  {
    message: "Añadir región BR al selector y mostrar 6 regiones.",
    publish: true,
    reason: "allowlist-subject",
  },
  {
    message: "wip cambios",
    publish: false,
    reason: "maintenance-subject",
  },
];

for (const [index, case_] of GOLDEN.entries()) {
  test(`golden #${index + 1}: ${case_.reason}`, () => {
    const result = analyzeCommit(case_.message);
    assert.equal(result.publish, case_.publish, `publish mismatch`);
    assert.equal(result.reason, case_.reason, `reason mismatch`);
  });
}

test("tag scoring: bug + rendimiento → Fix gana si más matches Fix", () => {
  const tag = inferUpdateTag("corregir bug de rendimiento en el panel");
  assert.equal(tag, "Fix");
});

test("tag scoring: mejorar rendimiento sin bug → Optimización", () => {
  const tag = inferUpdateTag("mejorar rendimiento del generador QR");
  assert.equal(tag, "Optimización");
});
