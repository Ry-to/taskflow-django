// app.js — site interactivity: progress ring animation, confetti, AJAX toggle
(function () {
    "use strict";

    // Progress ring initializer
    function initProgressRing(root) {
        const circle = root.querySelector('.progress-ring__circle');
        const percentEl = root.querySelector('.percent');
        if (!circle || !percentEl) return;
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;
        const raw = (percentEl.textContent || '').trim();
        const p = Number(raw.replace(/[^0-9.-]+/g, '')) || 0;
        const percent = Math.max(0, Math.min(100, Math.round(p)));
        requestAnimationFrame(() => {
            const offset = circumference - (percent / 100) * circumference;
            circle.style.transition = 'stroke-dashoffset 900ms cubic-bezier(.2,.9,.2,1)';
            circle.style.strokeDashoffset = offset;
        });
        // if complete, trigger confetti
        if (percent === 100) {
            window.requestAnimationFrame(() => {
                fireConfetti(root);
            });
        }
    }

    // Simple confetti using small colored divs appended briefly
    function fireConfetti(root) {
        const container = document.createElement('div');
        container.className = 'confetti-container';
        container.style.position = 'absolute';
        container.style.left = '50%';
        container.style.top = '50%';
        container.style.transform = 'translate(-50%,-50%)';
        container.style.pointerEvents = 'none';
        root.appendChild(container);
        const colors = ['#ffd166', '#06b6d4', '#7c3aed', '#ff6b6b', '#34d399'];
        for (let i = 0; i < 40; i++) {
            const el = document.createElement('div');
            el.className = 'confetti';
            const size = Math.floor(Math.random() * 8) + 6;
            el.style.width = el.style.height = size + 'px';
            el.style.background = colors[Math.floor(Math.random() * colors.length)];
            el.style.position = 'absolute';
            el.style.left = (Math.random() * 140 - 20) + 'px';
            el.style.top = (Math.random() * 140 - 20) + 'px';
            el.style.opacity = '0.95';
            el.style.borderRadius = (Math.random() > 0.5 ? '2px' : '50%');
            el.style.transform = 'translateY(-10px) rotate(' + Math.floor(Math.random() * 360) + 'deg)';
            el.style.transition = `transform ${800 + Math.random() * 800}ms cubic-bezier(.2,.9,.2,1), opacity 1000ms ease`;
            container.appendChild(el);
            // animate
            setTimeout(() => {
                el.style.transform = 'translateY(' + (200 + Math.random() * 200) + 'px) rotate(' + Math.floor(Math.random() * 360) + 'deg)';
                el.style.opacity = '0';
            }, 20 + Math.random() * 200);
        }
        setTimeout(() => container.remove(), 1800);
    }

    // Bind toggle links to do AJAX POST and update UI without reload
    function bindToggleLinks() {
        document.querySelectorAll('a[href$="/toggle/"]').forEach(a => {
            a.addEventListener('click', function (e) {
                e.preventDefault();
                const url = a.href;
                fetch(url, { method: 'POST', headers: { 'X-CSRFToken': getCookie('csrftoken') } })
                    .then(r => {
                        if (r.redirected) window.location = r.url; // fallback
                        else return r.text();
                    })
                    .catch(() => {
                        // fallback: follow link
                        window.location = url;
                    });
            });
        });
    }

    // CSRF helper
    function getCookie(name) {
        const v = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
        return v ? v.pop() : '';
    }

    // Nice micro-interaction for buttons: press animation
    function enhanceButtons() {
        document.querySelectorAll('.btn').forEach(b => {
            b.addEventListener('mousedown', () => b.style.transform = 'translateY(2px) scale(.995)');
            b.addEventListener('mouseup', () => b.style.transform = 'translateY(0)');
            b.addEventListener('mouseleave', () => b.style.transform = 'translateY(0)');
        });
    }

    // Apply a subtle background animation to header for "画期的" feeling
    function animateHeader() {
        const header = document.querySelector('header');
        if (!header) return;
        header.style.transition = 'background-position 6s linear';
        header.style.backgroundImage = 'linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))';
        let pos = 0;
        setInterval(() => {
            pos = (pos + 20) % 360;
            header.style.backgroundPosition = pos + 'deg';
        }, 3000);
    }

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.today').forEach(initProgressRing);
        bindToggleLinks();
        enhanceButtons();
        animateHeader();
    });

})();
