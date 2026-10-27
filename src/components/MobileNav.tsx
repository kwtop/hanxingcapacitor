import { useEffect, useRef, useState } from 'react';
type Nav = { label: string; href: string; children: { label: string; href: string }[] }[];
export default function MobileNav({ nav, currentPath, desktopBreakpoint = 801, animated = false, inquiryAction = false }: { nav: Nav; currentPath: string; desktopBreakpoint?: number; animated?: boolean; inquiryAction?: boolean }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(() => nav.find(item => ((item.href === '/resources/' && currentPath.startsWith('/resources/')) || item.children.some(child => child.href === currentPath)))?.href ?? null);
  const toggle = useRef<HTMLButtonElement>(null);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const desktop = window.matchMedia(`(min-width: ${desktopBreakpoint}px)`);
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, [desktopBreakpoint]);
  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => { if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [open]);
  return <div ref={root} className={animated ? 'mobile-nav has-menu-motion' : 'mobile-nav'} onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }} onKeyDown={event => {
    if (event.key === 'Escape' && open) {
      event.preventDefault(); setOpen(false); toggle.current?.focus();
    }
  }}>
    <button ref={toggle} type="button" className={open ? 'menu-toggle is-open' : 'menu-toggle'} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}><span className="menu-toggle-lines" aria-hidden="true"><span/><span/></span></button>
    <nav id="mobile-menu" className={animated ? 'mobile-menu mobile-menu-motion' : 'mobile-menu'} aria-label="Mobile navigation" hidden={animated ? undefined : !open} data-open={animated ? open : undefined} aria-hidden={animated ? !open : undefined} inert={animated ? !open : undefined} onClick={event => { if ((event.target as HTMLElement).closest('a')) setOpen(false); }}>
      {nav.map((item, index) => <div className="mobile-menu-section" key={item.href}>
        <div className="mobile-menu-row">
          <a className="mobile-menu-primary" href={item.href} aria-current={item.href === currentPath ? 'page' : ((item.href === '/resources/' && currentPath.startsWith('/resources/')) || item.children.some(child => child.href === currentPath)) ? 'true' : undefined}>{item.label}</a>
          {item.children.length > 0 && <button type="button" className="mobile-submenu-toggle" aria-label={`${expanded === item.href ? 'Collapse' : 'Expand'} ${item.label}`} aria-expanded={expanded === item.href} aria-controls={`mobile-submenu-${index}`} onClick={() => setExpanded(expanded === item.href ? null : item.href)}><span className={animated ? 'mobile-submenu-symbol' : undefined} aria-hidden="true">{animated ? null : expanded === item.href ? '−' : '+'}</span></button>}
        </div>
        {item.children.length > 0 && <div className="mobile-submenu" id={`mobile-submenu-${index}`} hidden={animated ? undefined : expanded !== item.href} data-expanded={animated ? expanded === item.href : undefined} aria-hidden={animated ? !open || expanded !== item.href : undefined} inert={animated ? !open || expanded !== item.href : undefined}>{animated ? <div className="mobile-submenu-clip"><div className="mobile-submenu-links">{item.children.map(child => <a key={child.href} href={child.href} aria-current={child.href === currentPath ? 'page' : undefined}>{child.label}</a>)}</div></div> : item.children.map(child => <a key={child.href} href={child.href} aria-current={child.href === currentPath ? 'page' : undefined}>{child.label}</a>)}</div>}
      </div>)}
      {inquiryAction && <a className="su-mobile-inquiry" href="/contact/">Start an inquiry</a>}
    </nav>
  </div>;
}
