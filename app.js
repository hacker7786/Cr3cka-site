/* ==========================================================================
   CR3CKA SECURITY — app.js
   Tools directory (search/filter/favorites/copy), GitHub tools grid,
   testimonials carousel, contact + newsletter form validation.
   ========================================================================== */

(function () {
  'use strict';

  /* ---------------------------------------------------------------------
     DATA — Quick-reference command tools
     --------------------------------------------------------------------- */
  const TOOLS = [
    { id: 't1', name: 'Nmap Service Scan', cat: 'Recon', desc: 'Identify open ports and running service versions on an authorized target.', cmd: 'nmap -sV -sC -p- target.io' },
    { id: 't2', name: 'Nmap Vuln Scripts', cat: 'Recon', desc: 'Run the NSE vulnerability script category against a host you are authorized to assess.', cmd: 'nmap --script vuln target.io' },
    { id: 't3', name: 'Subfinder Enum', cat: 'OSINT', desc: 'Passively enumerate subdomains for a domain you own or are authorized to test.', cmd: 'subfinder -d target.io -silent -o subs.txt' },
    { id: 't4', name: 'Httpx Probe', cat: 'Recon', desc: 'Probe a list of hosts for live HTTP(S) services and capture response metadata.', cmd: 'httpx -l subs.txt -sc -title -tech-detect' },
    { id: 't5', name: 'Naabu Port Scan', cat: 'Recon', desc: 'Fast SYN-based port discovery to feed into deeper service enumeration.', cmd: 'naabu -host target.io -top-ports 1000' },
    { id: 't6', name: 'Nuclei Templates', cat: 'Web', desc: 'Run community vulnerability templates against an in-scope target for defensive validation.', cmd: 'nuclei -u https://target.io -severity high,critical' },
    { id: 't7', name: 'Katana Crawl', cat: 'Web', desc: 'Crawl a web application to map its attack surface prior to authorized testing.', cmd: 'katana -u https://target.io -jc -d 3' },
    { id: 't8', name: 'ffuf Directory Fuzz', cat: 'Web', desc: 'Fuzz for hidden directories and files on a web app you have permission to test.', cmd: 'ffuf -u https://target.io/FUZZ -w wordlist.txt' },
    { id: 't9', name: 'Gobuster DNS', cat: 'Recon', desc: 'Brute-force subdomains via DNS resolution for authorized reconnaissance.', cmd: 'gobuster dns -d target.io -w subdomains.txt' },
    { id: 't10', name: 'theHarvester', cat: 'OSINT', desc: 'Gather emails, hosts and names from public sources for authorized OSINT engagements.', cmd: 'theHarvester -d target.io -b all' },
    { id: 't11', name: 'Amass Intel', cat: 'OSINT', desc: 'Perform in-depth attack-surface mapping using open-source intelligence.', cmd: 'amass enum -d target.io -active' },
    { id: 't12', name: 'YARA Scan', cat: 'Forensics', desc: 'Match files or memory against YARA rules to identify known malware signatures.', cmd: 'yara -r rules.yar /path/to/sample' },
    { id: 't13', name: 'Volatility Profile', cat: 'Forensics', desc: 'Identify the OS profile of a memory image before deeper forensic analysis.', cmd: 'vol3 -f memory.dmp windows.info' },
    { id: 't14', name: 'Wireshark Capture Filter', cat: 'Forensics', desc: 'Isolate suspicious traffic in a packet capture for incident-response review.', cmd: 'tshark -r capture.pcap -Y "http.request"' },
    { id: 't15', name: 'Trivy Image Scan', cat: 'Cloud', desc: 'Scan a container image for known CVEs before it ships to production.', cmd: 'trivy image myapp:latest' },
    { id: 't16', name: 'Semgrep SAST', cat: 'Web', desc: 'Run static analysis rules across a codebase to catch insecure patterns early.', cmd: 'semgrep --config=auto .' },
  ];

  const CATEGORIES = ['All', 'Recon', 'Web', 'OSINT', 'Forensics', 'Cloud'];
  let favorites = new Set();
  let activeCat = 'All';
  let searchTerm = '';
  let showFavoritesOnly = false;

  const toolsGrid = document.getElementById('tools-grid');
  const toolsEmpty = document.getElementById('tools-empty');
  const toolsSearchInput = document.getElementById('tools-search-input');
  const filterChips = document.getElementById('tools-filters');
  const favToggle = document.getElementById('fav-toggle');

  function buildFilterChips() {
    if (!filterChips) return;
    filterChips.innerHTML = CATEGORIES.map(
      (cat) => `<button class="filter-chip${cat === 'All' ? ' active' : ''}" data-cat="${cat}">${cat}</button>`
    ).join('');
    filterChips.querySelectorAll('.filter-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        filterChips.querySelectorAll('.filter-chip').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        activeCat = chip.dataset.cat;
        renderTools();
      });
    });
  }

  function renderTools() {
    if (!toolsGrid) return;
    const filtered = TOOLS.filter((t) => {
      const matchesCat = activeCat === 'All' || t.cat === activeCat;
      const matchesSearch =
        !searchTerm ||
        t.name.toLowerCase().includes(searchTerm) ||
        t.desc.toLowerCase().includes(searchTerm) ||
        t.cmd.toLowerCase().includes(searchTerm);
      const matchesFav = !showFavoritesOnly || favorites.has(t.id);
      return matchesCat && matchesSearch && matchesFav;
    });

    toolsGrid.innerHTML = filtered
      .map(
        (t) => `
      <article class="tool-card glass" data-reveal>
        <div class="tool-card-top">
          <div>
            <div class="tool-card-title">${escapeHtml(t.name)}</div>
            <div class="tool-cat">${t.cat}</div>
          </div>
          <button class="fav-btn${favorites.has(t.id) ? ' active' : ''}" data-fav="${t.id}" aria-label="Toggle favorite">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="${favorites.has(t.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M12 17.3l-6.16 3.6 1.64-6.99-5.48-4.62 7.19-.61L12 2l2.81 6.68 7.19.61-5.48 4.62 1.64 6.99z"/></svg>
          </button>
        </div>
        <p>${escapeHtml(t.desc)}</p>
        <div class="tool-code">
          <code>${escapeHtml(t.cmd)}</code>
          <button class="copy-btn" data-copy="${escapeHtml(t.cmd)}" aria-label="Copy command">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
          </button>
        </div>
      </article>`
      )
      .join('');

    toolsEmpty && toolsEmpty.classList.toggle('show', filtered.length === 0);
    attachToolCardEvents();
    if (window.__reobserveReveal) window.__reobserveReveal();
  }

  function attachToolCardEvents() {
    toolsGrid.querySelectorAll('[data-fav]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.fav;
        favorites.has(id) ? favorites.delete(id) : favorites.add(id);
        renderTools();
      });
    });
    toolsGrid.querySelectorAll('[data-copy]').forEach((btn) => {
      btn.addEventListener('click', () => copyToClipboard(btn.dataset.copy, btn));
    });
  }

  async function copyToClipboard(text, btn) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    btn.classList.add('copied');
    const original = btn.innerHTML;
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = original;
    }, 1500);
  }

  if (toolsSearchInput) {
    toolsSearchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim().toLowerCase();
      renderTools();
    });
  }
  if (favToggle) {
    favToggle.addEventListener('click', () => {
      showFavoritesOnly = !showFavoritesOnly;
      favToggle.classList.toggle('active', showFavoritesOnly);
      renderTools();
    });
  }

  if (toolsGrid) {
    buildFilterChips();
    renderTools();
  }

  /* ---------------------------------------------------------------------
     DATA — GitHub security repositories
     --------------------------------------------------------------------- */
  const GH_TOOLS = [
    { name: 'nmap', lang: 'C++', desc: 'The industry-standard network scanner for host discovery and service/version detection.', stars: '9.8k', url: 'https://github.com/nmap/nmap' },
    { name: 'nuclei', lang: 'Go', desc: 'Fast, template-driven vulnerability scanner built by ProjectDiscovery for defensive validation.', stars: '21k', url: 'https://github.com/projectdiscovery/nuclei' },
    { name: 'httpx', lang: 'Go', desc: 'Multi-purpose HTTP toolkit for probing and fingerprinting live web services.', stars: '3.9k', url: 'https://github.com/projectdiscovery/httpx' },
    { name: 'subfinder', lang: 'Go', desc: 'Passive subdomain discovery tool for authorized attack-surface mapping.', stars: '11k', url: 'https://github.com/projectdiscovery/subfinder' },
    { name: 'naabu', lang: 'Go', desc: 'A fast port scanner designed to chain cleanly into recon pipelines.', stars: '3.4k', url: 'https://github.com/projectdiscovery/naabu' },
    { name: 'katana', lang: 'Go', desc: 'A next-generation crawling and spidering framework for mapping web apps.', stars: '13k', url: 'https://github.com/projectdiscovery/katana' },
    { name: 'amass', lang: 'Go', desc: 'In-depth attack-surface mapping and asset discovery using OSINT techniques.', stars: '11k', url: 'https://github.com/owasp-amass/amass' },
    { name: 'gobuster', lang: 'Go', desc: 'Directory, DNS and vhost brute-forcer used in authorized enumeration.', stars: '9.1k', url: 'https://github.com/OJ/gobuster' },
    { name: 'ffuf', lang: 'Go', desc: 'A fast web fuzzer for discovering hidden content on in-scope applications.', stars: '13k', url: 'https://github.com/ffuf/ffuf' },
    { name: 'theHarvester', lang: 'Python', desc: 'OSINT reconnaissance tool for gathering emails, subdomains and names.', stars: '11k', url: 'https://github.com/laramies/theHarvester' },
    { name: 'OSINT Framework', lang: 'HTML', desc: 'A curated directory of open-source intelligence tools organized by category.', stars: '5.2k', url: 'https://github.com/lockfale/OSINT-Framework' },
    { name: 'SpiderFoot', lang: 'Python', desc: 'Automated OSINT reconnaissance across hundreds of public data sources.', stars: '13k', url: 'https://github.com/smicallef/spiderfoot' },
    { name: 'recon-ng', lang: 'Python', desc: 'A modular reconnaissance framework with a workflow similar to Metasploit.', stars: '4.6k', url: 'https://github.com/lanmaster53/recon-ng' },
    { name: 'Ghidra', lang: 'Java', desc: 'NSA-developed reverse-engineering suite for software analysis and research.', stars: '52k', url: 'https://github.com/NationalSecurityAgency/ghidra' },
    { name: 'YARA', lang: 'C', desc: 'Pattern-matching engine used to identify and classify malware samples.', stars: '7.6k', url: 'https://github.com/VirusTotal/yara' },
    { name: 'Volatility 3', lang: 'Python', desc: 'Advanced memory forensics framework for incident response and DFIR.', stars: '2.7k', url: 'https://github.com/volatilityfoundation/volatility3' },
    { name: 'Wireshark', lang: 'C', desc: 'The world-standard network protocol analyzer for traffic inspection.', stars: '8.4k', url: 'https://gitlab.com/wireshark/wireshark' },
    { name: 'Zeek', lang: 'C++', desc: 'A network security monitor that turns traffic into rich analysis logs.', stars: '6.3k', url: 'https://github.com/zeek/zeek' },
    { name: 'Suricata', lang: 'C', desc: 'A high-performance IDS/IPS and network security monitoring engine.', stars: '4.5k', url: 'https://github.com/OISF/suricata' },
    { name: 'Semgrep', lang: 'OCaml', desc: 'Lightweight static analysis to find bugs and enforce secure code patterns.', stars: '10.5k', url: 'https://github.com/semgrep/semgrep' },
    { name: 'Trivy', lang: 'Go', desc: 'A comprehensive scanner for vulnerabilities in containers and IaC.', stars: '23k', url: 'https://github.com/aquasecurity/trivy' },
    { name: 'OpenVAS', lang: 'C', desc: 'A full-featured open-source vulnerability scanning and management suite.', stars: '2.9k', url: 'https://github.com/greenbone/openvas-scanner' },
  ];

  const ghGrid = document.getElementById('gh-grid');
  if (ghGrid) {
    ghGrid.innerHTML = GH_TOOLS.map(
      (r) => `
      <article class="gh-card glass" data-reveal>
        <div class="gh-card-top">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.7.1-.7 1.2.1 1.9 1.2 1.9 1.2 1.1 1.9 2.9 1.3 3.6 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.3 11.3 0 016 0C17 4.7 18 5 18 5c.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.7 5.6-5.4 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0012 .3z"/></svg>
          <h3>${r.name}</h3>
          <span class="gh-lang">${r.lang}</span>
        </div>
        <p>${escapeHtml(r.desc)}</p>
        <div class="gh-meta">
          <span><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.3l-6.16 3.6 1.64-6.99-5.48-4.62 7.19-.61L12 2l2.81 6.68 7.19.61-5.48 4.62 1.64 6.99z"/></svg>${r.stars}</span>
          <span>Defensive / research use</span>
        </div>
        <a class="gh-card-link" href="${r.url}" target="_blank" rel="noopener">View repository →</a>
      </article>`
    ).join('');
  }

  /* ---------------------------------------------------------------------
     Testimonials carousel
     --------------------------------------------------------------------- */
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsWrap = document.getElementById('testimonial-dots');
  let slideIndex = 0, slideTimer;

  function showSlide(i) {
    slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
    if (dotsWrap) {
      dotsWrap.querySelectorAll('button').forEach((d, idx) => d.classList.toggle('active', idx === i));
    }
    slideIndex = i;
  }

  if (slides.length && dotsWrap) {
    dotsWrap.innerHTML = Array.from(slides).map((_, i) => `<button aria-label="Show testimonial ${i + 1}"></button>`).join('');
    dotsWrap.querySelectorAll('button').forEach((d, i) =>
      d.addEventListener('click', () => { showSlide(i); resetTimer(); })
    );
    showSlide(0);
    function resetTimer() {
      clearInterval(slideTimer);
      slideTimer = setInterval(() => showSlide((slideIndex + 1) % slides.length), 5500);
    }
    resetTimer();
  }

  /* ---------------------------------------------------------------------
     Contact form validation
     --------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const status = document.getElementById('contact-status');
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('#c-name');
      const email = contactForm.querySelector('#c-email');
      const message = contactForm.querySelector('#c-message');
      let valid = true;

      valid = validateField(name, name.value.trim().length >= 2, 'Enter your full name') && valid;
      valid = validateField(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()), 'Enter a valid email address') && valid;
      valid = validateField(message, message.value.trim().length >= 10, 'Message must be at least 10 characters') && valid;

      if (!valid) {
        status.textContent = 'Please fix the highlighted fields.';
        status.className = 'form-status error';
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        status.textContent = 'Message sent — I will get back to you within 48 hours.';
        status.className = 'form-status success';
        contactForm.reset();
      }, 1100);
    });
  }

  function validateField(input, condition, message) {
    const errEl = document.getElementById(input.id + '-error');
    if (!condition) {
      input.classList.add('invalid');
      if (errEl) errEl.textContent = message;
      return false;
    }
    input.classList.remove('invalid');
    if (errEl) errEl.textContent = '';
    return true;
  }

  /* ---------------------------------------------------------------------
     Newsletter form (footer)
     --------------------------------------------------------------------- */
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      const msg = document.getElementById('newsletter-msg');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
        if (msg) { msg.textContent = 'Enter a valid email.'; msg.style.color = 'var(--c-danger)'; }
        return;
      }
      if (msg) { msg.textContent = 'Subscribed — welcome aboard.'; msg.style.color = 'var(--c-primary)'; }
      newsletterForm.reset();
    });
  }

  /* ---------------------------------------------------------------------
     Utility
     --------------------------------------------------------------------- */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
})();
