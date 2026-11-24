import {cloneElement,isValidElement,type ReactNode} from 'react';
import {t,localHref,isSpanish} from './client';
// Translate the rendered element tree on every render, including menus, search
// results, modal captions and errors. Filter values/IDs/API payloads stay stable.
export function localizeTree(node:ReactNode):ReactNode {
  if(!isSpanish())return node;
  if(typeof node==='string')return t(node);
  if(Array.isArray(node))return node.map(localizeTree);
  if(!isValidElement<Record<string,unknown>>(node))return node;
  const props:Record<string,unknown>={};
  for(const key of ['alt','title','aria-label','placeholder','errorActionLabel'])if(typeof node.props[key]==='string')props[key]=t(node.props[key] as string);
  if(typeof node.props.href==='string'&&!node.props.hrefLang)props.href=localHref(node.props.href);
  if(node.props.children!==undefined)props.children=localizeTree(node.props.children as ReactNode);
  return cloneElement(node,props);
}
