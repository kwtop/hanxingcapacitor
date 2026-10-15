import { useEffect, useMemo, useState, type CSSProperties, type KeyboardEvent } from 'react';

type Scheme = {
  id: string;
  name: string;
  heading: string;
  body: string;
  kind: 'Single family' | 'Heading + body';
  description: string;
};

const schemes: Scheme[] = [
  { id: 'inter', name: 'Inter Variable', heading: 'Inter Variable', body: 'Inter Variable', kind: 'Single family', description: 'The selected site-wide typeface with a continuous weight range.' },
  { id: 'manrope', name: 'Manrope', heading: 'Manrope', body: 'Manrope', kind: 'Single family', description: 'Geometric construction with a softer, more branded outline.' },
  { id: 'geist', name: 'Geist', heading: 'Geist', body: 'Geist', kind: 'Single family', description: 'A contemporary grotesk with crisp, compact interface texture.' },
  { id: 'dm-sans', name: 'DM Sans', heading: 'DM Sans', body: 'DM Sans', kind: 'Single family', description: 'An approachable sans with open forms and even rhythm.' },
  { id: 'plus-jakarta-sans', name: 'Plus Jakarta Sans', heading: 'Plus Jakarta Sans', body: 'Plus Jakarta Sans', kind: 'Single family', description: 'Polished geometric shapes with a broader, warmer cadence.' },
  { id: 'ibm-plex-sans', name: 'IBM Plex Sans', heading: 'IBM Plex Sans', body: 'IBM Plex Sans', kind: 'Single family', description: 'A technical, utilitarian voice with distinctive punctuation.' },
  { id: 'source-sans-3', name: 'Source Sans 3', heading: 'Source Sans 3', body: 'Source Sans 3', kind: 'Single family', description: 'A humanist screen sans with a calm long-form reading texture.' },
  { id: 'space-grotesk', name: 'Space Grotesk', heading: 'Space Grotesk', body: 'Space Grotesk', kind: 'Single family', description: 'A geometric display voice with more visible character.' },
  { id: 'manrope-inter', name: 'Manrope + Inter Variable', heading: 'Manrope', body: 'Inter Variable', kind: 'Heading + body', description: 'A restrained headline signature paired with a dependable reading face.' },
  { id: 'geist-source-sans', name: 'Geist + Source Sans 3', heading: 'Geist', body: 'Source Sans 3', kind: 'Heading + body', description: 'Crisp interface headings with a softer, spacious text voice.' },
  { id: 'space-source-sans', name: 'Space Grotesk + Source Sans 3', heading: 'Space Grotesk', body: 'Source Sans 3', kind: 'Heading + body', description: 'Distinctive headings balanced by a highly readable body face.' },
];

const familyStack = (family: string) => `"${family}", system-ui, sans-serif`;

const scales = [
  ['Display', '64px / 1.04'],
  ['H1', '48px / 1.10'],
  ['H2', '36px / 1.15'],
  ['H3', '24px / 1.25'],
  ['Body Large', '18px / 1.60'],
  ['Body', '16px / 1.65'],
  ['Small', '14px / 1.50'],
  ['Caption', '12px / 1.40'],
];

export default function TypographyPreview() {
  const [selectedId, setSelectedId] = useState('inter');
  const selectedIndex = schemes.findIndex((scheme) => scheme.id === selectedId);
  const selected = schemes[selectedIndex] ?? schemes[0];
  const options = useMemo(() => ({
    '--preview-font-display': familyStack(selected.heading),
    '--preview-font-heading': familyStack(selected.heading),
    '--preview-font-body': familyStack(selected.body),
    '--preview-font-ui': familyStack(selected.body),
  }) as CSSProperties, [selected]);

  useEffect(() => {
    document.body.dataset.typographyPreview = 'true';
    return () => {
      delete document.body.dataset.typographyPreview;
      ['--preview-font-display', '--preview-font-heading', '--preview-font-body', '--preview-font-ui'].forEach((name) => document.body.style.removeProperty(name));
    };
  }, []);

  useEffect(() => {
    document.body.style.setProperty('--preview-font-display', familyStack(selected.heading));
    document.body.style.setProperty('--preview-font-heading', familyStack(selected.heading));
    document.body.style.setProperty('--preview-font-body', familyStack(selected.body));
    document.body.style.setProperty('--preview-font-ui', familyStack(selected.body));
  }, [selected]);

  const step = (direction: number) => {
    const nextIndex = (selectedIndex + direction + schemes.length) % schemes.length;
    setSelectedId(schemes[nextIndex].id);
  };

  const handleSwitcherKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    if (event.target instanceof HTMLSelectElement) return;
    event.preventDefault();
    step(event.key === 'ArrowRight' ? 1 : -1);
  };

  return (
    <div className="typography-preview" style={options} onKeyDown={handleSwitcherKeyDown}>
      <div className="tp-container">
        <header className="tp-heading">
          <div>
            <p className="tp-kicker">TYPE STUDY <span>HANXING / B2B</span></p>
            <h1>Typography preview</h1>
            <p className="tp-intro-copy">Inter Variable is the site-wide typeface. This specimen keeps the earlier font alternatives available for comparison.</p>
          </div>
          <p className="tp-status">Preview only<br /><strong>Site font: Inter Variable</strong></p>
        </header>

        <section className="tp-selector" aria-label="Typography selector">
          <div className="tp-selector-label">
            <label htmlFor="type-scheme">Typography selector</label>
            <span>{selected.kind} · {selectedIndex + 1} of {schemes.length}</span>
          </div>
          <div className="tp-selector-controls">
            <button className="tp-step" type="button" onClick={() => step(-1)} aria-label="Previous font scheme">Previous</button>
            <select id="type-scheme" value={selected.id} onChange={(event) => setSelectedId(event.target.value)}>
              <optgroup label="Single font">
                {schemes.filter((scheme) => scheme.kind === 'Single family').map((scheme) => <option key={scheme.id} value={scheme.id}>{scheme.name}</option>)}
              </optgroup>
              <optgroup label="Font combinations">
                {schemes.filter((scheme) => scheme.kind === 'Heading + body').map((scheme) => <option key={scheme.id} value={scheme.id}>{scheme.name}</option>)}
              </optgroup>
            </select>
            <button className="tp-step" type="button" onClick={() => step(1)} aria-label="Next font scheme">Next</button>
          </div>
          <p className="tp-scheme-note"><strong>{selected.name}</strong><span>{selected.description}</span></p>
          <p className="tp-key-note">Use the Previous / Next buttons or the left and right keys to compare.</p>
        </section>

        <section className="tp-specimen" aria-label={`Website type specimen using ${selected.name}`}>
          <div className="tp-mock-navigation">
            <span className="tp-mock-wordmark">HAN XING</span>
            <nav aria-label="Navigation specimen">
              <a href="#type-hierarchy">Products</a>
              <a href="#type-hierarchy">Applications</a>
              <a href="#product-specimen">Projects</a>
              <a href="#type-data">Support</a>
              <a href="#font-tokens">About</a>
              <a href="#recommendations">Contact</a>
            </nav>
          </div>

          <section className="tp-hero">
            <p className="tp-eyebrow">COMMERCIAL TRANSPORT / GLOBAL MARKETS</p>
            <h2>Engineered Vehicles.<br />Built for Real Work.</h2>
            <div className="tp-button-row">
              <button className="tp-button tp-button-dark" type="button">Explore Vehicles</button>
              <button className="tp-button tp-button-light" type="button">Contact</button>
              <button className="tp-button tp-button-text" type="button">View Project</button>
            </div>
            <p className="tp-hero-caption">Display · 64 px / 1.04 · Weight 600</p>
          </section>

          <section className="tp-hierarchy" id="type-hierarchy">
            <div className="tp-section-title">
              <span className="tp-scale-label">H1 · 48 / 1.10</span>
              <h2>Commercial Vehicles Built Around Your Requirements</h2>
            </div>
            <div className="tp-hierarchy-body">
              <div>
                <span className="tp-scale-label">H2 · 36 / 1.15</span>
                <h3>Why Global Buyers Choose Us</h3>
              </div>
              <div className="tp-copy-test">
                <span className="tp-scale-label">Body Large · 18 / 1.60</span>
                <p className="tp-body-large">We design and manufacture commercial vehicles for demanding applications across global markets. From chassis configuration to body structure and auxiliary systems, every vehicle can be adapted to local regulations and operating conditions.</p>
                <span className="tp-scale-label">Body · 16 / 1.65</span>
                <p className="tp-body">Reliable supply begins with clear engineering requirements. Review the platform, operating environment and destination-market rules before confirming a vehicle configuration.</p>
                <p className="tp-small">Available configurations may vary depending on chassis, destination market and local regulations.</p>
                <span className="tp-caption">Caption · 12 / 1.40 · Small · 14 / 1.50</span>
              </div>
            </div>
            <div className="tp-weight-test">
              <span className="tp-scale-label">WEIGHT TEST · SAME SIZE AND COPY</span>
              <div className="tp-weight-grid">
                {[400, 500, 600, 700].map((weight) => <p key={weight} style={{ fontWeight: weight }}><span>{weight}</span>Global engineering for demanding applications</p>)}
              </div>
            </div>
          </section>

          <section className="tp-ui-specimens" id="product-specimen">
            <div className="tp-product-block">
              <span className="tp-scale-label">PRODUCT CARD · H3 24 / 1.25</span>
              <article className="tp-product-card">
                <div className="tp-product-head"><span>BODY TYPE / 04</span><span>GLOBAL RANGE</span></div>
                <h3>Refrigerated Truck</h3>
                <p>Reliable temperature-controlled transportation for food, pharmaceuticals and temperature-sensitive cargo.</p>
                <a href="#type-data">View Details</a>
              </article>
            </div>
            <div className="tp-data-block" id="type-data">
              <span className="tp-scale-label">TECHNICAL DATA · BODY 16 / 1.65</span>
              <table className="tp-data-table">
                <tbody>
                  <tr><th scope="row">GVW</th><td>18,000 kg</td></tr>
                  <tr><th scope="row">Engine Power</th><td>220 HP</td></tr>
                  <tr><th scope="row">Wheelbase</th><td>4,500 mm</td></tr>
                  <tr><th scope="row">Emission Standard</th><td>Euro VI</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="tp-number-section">
            <div className="tp-number-heading"><span className="tp-scale-label">NUMERALS / SIGNS / UNIT PAIRS</span><span className="tp-caption">Tabular figures enabled</span></div>
            <div className="tp-number-grid">
              {['01', '2026', '18,000 kg', '220 HP', '4×2', '6×4', '-18°C', '99.9%'].map((value) => <span key={value}>{value}</span>)}
            </div>
          </section>

          <section className="tp-case-tests">
            <div>
              <span className="tp-scale-label">CASE TEST</span>
              <p className="tp-uppercase">SPECIAL VEHICLES</p>
              <p>Special Vehicles</p>
              <p className="tp-lowercase">special vehicles</p>
            </div>
            <div className="tp-chinese-test" lang="zh-CN">
              <span className="tp-scale-label">中文测试 · SYSTEM CJK FALLBACK</span>
              <h3>专业车辆解决方案</h3>
              <p>根据不同国家法规、道路条件和实际使用场景，为客户提供定制化车辆解决方案。</p>
            </div>
          </section>

          <figure className="tp-quote">
            <figcaption>TYPE SPECIMEN</figcaption>
            <blockquote>“Start with the label, then verify the connection layout and installed space.”</blockquote>
          </figure>
        </section>

        <section className="tp-tokens" id="font-tokens">
          <div className="tp-tokens-heading"><div><p className="tp-kicker">SYSTEM OUTPUT</p><h2>Typography tokens</h2></div><p>Selected scheme: <strong>{selected.name}</strong></p></div>
          <div className="tp-token-layout">
            <div className="tp-token-list" aria-label="Font family tokens">
              <div><code>--font-display</code><span>{selected.heading}</span></div>
              <div><code>--font-heading</code><span>{selected.heading}</span></div>
              <div><code>--font-body</code><span>{selected.body}</span></div>
              <div><code>--font-ui</code><span>{selected.body}</span></div>
              <div><code>--font-mono</code><span>ui-monospace, Consolas, monospace</span></div>
            </div>
            <div className="tp-scale-list" aria-label="Typography scale tokens">
              {scales.map(([name, value]) => <div key={name}><span>{name}</span><code>{value}</code></div>)}
              <div><span>Button / Navigation / Label</span><code>14px / 1.45 · 500</code></div>
            </div>
          </div>
          <p className="tp-token-note">Font families affect this preview only. Chinese glyphs use the operating system’s sans-serif fallback because the Latin candidates do not provide a comparable Simplified Chinese family.</p>
        </section>

        <section className="tp-recommendations" id="recommendations">
          <div className="tp-recommendation-heading"><p className="tp-kicker">EARLIER DESIGN REVIEW</p><h2>Previous font comparisons</h2><p>Inter Variable is now applied across the site. These notes preserve the earlier comparison for reference.</p></div>
          <article className="tp-recommendation">
            <div className="tp-rec-name"><span>01 · PRIOR RECOMMENDATION</span><h3>Manrope + Inter Variable</h3><p>Heading: Manrope · Body / UI / data: Inter Variable</p></div>
            <dl><div><dt>适合的感觉</dt><dd>专业、现代、略有品牌识别，仍保持工业品供应商应有的克制。</dd></div><div><dt>优点与注意点</dt><dd>标题有比纯系统字体更多的轮廓，正文和界面阅读稳定。Manrope 字面略宽，长标题需要检查换行；避免全部使用 700 粗体。</dd></div><div><dt>标题表现</dt><dd>Manrope 600，主标题 600 或 700；章节标题 600，卡片标题 600。</dd></div><div><dt>正文表现</dt><dd>Inter 400，16px / 1.65；适合产品说明、选型指南与询盘提示。</dd></div><div><dt>数字 / 参数</dt><dd>Inter 500，启用 tabular numerals；参数表对齐清楚，符号和单位易区分。</dd></div><div><dt>移动端</dt><dd>整体稳妥；较长 H1 采用统一的响应式字号，不必针对字体单独压缩。</dd></div><div><dt>长期品牌字体</dt><dd>适合。可通过标题字重建立识别，同时把长期正文维护成本控制在低水平。</dd></div></dl>
          </article>
          <article className="tp-recommendation">
            <div className="tp-rec-name"><span>02 · ENGINEERING CHARACTER</span><h3>IBM Plex Sans</h3><p>Heading / Body / UI: IBM Plex Sans</p></div>
            <dl><div><dt>适合的感觉</dt><dd>工程、制造、技术文档导向，具有明确的工业语气。</dd></div><div><dt>优点与注意点</dt><dd>参数、标点和复杂术语表现清楚；辨识度高。整体更理性、更工具化，精致感和亲和力弱于 Manrope。</dd></div><div><dt>标题表现</dt><dd>600 字重稳重，标题形状有性格；Display 建议控制在 600，避免显得笨重。</dd></div><div><dt>正文表现</dt><dd>400 字重适合技术文章和较长说明，建议与现有行宽一起检查。</dd></div><div><dt>数字 / 参数</dt><dd>清晰、区分度好，符合额定值、单位和规格表的阅读情境。</dd></div><div><dt>移动端</dt><dd>小字号和紧凑导航可读性强；宽标题仍需控制行长。</dd></div><div><dt>长期品牌字体</dt><dd>适合希望强化“工程制造商”身份的长期系统；需要接受较明显的技术气质。</dd></div></dl>
          </article>
          <article className="tp-recommendation">
            <div className="tp-rec-name"><span>03 · NOW IN USE</span><h3>Inter Variable</h3><p>Heading / Body / UI: Inter Variable</p></div>
            <dl><div><dt>适合的感觉</dt><dd>国际化、清楚、中性，优先强调信息传达和操作熟悉度。</dd></div><div><dt>优点与注意点</dt><dd>多语言与界面场景适应面广，数字和控件表现可靠。单独作为全站字体时品牌个性较弱，易与常见 SaaS 网站相似。</dd></div><div><dt>标题表现</dt><dd>紧凑直接，600 字重足够清晰；需要依靠布局和字重层级塑造品牌感。</dd></div><div><dt>正文表现</dt><dd>稳健易读，适合产品详情、FAQ、采购准备清单和长文。</dd></div><div><dt>数字 / 参数</dt><dd>表现非常稳妥；可使用等宽数字让不同型号与数据列更便于扫描。</dd></div><div><dt>移动端</dt><dd>适应性强，缩小字号后字面仍清晰，是风险最低的方案。</dd></div><div><dt>长期品牌字体</dt><dd>适合稳定的企业 UI；若需要更强的品牌记忆，建议与有节制的标题字体搭配。</dd></div></dl>
          </article>
        </section>
        <footer className="tp-footer-note">Inter Variable is applied site-wide. Switching schemes changes this preview only.</footer>
      </div>
    </div>
  );
}
