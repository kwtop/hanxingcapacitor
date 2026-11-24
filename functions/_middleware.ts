import documents from '../.backend-functions/public-markdown.json';
import {negotiatePublicMarkdown,type PublicMarkdownPages} from '../src/server/markdownNegotiation';

export const onRequest=({request,next}:{request:Request;next:()=>Promise<Response>})=>negotiatePublicMarkdown(request,documents as PublicMarkdownPages,next);
