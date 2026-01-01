import type { APIRoute } from 'astro';
import { qrApiUrl } from '../../../data/community';
import { createProxy } from '../../../utils/proxy';

export const ALL: APIRoute = createProxy(qrApiUrl);
