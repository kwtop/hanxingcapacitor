import { useEffect, useRef, useState } from 'react';
type Nav = { label: string; href: string; children: { label: string; href: string }[] }[];
export default function MobileNav({ nav, currentPath }: { nav: Nav; currentPath: string }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(() => nav.find(item => ((item.href === '/resources/' && currentPath.startsWith('/resources/')) || item.children.some(child => child.href === currentPath)))?.href ?? null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 801px)');
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);
  return <div className="mobile-nav" onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }} onKeyDown={event => {
    if (event.key === 'Escape' && open) {
      event.preventDefault(); setOpen(false); toggle.current?.focus();
    }
  }}>
    <button ref={toggle} type="button" className={open ? 'menu-toggle is-open' : 'menu-toggle'} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}><span className="menu-toggle-lines" aria-hidden="true"><span/><span/></span></button>
    <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile navigation" hidden={!open}>
      {nav.map((item, index) => <div className="mobile-menu-section" key={item.href}>
        <div className="mobile-menu-row">
          <a className="mobile-menu-primary" href={item.href} aria-current={item.href === currentPath ? 'page' : ((item.href === '/resources/' && currentPath.startsWith('/resources/')) || item.children.some(child => child.href === currentPath)) ? 'true' : undefined}>{item.label}</a>
          {item.children.length > 0 && <button type="button" className="mobile-submenu-toggle" aria-label={`${expanded === item.href ? 'Collapse' : 'Expand'} ${item.label}`} aria-expanded={expanded === item.href} aria-controls={`mobile-submenu-${index}`} onClick={() => setExpanded(expanded === item.href ? null : item.href)}><span aria-hidden="true">{expanded === item.href ? '−' : '+'}</span></button>}
        </div>
        {item.children.length > 0 && <div className="mobile-submenu" id={`mobile-submenu-${index}`} hidden={expanded !== item.href}>{item.children.map(child => <a key={child.href} href={child.href} aria-current={child.href === currentPath ? 'page' : undefined}>{child.label}</a>)}</div>}
      </div>)}

    </nav>
  </div>;
}
