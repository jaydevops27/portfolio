gsap.registerPlugin(ScrollTrigger);

// ─── CUSTOM CURSOR ─────────────────────────────────────────
const cursor = document.getElementById('cursor');

if (window.matchMedia('(pointer: fine)').matches && cursor) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top  = e.clientY + 'px';
    });

    const hoverEls = document.querySelectorAll(
        '.project-row, .btn-primary, .btn-ghost, .nav-cta, .pr-icon, .exp-row'
    );
    hoverEls.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('expanded'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('expanded'));
    });
}

// ─── NAVBAR SCROLL STATE ───────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ─── TERMINAL TYPEWRITER ───────────────────────────────────
(function initTerminal() {
    const body = document.getElementById('terminal-body');
    if (!body) return;

    // Each entry: { type: 'cmd'|'out'|'blank', text, outputClass }
    const sequence = [
        { type: 'cmd',  text: 'kubectl get pods --all-namespaces' },
        { type: 'out',  text: '✓  24/24 pods Running', cls: 't-success' },
        { type: 'out',  text: 'Uptime: 99.98%  |  EKS cluster healthy', cls: 't-muted' },
        { type: 'blank' },
        { type: 'cmd',  text: 'terraform apply -auto-approve' },
        { type: 'out',  text: '+ aws_vpc.main  + aws_eks_cluster.prod', cls: 't-info' },
        { type: 'out',  text: 'Apply complete! 12 added, 0 destroyed.', cls: 't-success' },
        { type: 'blank' },
        { type: 'cmd',  text: 'git push origin main' },
        { type: 'out',  text: '▶  GitLab CI/CD pipeline triggered', cls: 't-info' },
        { type: 'out',  text: '✓  300+ microservices — all checks passed', cls: 't-success' },
        { type: 'blank' },
        { type: 'cmd',  text: 'splunk search "error" index=prod' },
        { type: 'out',  text: '🤖 AI Triage: Root cause identified', cls: 't-success' },
        { type: 'out',  text: 'MTTR reduced · Auto-remediation applied', cls: 't-muted' },
    ];

    let lineIdx = 0;
    let charIdx = 0;
    let currentLineEl = null;
    let cmdSpan = null;

    function addLine(cls = '') {
        const div = document.createElement('div');
        div.className = 't-line' + (cls ? ' ' + cls : '');
        body.appendChild(div);
        return div;
    }

    function addCursor(parentEl) {
        const c = document.createElement('span');
        c.className = 't-cursor';
        c.id = 'tcursor';
        parentEl.appendChild(c);
        return c;
    }

    function removeCursor() {
        const c = document.getElementById('tcursor');
        if (c) c.remove();
    }

    function typeNextChar() {
        const entry = sequence[lineIdx];
        if (!entry) return; // all done

        if (entry.type === 'blank') {
            addLine();
            lineIdx++;
            charIdx = 0;
            setTimeout(typeNextChar, 120);
            return;
        }

        if (entry.type === 'out') {
            if (charIdx === 0) {
                removeCursor();
                currentLineEl = addLine();
                const span = document.createElement('span');
                span.className = entry.cls || '';
                currentLineEl.appendChild(span);
                cmdSpan = span;
            }
            if (charIdx < entry.text.length) {
                cmdSpan.textContent += entry.text[charIdx];
                charIdx++;
                setTimeout(typeNextChar, 18);
            } else {
                lineIdx++;
                charIdx = 0;
                setTimeout(typeNextChar, 200);
            }
            return;
        }

        // type: 'cmd'
        if (charIdx === 0) {
            removeCursor();
            currentLineEl = addLine();
            const prompt = document.createElement('span');
            prompt.className = 't-prompt';
            prompt.textContent = '$ ';
            currentLineEl.appendChild(prompt);
            cmdSpan = document.createElement('span');
            cmdSpan.className = 't-cmd';
            currentLineEl.appendChild(cmdSpan);
            addCursor(currentLineEl);
        }
        if (charIdx < entry.text.length) {
            cmdSpan.textContent += entry.text[charIdx];
            charIdx++;
            setTimeout(typeNextChar, 38);
        } else {
            removeCursor();
            lineIdx++;
            charIdx = 0;
            setTimeout(typeNextChar, 350);
        }
    }

    // Start after hero animation (2s delay)
    setTimeout(typeNextChar, 2200);
})();

// ─── GSAP HERO ENTRANCE ────────────────────────────────────
const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

heroTl
    .from('.navbar',             { y: -60, opacity: 0, duration: 0.9 })
    .from('.availability-badge', { y: 20,  opacity: 0, duration: 0.7 }, '-=0.4')
    .from('.title-line',         { y: 60,  opacity: 0, duration: 0.8, stagger: 0.1 }, '-=0.3')
    .from('.hero-sub-row',       { y: 30,  opacity: 0, duration: 0.8 }, '-=0.3')
    .from('.scroll-hint',        { opacity: 0, duration: 0.6 }, '-=0.2')
    .from('.hero-deco',          { x: 30, opacity: 0, duration: 1, ease: 'power2.out' }, '<0.2');

// ─── MARQUEE STRIPE ────────────────────────────────────────
gsap.from('.marquee-wrap', {
    scrollTrigger: { trigger: '.marquee-wrap', start: 'top 90%' },
    opacity: 0, y: 20, duration: 0.6, ease: 'power2.out'
});

// ─── EXPERIENCE SECTION ────────────────────────────────────
gsap.from('.experience-section .section-tag', {
    scrollTrigger: { trigger: '.experience-section', start: 'top 85%' },
    y: 20, opacity: 0, duration: 0.7, ease: 'power2.out'
});

gsap.from('.exp-row', {
    scrollTrigger: { trigger: '.exp-list', start: 'top 82%' },
    y: 40, opacity: 0, duration: 0.8, stagger: 0.18, ease: 'power3.out'
});

// ─── PROJECTS SECTION ──────────────────────────────────────
gsap.from('.projects-section .section-tag', {
    scrollTrigger: { trigger: '.projects-section', start: 'top 85%' },
    y: 20, opacity: 0, duration: 0.7, ease: 'power2.out'
});

gsap.from('.project-row', {
    scrollTrigger: { trigger: '.projects-list', start: 'top 82%' },
    y: 50, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out'
});

// ─── CTA BAND REVEAL (y only — no opacity to avoid invisible stuck) ──────
gsap.from('.cta-band', {
    scrollTrigger: { trigger: '.cta-band', start: 'top 85%' },
    y: 50, duration: 1, ease: 'power3.out'
});

// ─── PROJECT ROW — TITLE NUDGE ON HOVER ────────────────────
document.querySelectorAll('.project-row').forEach(row => {
    const title = row.querySelector('.pr-title');
    if (!title) return;
    row.addEventListener('mouseenter', () => gsap.to(title, { x: 8, duration: 0.3, ease: 'power2.out' }));
    row.addEventListener('mouseleave', () => gsap.to(title, { x: 0, duration: 0.3, ease: 'power2.out' }));
});
