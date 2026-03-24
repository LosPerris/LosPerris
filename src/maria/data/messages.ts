export const messages: string[] = [
  "Eres la razón por la que cada mañana tiene sentido. Te amo, María.",
  "No existe palabra en ningún idioma que alcance para describir lo que siento por ti, majito.",
  "Cada vez que te miro, descubro algo nuevo que me enamora de ti.",
  "Tu risa es mi canción favorita y espero escucharla por siempre, majito.",
  "Eres el tipo de persona que hace que todo valga la pena.",
  "Contigo aprendí que el amor no se busca, simplemente llega y lo cambia todo.",
  "Hasta en los días grises, pensar en ti me llena de luz, majito.",
  "Tenerte es tener el mundo entero, ¿qué más podría necesitar?",
  "Eres mi lugar favorito en este mundo, María.",
  "Gracias por existir, por estar y por ser exactamente quien eres, majito.",
  "No hay distancia que pueda apagar lo que siento por ti.",
  "Me enamoré de tu mente antes de darme cuenta de que ya era demasiado tarde para el corazón.",
  "Tu presencia transforma cualquier momento en un recuerdo que quiero guardar para siempre.",
  "Si pudiera elegir una vez más, te elegiría a ti, sin dudar un instante, majito.",
  "Amo cómo me haces querer ser mejor persona cada día.",
  "Hay algo en la forma en que me miras que me hace sentir que todo está bien.",
  "Eres mi ancla y mis alas al mismo tiempo, majito.",
  "Cada 'te quiero' que te digo lleva años de sentimientos guardados.",
  "Contigo descubrí que el hogar no es un lugar, es una persona.",
  "Te quiero en los días bonitos y mucho más en los complicados, majito.",
  "Eres la parte más bonita de mi historia, María.",
  "Si el amor fuera una fotografía, tendrías tu cara.",
  "Gracias por quedarte cuando todo lo demás pasaba, majito.",
  "Eres todo lo que nunca supe que necesitaba y todo lo que siempre quise.",
  "Amar es verte sonreír y saber que fui parte de eso.",
  "Tu forma de ver el mundo me hizo verlo completamente diferente, majito.",
  "Cada día a tu lado es un regalo que no merezco pero agradezco con todo mi ser.",
  "Eres mi persona favorita, hoy y siempre, majito.",
  "Lo que siento por ti no cabe en palabras, pero lo intento igual porque te mereces escucharlo.",
  "Si el tiempo se detuviera, elegiría detenerlo en cualquier momento contigo.",
  "Te amo de maneras que no sabía que era capaz de amar, majito.",
  "Contigo todo tiene más sabor, más color, más sentido.",
  "No necesito que el mundo me entienda, con que me entiendas tú es suficiente.",
  "Eres la promesa de que hay cosas en la vida que realmente valen la pena, majito.",
  "Me has enseñado que amar de verdad significa también estar en las partes difíciles.",
  "Cada noche que pienso en ti me doy cuenta de lo afortunado que soy.",
  "Eres mi razón favorita para sonreír sin motivo aparente, majito.",
  "Amarte es lo más natural que he hecho en mi vida.",
  "Tú eres el antes y el después de mi historia.",
  "Si tuviera que explicar la felicidad, empezaría contándoles de ti, majito.",
  "Lo mejor de despertar cada día es saber que tú también lo haces.",
  "María, te amo hoy más que ayer, y mañana te amaré más que hoy.",
  "Eres la única persona con quien quiero compartir mi caos y mi calma, majito.",
  "Gracias por hacerme sentir visto, escuchado y querido.",
  "Contigo aprendí que el amor verdadero se siente como llegar a casa, majito.",
  "Eres la música de fondo de mis mejores momentos.",
  "No existe versión de mi vida que prefiera sobre una donde estés tú.",
  "Cada detalle tuyo que aprendo me hace quererte más, majito.",
  "Eres el tipo de amor que te hace agradecer todo lo que pasaste antes para llegar aquí.",
  "Hoy y siempre, gracias por existir, María. Gracias por ser tú, majito.",
];

export function getDailyMessageIndex(
  epoch: Date = new Date(2026, 2, 23),
): number {
  const now = new Date();
  const daysSinceEpoch = Math.floor(
    (now.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24),
  );
  return (
    ((daysSinceEpoch % messages.length) + messages.length) % messages.length
  );
}

export function getDaysSinceStart(epoch: Date = new Date(2026, 2, 23)): number {
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24),
  );
  return Math.max(1, diffDays + 1);
}
