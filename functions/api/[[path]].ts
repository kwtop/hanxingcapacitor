import { handleBackend } from '../../src/server/router';
import type { BackendEnv } from '../../src/server/types';
export const onRequest = ({request,env}:{request:Request;env:BackendEnv}) => handleBackend(request,env);
