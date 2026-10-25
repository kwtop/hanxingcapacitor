import type { APIRoute } from 'astro';
import {localBackendProxy} from '../../server/localProxy';
export const prerender=false;
export const ALL:APIRoute=({request})=>localBackendProxy(request);
