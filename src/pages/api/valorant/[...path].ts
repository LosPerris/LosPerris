import type { APIRoute } from 'astro';
import { valorantApiUrl } from '../../../data/community';
import { createProxy } from '../../../utils/proxy';

export const ALL: APIRoute = createProxy(valorantApiUrl);
