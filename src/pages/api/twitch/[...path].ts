import type { APIRoute } from 'astro';
import { twitchApiUrl } from '../../../data/community';
import { createProxy } from '../../../utils/proxy';

export const ALL: APIRoute = createProxy(twitchApiUrl);
