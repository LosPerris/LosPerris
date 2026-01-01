import type { APIRoute } from 'astro';
import { malaworldApiUrl } from '../../../data/community';
import { createProxy } from '../../../utils/proxy';

export const ALL: APIRoute = createProxy(malaworldApiUrl);
