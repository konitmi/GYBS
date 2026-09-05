(() => {
  const root = document.getElementById('campaign-content');
  const params = new URLSearchParams(location.search);
  const code = params.get('id');
  const cfg = window.GYBS_CONFIG || {};
  const configured = cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && !cfg.SUPABASE_URL.startsWith('YOUR_') && !cfg.SUPABASE_ANON_KEY.startsWith('YOUR_');
  const esc = v => String(v ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const link = (label, url) => url ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>` : '';
  if (!code) { root.innerHTML = `<div class="campaign-error"><h1>Campaign not found.</h1><p>No campaign ID was supplied.</p></div>`; return; }
  if (!configured || !window.supabase) { root.innerHTML = `<div class="campaign-error"><h1>Backend not connected.</h1><p>Add the Supabase settings in <code>config.js</code> first.</p></div>`; return; }
  const db = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
  (async () => {
    const { data, error } = await db.from('campaigns').select('*').eq('campaign_code', code).maybeSingle();
    if (error || !data) { root.innerHTML = `<div class="campaign-error"><h1>Campaign not found.</h1><p>This campaign may still be under review or the link is incorrect.</p></div>`; return; }
    const d = data.details || {};
    const statusClass = data.status === 'live' ? 'state-live' : 'state-pending';
    const statusText = data.status === 'live' ? 'LIVE — this campaign is currently active.' : 'UNDER REVIEW — this campaign is not public yet.';
    const desc = d.description || 'No description provided.';
    const links = [link('Website', d.website), link('DEX / Trading', d.dex), link('X / Twitter', d.x), link('Community', d.community), link('Profile', d.profileLink), link('Download / Store', d.download), link('Social', d.social)].filter(Boolean).join('');
    root.innerHTML = `${data.logo_data ? `<img class="campaign-logo" src="${esc(data.logo_data)}" alt="${esc(data.brand)} logo">` : ''}
      <div class="campaign-code">${esc(data.campaign_code)} · ${esc(data.category)}${data.network ? ` · ${esc(data.network)}` : ''}</div>
      <h1 class="campaign-title">${esc(data.brand)}</h1>
      <div class="campaign-state ${statusClass}">${statusText}</div>
      <p class="campaign-desc">${esc(desc)}</p>
      ${d.ca ? `<div class="campaign-meta"><div class="meta-box"><span>CA / Contract Address</span><code>${esc(d.ca)}</code></div><div class="meta-box"><span>Network</span><strong>${esc(data.network || '—')}</strong></div></div>` : ''}
      ${links ? `<div class="campaign-links">${links}</div>` : ''}`;
  })();
})();
