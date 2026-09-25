/**
 * ============================================================
 *  Zunair Khawaja — Premium Portfolio Interactions
 *  Vanilla ES6+ · Showcase Quality
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // Utilities
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.innerWidth > 1024;
    
    const rafThrottle = (callback) => {
        let ticking = false;
        return (...args) => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                callback(...args);
                ticking = false;
            });
        };
    };

    // 1. Page Loader with Resilience Watchdog
    const loader = document.getElementById('loader');
    let loaderDismissed = false;
    const dismissLoader = () => {
        if (loaderDismissed) return;
        loaderDismissed = true;
        document.body.classList.add('loaded');
        setTimeout(() => {
            if (loader) loader.style.display = 'none';
        }, 800);
    };

    if (document.readyState === 'complete') {
        dismissLoader();
    } else {
        window.addEventListener('load', dismissLoader);
    }
    // Hard watchdog timer (2.5s fallback)
    setTimeout(dismissLoader, 2500);

    // 2. Custom Cursor (Desktop Only)
    if (isDesktop && !prefersReducedMotion) {
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorRing = document.querySelector('.cursor-ring');
        
        if (cursorDot && cursorRing) {
            let mouseX = window.innerWidth / 2;
            let mouseY = window.innerHeight / 2;
            let ringX = mouseX;
            let ringY = mouseY;
            
            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                cursorDot.style.left = `${mouseX}px`;
                cursorDot.style.top = `${mouseY}px`;
            });
            
            const renderRing = () => {
                ringX += (mouseX - ringX) * 0.15; // lerp
                ringY += (mouseY - ringY) * 0.15;
                cursorRing.style.left = `${ringX}px`;
                cursorRing.style.top = `${ringY}px`;
                requestAnimationFrame(renderRing);
            };
            requestAnimationFrame(renderRing);
            
            // Hover states
            const addHoverLink = () => document.body.classList.add('cursor-hover-link');
            const addHoverText = () => document.body.classList.add('cursor-hover-text');
            const removeHover = () => {
                document.body.classList.remove('cursor-hover-link');
                document.body.classList.remove('cursor-hover-text');
            };
            
            document.querySelectorAll('a, button, [data-tilt], .btn-magnetic').forEach(el => {
                el.addEventListener('mouseenter', addHoverLink);
                el.addEventListener('mouseleave', removeHover);
            });
            
            document.querySelectorAll('h1, h2, h3, p').forEach(el => {
                el.addEventListener('mouseenter', addHoverText);
                el.addEventListener('mouseleave', removeHover);
            });
            
            // Hide cursor when leaving window
            document.addEventListener('mouseleave', () => {
                cursorDot.style.opacity = '0';
                cursorRing.style.opacity = '0';
            });
            document.addEventListener('mouseenter', () => {
                cursorDot.style.opacity = '1';
                cursorRing.style.opacity = '1';
            });
        }
    }

    // 3. Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal-up');
    if (prefersReducedMotion) {
        revealElements.forEach(el => el.classList.add('active'));
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        revealElements.forEach(el => revealObserver.observe(el));
    }

    // 4. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    const handleNavScroll = () => {
        if (!navbar) return;
        window.scrollY > 80 ? navbar.classList.add('scrolled') : navbar.classList.remove('scrolled');
    };
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    // 5. Active Nav Link Highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const handleActiveNav = () => {
        const scrollPos = window.scrollY + (window.innerHeight * 0.4);
        sections.forEach(section => {
            if (scrollPos >= section.offsetTop && scrollPos < (section.offsetTop + section.offsetHeight)) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${section.id}`);
                });
            }
        });
    };
    window.addEventListener('scroll', rafThrottle(handleActiveNav), { passive: true });
    handleActiveNav();

    // 6. Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            // Auto-activate corresponding Financial Lab module if targeted
            if (targetId === '#module-audit') {
                const auditBtn = document.getElementById('tab-btn-audit');
                if (auditBtn) auditBtn.click();
            } else if (targetId === '#module-dcf') {
                const dcfBtn = document.getElementById('tab-btn-dcf');
                if (dcfBtn) dcfBtn.click();
            }

            const scrollTarget = (targetId === '#module-audit' || targetId === '#module-dcf')
                ? document.getElementById('financial-lab')
                : document.querySelector(targetId);

            if (scrollTarget) {
                e.preventDefault();
                const targetPos = scrollTarget.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
                closeMobileMenu();
            }
        });
    });

    // 7. Mobile Menu
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    const toggleMobileMenu = () => {
        const isOpen = document.body.classList.contains('nav-open');
        document.body.classList.toggle('nav-open');
        document.body.style.overflow = isOpen ? '' : 'hidden';
        if(hamburger) hamburger.setAttribute('aria-expanded', !isOpen);
    };
    
    const closeMobileMenu = () => {
        document.body.classList.remove('nav-open');
        document.body.style.overflow = '';
        if(hamburger) hamburger.setAttribute('aria-expanded', 'false');
    };
    
    if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);
    
    document.addEventListener('click', (e) => {
        if (document.body.classList.contains('nav-open') && 
            navMenu && !navMenu.contains(e.target) && 
            hamburger && !hamburger.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileMenu();
    });

    // 8. Magnetic Buttons (Desktop)
    if (isDesktop && !prefersReducedMotion) {
        document.querySelectorAll('.btn-magnetic').forEach(btn => {
            const inner = btn.querySelector('.btn-inner');
            if (!inner) return;
            
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                inner.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                inner.style.transform = `translate(0px, 0px)`;
            });
        });
    }

    // 9. Card Tilt Effect (Desktop)
    if (isDesktop && !prefersReducedMotion) {
        document.querySelectorAll('[data-tilt]').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -5; // max 5deg
                const rotateY = ((x - centerX) / centerX) * 5;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`;
                // Smooth reset handled by CSS transition
            });
        });
    }

    // 10. Hero Parallax
    const heroBg = document.querySelector('.hero-bg');
    const heroContent = document.querySelector('.hero-content');
    if (heroBg && heroContent && !prefersReducedMotion) {
        const handleParallax = () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroBg.style.transform = `translateY(${scrolled * 0.4}px)`;
                const opacity = Math.max(0, 1 - (scrolled / 500));
                heroContent.style.opacity = opacity;
            }
        };
        window.addEventListener('scroll', rafThrottle(handleParallax), { passive: true });
    }

    // 11. Hero Particles
    const particlesContainer = document.getElementById('hero-particles');
    if (particlesContainer && !prefersReducedMotion) {
        // Inject keyframes
        const style = document.createElement('style');
        style.innerHTML = `@keyframes floatParticle { 0%,100%{transform:translate(0,0)} 25%{transform:translate(30px,-30px)} 50%{transform:translate(-20px,20px)} 75%{transform:translate(25px,15px)} }`;
        document.head.appendChild(style);

        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 2 + 2; // 2-4px
            const posX = Math.random() * 100; // %
            const posY = Math.random() * 100; // %
            const duration = Math.random() * 25 + 15; // 15-40s
            const delay = Math.random() * 5;
            const opacity = Math.random() * 0.4 + 0.1; // 0.1 - 0.5

            particle.style.position = 'absolute';
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.background = `rgba(200, 162, 67, ${opacity})`;
            particle.style.borderRadius = '50%';
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.animation = `floatParticle ${duration}s infinite ease-in-out ${delay}s`;

            particlesContainer.appendChild(particle);
        }
    }

    // 12. Count-Up Animation
    const countElements = document.querySelectorAll('.count-up');
    if (countElements.length) {
        const animateCount = (el) => {
            const target = parseInt(el.getAttribute('data-target'), 10);
            if (isNaN(target)) return;
            const duration = 2000;
            const start = performance.now();
            
            const step = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
                el.textContent = Math.round(eased * target);
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.textContent = target;
                }
            };
            requestAnimationFrame(step);
        };

        if (prefersReducedMotion) {
            countElements.forEach(el => el.textContent = el.getAttribute('data-target'));
        } else {
            const countObserver = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCount(entry.target);
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });
            countElements.forEach(el => countObserver.observe(el));
        }
    }

    // 13. Theme Switcher (Dual Executive System)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');

    const applyTheme = (theme) => {
        if (theme === 'light') {
            document.body.classList.add('theme-light');
            localStorage.setItem('zk_theme', 'light');
        } else {
            document.body.classList.remove('theme-light');
            localStorage.setItem('zk_theme', 'dark');
        }
    };

    // Load saved theme
    const savedTheme = localStorage.getItem('zk_theme') || 'dark';
    if (savedTheme === 'light') {
        applyTheme('light');
    }

    const toggleTheme = () => {
        const isLight = document.body.classList.contains('theme-light');
        applyTheme(isLight ? 'dark' : 'light');
        playAudioFeedback(600, 0.05);
    };

    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
    if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);

    // 14. Web Audio API Acoustic Sound Effects
    let audioCtx = null;
    let audioEnabled = localStorage.getItem('zk_sound') === 'enabled';
    if (audioEnabled) {
        document.body.classList.add('audio-enabled');
    }

    const soundToggleBtn = document.getElementById('sound-toggle');

    const playAudioFeedback = (freq = 520, duration = 0.04) => {
        if (!audioEnabled) return;
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            // AudioContext not permitted or supported
        }
    };

    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', () => {
            audioEnabled = !audioEnabled;
            if (audioEnabled) {
                document.body.classList.add('audio-enabled');
                localStorage.setItem('zk_sound', 'enabled');
                playAudioFeedback(880, 0.06);
                showToast('Audio feedback enabled');
            } else {
                document.body.classList.remove('audio-enabled');
                localStorage.setItem('zk_sound', 'disabled');
                showToast('Audio feedback muted');
            }
        });
    }

    // 15. Toast Notification Utility (Race-Condition Free)
    let toastTimeout = null;
    const showToast = (message) => {
        let toast = document.getElementById('toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.className = 'toast';
            toast.setAttribute('role', 'status');
            toast.setAttribute('aria-live', 'polite');
            toast.innerHTML = `<span class="toast-icon">✓</span><span class="toast-message">${message}</span>`;
            document.body.appendChild(toast);
        } else {
            const msgEl = toast.querySelector('.toast-message');
            if (msgEl) msgEl.textContent = message;
        }
        toast.classList.add('visible');
        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('visible');
        }, 3000);
    };

    // 16. Clipboard Email Copying
    const copyEmailToClipboard = () => {
        const email = 'zunairnadeem82@gmail.com';
        navigator.clipboard.writeText(email).then(() => {
            playAudioFeedback(780, 0.05);
            showToast('Email copied to clipboard (zunairnadeem82@gmail.com)');
        }).catch(() => {
            window.location.href = `mailto:${email}`;
        });
    };

    const copyEmailItem = document.getElementById('contact-email-copy');
    const btnCopyEmailBottom = document.getElementById('btn-copy-email-bottom');
    const modalCopyEmail = document.getElementById('modal-copy-email');

    if (copyEmailItem) copyEmailItem.addEventListener('click', copyEmailToClipboard);
    if (btnCopyEmailBottom) btnCopyEmailBottom.addEventListener('click', copyEmailToClipboard);
    if (modalCopyEmail) modalCopyEmail.addEventListener('click', copyEmailToClipboard);

    // 17. Scheme / Service Line Matcher Logic
    const schemeData = {
        all: {
            tag: "All Graduate Programmes · Practice & Industry",
            title: "Practical Accounting Foundation & AI Tool-Building",
            narrative: "Combining 18 months of hands-on UK practice experience (Xero, bank recs, MTD VAT) with genuine process innovation using Claude Code agentic AI workflows. Actively self-studying towards the ACA.",
            score: "98",
            highlights: [
                "Targeting September 2027 Graduate Intake (Open to Practice, Mid-Tier & Industry)",
                "18 Months Junior Accountant practice experience + 30+ client VAT returns automated",
                "Committed to ACA (ICAEW) qualification · Active self-study track"
            ],
            primaryAction: "Explore Financial Lab",
            primaryTarget: "#financial-lab",
            secondaryAction: "30s Recruiter Dossier"
        },
        audit: {
            tag: "Graduate Programme · Audit & Assurance (ACA Track)",
            title: "High Ledger Precision, Bank Recs & Analytical Review",
            narrative: "Experienced in day-to-day balance sheet reconciliations, VAT audit trail verification, and identifying ledger anomalies across live client files. Bringing a disciplined, detail-oriented approach to assurance testing.",
            score: "96",
            highlights: [
                "Direct Xero practice reconciliations, transaction matching & journal auditing",
                "Committed to ACA (ICAEW) qualification; disciplined self-study habits",
                "Proven tolerance for high-volume, meticulous financial reconciliation work"
            ],
            primaryAction: "Inspect Live Audit Lab",
            primaryTarget: "#module-audit",
            secondaryAction: "30s Recruiter Dossier"
        },
        deals: {
            tag: "Corporate Finance & Quantitative Analysis",
            title: "Valuation Modelling Mechanics & Financial Logic",
            narrative: "Quantitative finance background self-building interactive DCF sensitivity models, exploring WACC discount mechanics, and founding the St Mary's Student Investment Society.",
            score: "94",
            highlights: [
                "Engineered interactive 5-year DCF sensitivity model (featured in live Financial Lab)",
                "Founder & President of St Mary's Student Investment Society (Gamma deck & pitches)",
                "Solid grasp of corporate finance principles, capital structures, and cash cycles"
            ],
            primaryAction: "Run Live DCF Model",
            primaryTarget: "#module-dcf",
            secondaryAction: "30s Recruiter Dossier"
        },
        tax: {
            tag: "Tax Compliance & Advisory (VAT / MTD / HMRC)",
            title: "Hands-On VAT Filings & Production AI Automation",
            narrative: "Deep practical experience managing Making Tax Digital (MTD) VAT returns on Xero. Built an agentic AI workflow with Claude Code to automate client VAT categorisation across 30+ returns.",
            score: "95",
            highlights: [
                "Built production Claude Code AI workflow saving ~1 day of manual work per week",
                "Handled 30+ MTD-compliant client VAT filings and HMRC correspondence",
                "Thorough grasp of VAT rates, reverse charge, exempt supplies, and ledger tagging"
            ],
            primaryAction: "View VAT Case Study",
            primaryTarget: "#project-1",
            secondaryAction: "30s Recruiter Dossier"
        },
        consulting: {
            tag: "Digital Finance, Automation & Advisory",
            title: "Process Improvement & AI Workflow Transformation",
            narrative: "Identified a critical operational bottleneck in practice accounting and solved it by building an agentic AI categorisation pipeline. Proven ability to take initiative and eliminate manual work.",
            score: "96",
            highlights: [
                "Automated repetitive accounting tasks using Claude Code in a live practice setting",
                "Founded 2 university student societies from scratch (governance, decks, promo)",
                "Fluent in 4 languages with strong ability to communicate with non-financial stakeholders"
            ],
            primaryAction: "View Automation Case Study",
            primaryTarget: "#project-1",
            secondaryAction: "30s Recruiter Dossier"
        }
    };

    const schemeTabs = document.querySelectorAll('.scheme-tab');
    const matchTag = document.getElementById('match-tag');
    const matchTitle = document.getElementById('match-title');
    const matchNarrative = document.getElementById('match-narrative');
    const matchHighlights = document.getElementById('match-highlights');
    const matchScore = document.getElementById('match-score');
    const btnMatchAction = document.getElementById('btn-match-action');
    const btnMatchDossier = document.getElementById('btn-match-dossier');

    if (schemeTabs.length && matchTitle) {
        schemeTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                schemeTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const schemeKey = tab.getAttribute('data-scheme');
                const data = schemeData[schemeKey] || schemeData.all;

                playAudioFeedback(540, 0.04);

                // Update text with quick fade
                matchTag.textContent = data.tag;
                matchTitle.textContent = data.title;
                matchNarrative.textContent = data.narrative;
                matchScore.textContent = data.score;

                // Update highlights
                matchHighlights.innerHTML = data.highlights.map(h => `
                    <div class="highlight-item">
                        <span class="highlight-check">✓</span>
                        <span>${h}</span>
                    </div>
                `).join('');

                // Update button text and link
                if (btnMatchAction) {
                    const spanA = btnMatchAction.querySelector('span');
                    if (spanA) spanA.textContent = data.primaryAction;
                    btnMatchAction.setAttribute('href', data.primaryTarget);
                }
                if (btnMatchDossier) {
                    const spanD = btnMatchDossier.querySelector('span');
                    if (spanD && data.secondaryAction) spanD.textContent = data.secondaryAction;
                }

                // Spotlight matching services & projects
                highlightServiceCards(schemeKey);
            });
        });
    }

    const highlightServiceCards = (schemeKey) => {
        document.querySelectorAll('.service-card').forEach(card => {
            card.classList.remove('service-highlight');
            const svc = card.getAttribute('data-service') || '';
            if (schemeKey !== 'all' && svc.includes(schemeKey)) {
                card.classList.add('service-highlight');
            }
        });
    };

    // 18. Financial Lab Engine (Module A: DCF Valuation & Sensitivity)
    const labSwitchBtns = document.querySelectorAll('.lab-switch-btn');
    const labDCF = document.getElementById('module-dcf');
    const labAudit = document.getElementById('module-audit');

    if (labSwitchBtns.length) {
        labSwitchBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                labSwitchBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                playAudioFeedback(600, 0.04);

                const tab = btn.getAttribute('data-tab');
                if (tab === 'dcf') {
                    if (labDCF) labDCF.classList.add('active');
                    if (labAudit) labAudit.classList.remove('active');
                } else {
                    if (labDCF) labDCF.classList.remove('active');
                    if (labAudit) {
                        labAudit.classList.add('active');
                        calculateAuditMateriality();
                    }
                }
            });
        });
    }

    // DCF Sliders and Math (Module A)
    const sRev = document.getElementById('input-revenue');
    const sGrowth = document.getElementById('input-growth');
    const sMargin = document.getElementById('input-margin');
    const sWacc = document.getElementById('input-wacc');
    const sExit = document.getElementById('input-multiple');

    const vRev = document.getElementById('readout-revenue');
    const vGrowth = document.getElementById('readout-growth');
    const vMargin = document.getElementById('readout-margin');
    const vWacc = document.getElementById('readout-wacc');
    const vExit = document.getElementById('readout-multiple');

    const outEV = document.getElementById('out-ev');
    const outFCF = document.getElementById('out-fcf');
    const outEbitda = document.getElementById('out-ebitda');
    const outY5Rev = document.getElementById('out-y5-rev');
    const outRevMult = document.getElementById('out-rev-mult');
    const dcfChartSvg = document.getElementById('dcf-chart-svg');

    const calculateDCF = () => {
        if (!sRev || !sGrowth || !sMargin || !sWacc || !sExit) return;

        const rev0 = parseFloat(sRev.value); // In £
        const g = parseFloat(sGrowth.value) / 100; // Annual growth rate
        const m = parseFloat(sMargin.value) / 100; // EBITDA margin
        const wacc = parseFloat(sWacc.value) / 100; // Discount rate
        const multiple = parseFloat(sExit.value); // Exit multiple

        // Update readouts
        if (vRev) vRev.textContent = `£${rev0.toLocaleString()}`;
        if (vGrowth) vGrowth.textContent = `${(g * 100).toFixed(0)}%`;
        if (vMargin) vMargin.textContent = `${(m * 100).toFixed(0)}%`;
        if (vWacc) vWacc.textContent = `${(wacc * 100).toFixed(1)}%`;
        if (vExit) vExit.textContent = `${multiple.toFixed(1)}x`;

        // 5-Year Forecast Arrays
        const revYears = [];
        const ebitdaYears = [];
        const fcfYears = [];
        const pvFcfYears = [];

        let curRev = rev0;
        let sumPvFcf = 0;
        let totalFcf = 0;

        for (let t = 1; t <= 5; t++) {
            curRev = curRev * (1 + g);
            const ebitda = curRev * m;
            // Unlevered FCF approximation: EBITDA * (1 - 25% Tax) - Capex/WC drag (~68% conversion)
            const fcf = ebitda * 0.68;
            const pvFcf = fcf / Math.pow(1 + wacc, t - 0.5); // Mid-year discounting convention

            revYears.push(curRev);
            ebitdaYears.push(ebitda);
            fcfYears.push(fcf);
            pvFcfYears.push(pvFcf);

            sumPvFcf += pvFcf;
            totalFcf += fcf;
        }

        // Terminal Value (Exit Multiple Method)
        const terminalValue = ebitdaYears[4] * multiple;
        const pvTerminalValue = terminalValue / Math.pow(1 + wacc, 5);

        // Enterprise Value & Implied Revenue Multiple
        const enterpriseValue = sumPvFcf + pvTerminalValue;
        const impliedRevMult = enterpriseValue / rev0;

        // Update KPI Cards
        if (outEV) outEV.textContent = `£${(enterpriseValue / 1e6).toFixed(2)}M`;
        if (outFCF) outFCF.textContent = `£${(totalFcf / 1e6).toFixed(2)}M`;
        if (outEbitda) outEbitda.textContent = `£${(ebitdaYears[4] / 1e6).toFixed(2)}M`;
        if (outY5Rev) outY5Rev.textContent = `£${(revYears[4] / 1e6).toFixed(1)}M`;
        if (outRevMult) outRevMult.textContent = `${impliedRevMult.toFixed(2)}x`;

        // Render Dynamic SVG Chart
        renderDCFChart(ebitdaYears, fcfYears);
    };

    const renderDCFChart = (ebitda, fcf) => {
        if (!dcfChartSvg) return;

        const width = 540;
        const height = 220;
        const padding = { top: 25, right: 25, bottom: 35, left: 55 };
        const chartW = width - padding.left - padding.right;
        const chartH = height - padding.top - padding.bottom;

        const maxVal = Math.max(...ebitda, ...fcf) * 1.25 || 1000000;
        const barWidth = 28;
        const groupSpacing = chartW / 5;

        let svgHtml = '';

        // Grid lines & Axis labels
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (chartH / 4) * i;
            const val = maxVal * (1 - i / 4);
            const valLabel = val >= 1e6 ? `£${(val / 1e6).toFixed(1)}M` : `£${(val / 1e3).toFixed(0)}k`;
            svgHtml += `
                <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="var(--border-card-dark)" stroke-dasharray="3,3"/>
                <text x="${padding.left - 8}" y="${y + 4}" font-size="10" fill="var(--text-muted)" text-anchor="end">${valLabel}</text>
            `;
        }

        // Year Bars and Tooltip Points
        for (let i = 0; i < 5; i++) {
            const groupX = padding.left + groupSpacing * i + groupSpacing / 2;

            // EBITDA Bar
            const ebitdaH = Math.max(4, (ebitda[i] / maxVal) * chartH);
            const ebitdaY = padding.top + chartH - ebitdaH;
            const ebitdaX = groupX - barWidth - 2;
            const ebitdaLbl = ebitda[i] >= 1e6 ? `£${(ebitda[i] / 1e6).toFixed(1)}M` : `£${(ebitda[i] / 1e3).toFixed(0)}k`;

            svgHtml += `
                <rect x="${ebitdaX}" y="${ebitdaY}" width="${barWidth}" height="${ebitdaH}" rx="4" fill="var(--accent-gold)" opacity="0.9">
                    <title>Year ${i + 1} EBITDA: £${(ebitda[i] / 1e6).toFixed(2)}M</title>
                </rect>
                <text x="${ebitdaX + barWidth / 2}" y="${ebitdaY - 6}" font-size="9" fill="var(--accent-gold)" font-weight="600" text-anchor="middle">${ebitdaLbl}</text>
            `;

            // FCF Bar
            const fcfH = Math.max(4, (fcf[i] / maxVal) * chartH);
            const fcfY = padding.top + chartH - fcfH;
            const fcfX = groupX + 2;
            const fcfLbl = fcf[i] >= 1e6 ? `£${(fcf[i] / 1e6).toFixed(1)}M` : `£${(fcf[i] / 1e3).toFixed(0)}k`;

            svgHtml += `
                <rect x="${fcfX}" y="${fcfY}" width="${barWidth}" height="${fcfH}" rx="4" fill="#3498DB" opacity="0.9">
                    <title>Year ${i + 1} FCF: £${(fcf[i] / 1e6).toFixed(2)}M</title>
                </rect>
                <text x="${fcfX + barWidth / 2}" y="${fcfY - 6}" font-size="9" fill="#3498DB" font-weight="600" text-anchor="middle">${fcfLbl}</text>
            `;

            // Year Label
            svgHtml += `
                <text x="${groupX}" y="${height - 10}" font-size="11" fill="var(--text-muted)" text-anchor="middle">Year ${i + 1}</text>
            `;
        }

        dcfChartSvg.innerHTML = svgHtml;
    };

    // Scenario Presets
    const presetBtns = document.querySelectorAll('.preset-btn');
    const presets = {
        bear: { rev: 8000000, growth: 5, margin: 15, wacc: 12.0, exit: 7.0 },
        base: { rev: 10000000, growth: 12, margin: 22, wacc: 9.5, exit: 10.0 },
        bull: { rev: 14000000, growth: 22, margin: 28, wacc: 8.0, exit: 14.0 }
    };

    if (presetBtns.length) {
        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                presetBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const presetKey = btn.getAttribute('data-preset');
                const p = presets[presetKey];
                if (p && sRev) {
                    sRev.value = p.rev;
                    sGrowth.value = p.growth;
                    sMargin.value = p.margin;
                    sWacc.value = p.wacc;
                    sExit.value = p.exit;
                    calculateDCF();
                    playAudioFeedback(650, 0.04);
                }
            });
        });
    }

    // Attach DCF slider listeners
    [sRev, sGrowth, sMargin, sWacc, sExit].forEach(slider => {
        if (slider) {
            slider.addEventListener('input', () => {
                calculateDCF();
                playAudioFeedback(400 + parseFloat(slider.value) * 0.0001, 0.015);
            });
        }
    });

    // Run initial DCF
    calculateDCF();

    // 19. Financial Lab Engine (Module B: Audit Materiality & ISA 320 Engine)
    const sPm = document.getElementById('audit-materiality');
    const sPerf = document.getElementById('audit-perf-pct');
    const sTrivial = document.getElementById('audit-trivial');

    const vPm = document.getElementById('readout-pm');
    const vPerf = document.getElementById('readout-perf');
    const vCtt = document.getElementById('readout-ctt');

    const asRiskStatus = document.getElementById('as-risk-status');
    const asFlaggedCount = document.getElementById('as-flagged-count');
    const auditTableBody = document.getElementById('audit-table-body');

    // Trial Balance Sample Accounts (£)
    const trialBalanceAccounts = [
        { account: "Turnover (Commercial Revenue)", cy: 12450000, py: 10800000, substantive: "ISA 240 revenue fraud presumption; 100% journal testing & cut-off sample" },
        { account: "Cost of Sales (Direct Materials)", cy: 7850000, py: 6920000, substantive: "Gross margin analytical review; standard costing variance & purchase vouching" },
        { account: "Trade Debtors & Receivables", cy: 1980000, py: 1420000, substantive: "Direct circularisation of key balances; IFRS 9 ECL provision review" },
        { account: "Fixed Asset Additions (CapEx)", cy: 840000, py: 490000, substantive: "Vouching asset additions to invoices & physical asset inspection" },
        { account: "Accrued Expenses & Deferred Income", cy: 460000, py: 385000, substantive: "Post-period bank disbursements search for unrecorded liabilities" },
        { account: "Year-End Inventory Valuation", cy: 1220000, py: 1140000, substantive: "Year-end inventory count observation & net realisable value testing" }
    ];

    const calculateAuditMateriality = () => {
        if (!sPm || !sPerf || !sTrivial) return;

        const pm = parseFloat(sPm.value); // In £
        const perfPct = parseFloat(sPerf.value) / 100; // % of PM
        const trivialPct = parseFloat(sTrivial.value) / 100; // % of PM

        const perfMat = pm * perfPct;
        const trivialThresh = pm * trivialPct;

        // Update readouts
        if (vPm) vPm.textContent = `£${pm.toLocaleString()}`;
        if (vPerf) vPerf.textContent = `${(perfPct * 100).toFixed(0)}% (£${(perfMat / 1000).toFixed(1)}k)`;
        if (vCtt) vCtt.textContent = `${(trivialPct * 100).toFixed(0)}% (£${(trivialThresh / 1000).toFixed(1)}k)`;

        // Evaluate Table
        let breachCount = 0;
        if (auditTableBody) {
            auditTableBody.innerHTML = trialBalanceAccounts.map(row => {
                const diff = Math.abs(row.cy - row.py);
                const pctChange = ((row.cy - row.py) / row.py) * 100;

                let statusBadge = '';
                if (diff >= pm) {
                    breachCount++;
                    statusBadge = `<span class="badge-risk-high" style="color:#E74C3C; font-weight:600;">⚠ Material Risk (Exceeds PM)</span>`;
                } else if (diff >= perfMat) {
                    breachCount++;
                    statusBadge = `<span class="badge-risk-review" style="color:var(--accent-gold); font-weight:600;">⚡ Substantive Testing Required (Exceeds Perf. Mat.)</span>`;
                } else {
                    statusBadge = `<span class="badge-risk-low" style="color:#2ECC71; font-weight:500;">✓ Analytical Pass / Low Risk</span>`;
                }

                return `
                    <tr>
                        <td><strong>${row.account}</strong></td>
                        <td>£${(row.cy / 1000).toLocaleString()}k</td>
                        <td>£${(row.py / 1000).toLocaleString()}k</td>
                        <td><strong>£${(diff / 1000).toLocaleString()}k</strong></td>
                        <td><strong>${pctChange >= 0 ? '+' : ''}${pctChange.toFixed(1)}%</strong></td>
                        <td>
                            ${statusBadge}
                            <div style="font-size:11px; color:var(--text-muted); margin-top:3px;">${row.substantive}</div>
                        </td>
                    </tr>
                `;
            }).join('');
        }

        if (asFlaggedCount) {
            asFlaggedCount.textContent = `${breachCount} Account${breachCount === 1 ? '' : 's'} Flagged`;
        }

        if (asRiskStatus) {
            if (breachCount >= 3) {
                asRiskStatus.textContent = "High Materiality Exposure (Expanded Audit Scope)";
                asRiskStatus.style.color = "#E74C3C";
            } else if (breachCount >= 1) {
                asRiskStatus.textContent = "Moderate (Standard Substantive Testing Scope)";
                asRiskStatus.style.color = "var(--accent-gold)";
            } else {
                asRiskStatus.textContent = "Low Engagement Risk (Substantive Sample Only)";
                asRiskStatus.style.color = "#2ECC71";
            }
        }
    };

    [sPm, sPerf, sTrivial].forEach(slider => {
        if (slider) {
            slider.addEventListener('input', () => {
                calculateAuditMateriality();
                playAudioFeedback(480 + parseFloat(slider.value) * 0.001, 0.015);
            });
        }
    });

    // Run initial Audit Materiality
    calculateAuditMateriality();

    // 20. Portfolio Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                playAudioFeedback(520, 0.03);

                const filter = btn.getAttribute('data-filter');
                projectCards.forEach(card => {
                    const cats = card.getAttribute('data-category') || '';
                    if (filter === 'all' || cats.includes(filter)) {
                        card.classList.remove('is-hidden');
                    } else {
                        card.classList.add('is-hidden');
                    }
                });
            });
        });
    }

    // 21. Modal Controller (Recruiter Dossier, Case Study, Commentary, Product Progress)
    const recruiterModal = document.getElementById('recruiter-modal');
    const caseStudyModal = document.getElementById('case-study-modal');
    const articleModal = document.getElementById('article-modal');
    const progressModal = document.getElementById('progress-modal');

    const openModal = (modal) => {
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        playAudioFeedback(700, 0.05);
    };

    const closeModal = (modal) => {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Close on backdrop click or Escape key
    [recruiterModal, caseStudyModal, articleModal, progressModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal(modal);
            });
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal(recruiterModal);
            closeModal(caseStudyModal);
            closeModal(articleModal);
            closeModal(progressModal);
        }
    });

    // Recruiter Dossier Triggers
    const btnOpenRecruiter = document.getElementById('open-recruiter-modal');
    const heroOpenRecruiter = document.getElementById('hero-recruiter-btn');
    const footerRecruiterLink = document.getElementById('footer-recruiter-link');
    const closeRecruiterModal = document.getElementById('close-recruiter-modal');
    const modalPrintView = document.getElementById('modal-print-view');

    if (btnOpenRecruiter) btnOpenRecruiter.addEventListener('click', () => openModal(recruiterModal));
    if (heroOpenRecruiter) heroOpenRecruiter.addEventListener('click', () => openModal(recruiterModal));
    if (footerRecruiterLink) footerRecruiterLink.addEventListener('click', (e) => { e.preventDefault(); openModal(recruiterModal); });
    if (btnMatchDossier) btnMatchDossier.addEventListener('click', () => openModal(recruiterModal));
    if (closeRecruiterModal) closeRecruiterModal.addEventListener('click', () => closeModal(recruiterModal));
    if (modalPrintView) modalPrintView.addEventListener('click', () => window.print());

    // Product Progress Modal Triggers (Self Assessment Pro)
    const btnOpenProgressModal = document.getElementById('btn-open-progress-modal');
    const closeProgressModal = document.getElementById('close-progress-modal');
    const progCloseBtn = document.getElementById('prog-close-btn');

    if (btnOpenProgressModal) btnOpenProgressModal.addEventListener('click', () => openModal(progressModal));
    if (closeProgressModal) closeProgressModal.addEventListener('click', () => closeModal(progressModal));
    if (progCloseBtn) progCloseBtn.addEventListener('click', () => closeModal(progressModal));

    // Case Studies Data
    const caseStudyData = {
        1: {
            title: "VAT Categorisation Automation — ATCL Accounting",
            category: "AI Automation & Practice Workflows",
            subtitle: "Agentic AI Workflow Built with Claude Code",
            challenge: "Manual VAT categorisation across client transaction files was time-consuming, repetitive, and prone to misclassifications across standard, zero-rated, and exempt expenses under Making Tax Digital (MTD) rules.",
            methodology: "Designed and implemented an agentic AI categorisation workflow using Claude Code to parse transaction descriptions, match invoice context against HMRC VAT guidance, and flag uncertain postings for accountant sign-off.",
            metrics: [
                { val: "~1 Day/Wk", label: "Manual Processing Saved" },
                { val: "30+", label: "Client Returns Processed" },
                { val: "100%", label: "MTD Filing Compliance" }
            ],
            competencies: "Process innovation, agentic AI implementation, Making Tax Digital (MTD), Xero general ledgers, practical accounting initiative."
        },
        2: {
            title: "St Mary's Student Investment Society Launch & Leadership",
            category: "University Leadership & Organisation",
            subtitle: "Founded from Concept to Active Student Society",
            challenge: "The university lacked an active student-led finance and investment community to discuss market analysis, financial modeling, and career opportunities in professional services.",
            methodology: "Founded the society from scratch: authored the official constitution, designed executive pitch decks on Gamma, produced promotional multimedia assets, and executed a campus-wide member recruitment campaign.",
            metrics: [
                { val: "Founded", label: "From Zero to Active" },
                { val: "100%", label: "Student-Led Governance" },
                { val: "2", label: "Societies Established" }
            ],
            competencies: "Whole leadership, stakeholder engagement, society governance, multimedia presentation, team recruitment."
        },
        3: {
            title: "SME Practice Accounting & MTD Compliance — ATCL Accounting",
            category: "Practice Experience · Junior Accountant",
            subtitle: "Client Bookkeeping, Bank Recs & HMRC Liaison",
            challenge: "Managing compliance and reconciliation for diverse SME client files with messy bank feeds, missing purchase invoices, and strict statutory VAT submission deadlines under HMRC's Making Tax Digital rules.",
            methodology: "Executed end-to-end bank reconciliations on Xero, investigated unallocated ledger entries, prepared quarterly VAT submissions, and drafted formal correspondence to resolve client compliance inquiries with HMRC.",
            metrics: [
                { val: "18 Mos", label: "Practice Experience" },
                { val: "Zero", label: "HMRC Late Penalties" },
                { val: "100%", label: "Audit-Ready Reconciliations" }
            ],
            competencies: "Xero cloud accounting, bank reconciliations, HMRC liaison, client communication, Making Tax Digital compliance."
        },
        4: {
            title: "Dynamic DCF Valuation & Sensitivity Modelling Sandbox",
            category: "Quantitative Modelling & Learning Sandbox",
            subtitle: "Self-Directed Corporate Finance Valuation Engine",
            challenge: "Classroom financial models often rely on static formulas without illustrating how enterprise value fluctuates across growth assumptions, discount rates, and capital structures.",
            methodology: "Constructed an interactive 5-year DCF model using JavaScript and SVG. Engineered dynamic sensitivity testing across Revenue CAGR, EBITDA margin, WACC discounting (mid-year convention), and terminal exit multiples.",
            metrics: [
                { val: "5 Years", label: "Cash Flow Projections" },
                { val: "Live SVG", label: "Real-Time Visualisation" },
                { val: "ACA", label: "Aligned Valuation Logic" }
            ],
            competencies: "DCF valuation mechanics, WACC discounting, scenario sensitivity, analytical coding, quantitative modeling."
        }
    };

    const csModalCategory = document.getElementById('cs-modal-category');
    const csModalTitle = document.getElementById('cs-modal-title');
    const csModalSubtitle = document.getElementById('cs-modal-subtitle');
    const csModalBody = document.getElementById('cs-modal-body');
    const closeCaseModal = document.getElementById('close-case-modal');
    const csCloseBtn = document.getElementById('cs-close-btn');

    document.querySelectorAll('.btn-open-case-study').forEach(btn => {
        btn.addEventListener('click', () => {
            const caseId = btn.getAttribute('data-case');
            const data = caseStudyData[caseId];
            if (!data) return;

            csModalCategory.textContent = data.category;
            csModalTitle.textContent = data.title;
            csModalSubtitle.textContent = data.subtitle;

            csModalBody.innerHTML = `
                <div class="cs-detail-section">
                    <h4 class="cs-section-heading">The Commercial Challenge</h4>
                    <p class="cs-section-text">${data.challenge}</p>
                </div>

                <div class="cs-detail-section">
                    <h4 class="cs-section-heading">Analytical Methodology &amp; Framework</h4>
                    <p class="cs-section-text">${data.methodology}</p>
                </div>

                <div class="cs-detail-section">
                    <h4 class="cs-section-heading">Quantified Business Impact</h4>
                    <div class="cs-metric-highlight-row">
                        ${data.metrics.map(m => `
                            <div class="cs-kpi-pill">
                                <span class="cs-kpi-val">${m.val}</span>
                                <span class="cs-kpi-lbl">${m.label}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="cs-detail-section" style="background:var(--bg-card-dark); border:1px solid var(--border-card-dark); border-radius:14px; padding:1.25rem;">
                    <h4 class="cs-section-heading" style="font-size:1rem; margin-bottom:4px;">Core Professional Capabilities Demonstrated:</h4>
                    <p class="cs-section-text" style="font-size:0.9rem; color:var(--text-light);">${data.competencies}</p>
                </div>
            `;

            openModal(caseStudyModal);
        });
    });

    if (closeCaseModal) closeCaseModal.addEventListener('click', () => closeModal(caseStudyModal));
    if (csCloseBtn) csCloseBtn.addEventListener('click', () => closeModal(caseStudyModal));

    // Article / Thought Leadership Commentary Data
    const articleData = {
        1: {
            title: "Automating Accounting: How I Cut VAT Processing Time with Agentic AI",
            category: "Practice Automation & AI",
            date: "Published 15 June 2026 · By Zunair Khawaja",
            content: `
                <p>Manual VAT categorisation across dozens of client files has historically been one of the biggest time sinks in practice accounting. Going line by line matching bank descriptions against VAT rules, checking for zero-rated items, and investigating anomalies took hours of focus that could have been spent on client advisory.</p>
                <h4 style="color:var(--accent-gold); margin:1.25rem 0 0.5rem; font-family:var(--font-heading);">Building the Solution with Claude Code</h4>
                <p>Rather than accepting this repetitive burden, I designed an agentic AI workflow with Claude Code to ingest client transactions, parse vendor descriptions, and classify items against HMRC Making Tax Digital rules. Postings with ambiguity are automatically tagged for review, ensuring full human-in-the-loop audit integrity.</p>
                <h4 style="color:var(--accent-gold); margin:1.25rem 0 0.5rem; font-family:var(--font-heading);">Production Results</h4>
                <p>The workflow is now in active use across 30+ client VAT returns, consistently saving roughly a full working day per week across our practice team. It proved that young accountants who understand code and agentic tools can create immediate, tangible operational leverage.</p>
            `
        },
        2: {
            title: "Bridging the Gap: What Balancing Practice Accounting & Degree Studies Teaches You",
            category: "Professional Development",
            date: "Published 02 June 2026 · By Zunair Khawaja",
            content: `
                <p>In university lecture theatres, trial balances always balance, inventory ledgers are pristine, and exam questions provide unambiguous facts. Entering practice accounting quickly dispels those comfortable assumptions.</p>
                <h4 style="color:var(--accent-gold); margin:1.25rem 0 0.5rem; font-family:var(--font-heading);">The Reality of Messy Data</h4>
                <p>Over the past 18 months as a Junior Accountant at ATCL Accounting, I have navigated incomplete client bank statements, unallocated ledger transactions, and strict HMRC quarterly filing deadlines. This work has built resilience, meticulous attention to detail, and professional skepticism.</p>
                <h4 style="color:var(--accent-gold); margin:1.25rem 0 0.5rem; font-family:var(--font-heading);">Preparation for the ACA Track</h4>
                <p>Balancing degree studies with commercial responsibilities has forced me to master time management and rapid context switching — direct preparation for tackling the ICAEW ACA examinations while serving client engagements on a graduate scheme.</p>
            `
        },
        3: {
            title: "Founding a University Society: Leadership, Governance, and Pitching From Zero",
            category: "Leadership & Initiative",
            date: "Published 18 May 2026 · By Zunair Khawaja",
            content: `
                <p>Starting an organisation from a blank page is the fastest way to understand governance, stakeholder management, and collective motivation. At St Mary's University, I noticed a gap for an active student-led finance forum, so I founded the Student Investment Society.</p>
                <h4 style="color:var(--accent-gold); margin:1.25rem 0 0.5rem; font-family:var(--font-heading);">From Concept to Execution</h4>
                <p>Establishing the society required drafting a formal constitution, securing student union approval, building pitch decks on Gamma, producing video content, and running campus recruitment drives. Separately, I launched a Sports & Games society to foster broader campus community engagement.</p>
                <h4 style="color:var(--accent-gold); margin:1.25rem 0 0.5rem; font-family:var(--font-heading);">Translating to Professional Services</h4>
                <p>Whether in audit, tax, or advisory, graduate trainees must communicate with enthusiasm, organize initiatives, and take ownership of ambiguous challenges without waiting for step-by-step instructions. Building these societies taught me how to take an idea and make it real.</p>
            `
        }
    };

    const artModalCategory = document.getElementById('art-modal-category');
    const artModalTitle = document.getElementById('art-modal-title');
    const artModalDate = document.getElementById('art-modal-date');
    const artModalBody = document.getElementById('art-modal-body');
    const closeArticleModal = document.getElementById('close-article-modal');
    const artCloseBtn = document.getElementById('art-close-btn');

    document.querySelectorAll('.blog-read-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const artId = btn.getAttribute('data-article');
            const data = articleData[artId];
            if (!data) return;

            artModalCategory.textContent = data.category;
            artModalTitle.textContent = data.title;
            artModalDate.textContent = data.date;
            artModalBody.innerHTML = data.content;

            openModal(articleModal);
        });
    });

    if (closeArticleModal) closeArticleModal.addEventListener('click', () => closeModal(articleModal));
    if (artCloseBtn) artCloseBtn.addEventListener('click', () => closeModal(articleModal));

    // 22. Download CV Button Simulation
    const downloadCvButtons = [
        document.getElementById('hero-cv-btn'),
        document.getElementById('btn-download-cv-bottom'),
        document.getElementById('modal-download-cv')
    ];

    downloadCvButtons.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                playAudioFeedback(800, 0.06);
                showToast('Preparing CV PDF for download...');
                setTimeout(() => {
                    // Open printer friendly dossier or initiate simulated download
                    window.print();
                }, 400);
            });
        }
    });

    // 23. Upgraded Recruitment Contact Form
    const contactForm = document.getElementById('contact-form');
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (contactForm) {
        const validateField = (field) => {
            const group = field.closest('.form-group');
            if (!group) return true;
            const errorSpan = group.querySelector('.error-message');
            const val = field.value.trim();
            let isValid = true;
            let errorMsg = '';

            if (field.hasAttribute('required') && !val) {
                isValid = false;
                errorMsg = 'Required field.';
            } else if (field.type === 'email' && val && !EMAIL_REGEX.test(val)) {
                isValid = false;
                errorMsg = 'Please provide a valid corporate email.';
            }

            if (!isValid) {
                group.classList.add('error');
                if (errorSpan) errorSpan.textContent = errorMsg;
            } else {
                group.classList.remove('error');
                if (errorSpan) errorSpan.textContent = '';
            }
            return isValid;
        };

        contactForm.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('input', () => validateField(field));
            field.addEventListener('change', () => validateField(field));
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fields = contactForm.querySelectorAll('input, textarea, select');
            let formValid = true;
            fields.forEach(f => {
                if (!validateField(f)) formValid = false;
            });

            if (!formValid) {
                playAudioFeedback(250, 0.08);
                return;
            }

            const btn = contactForm.querySelector('.btn-submit');
            const btnText = btn.querySelector('.btn-text');
            const originalText = btnText ? btnText.textContent : 'Submit Inquiry';
            const successMsg = document.getElementById('form-success');

            btn.disabled = true;
            if (btnText) btnText.textContent = 'Preparing Mail...';
            playAudioFeedback(650, 0.05);

            setTimeout(() => {
                const fd = new FormData(contactForm);
                const name = fd.get('name') || '';
                const company = fd.get('company') || '';
                const stream = fd.get('stream') || 'Graduate Recruitment Opportunity';
                const message = fd.get('message') || '';

                const subject = `[Graduate Application] ${company} - ${stream} - ${name}`;
                const body = `Hi Zunair,\n\nI am contacting you from ${company} regarding the ${stream}.\n\nMessage:\n${message}\n\nBest regards,\n${name}`;
                const mailto = `mailto:zunairnadeem82@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

                if (successMsg) {
                    successMsg.classList.add('visible');
                    successMsg.innerHTML = `
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        <p>Inquiry prepared! <a href="${mailto}" style="color:var(--accent-gold); font-weight:700; text-decoration:underline;">Click to launch email client</a> or copy address.</p>
                    `;
                    showToast('Inquiry drafted successfully');
                    setTimeout(() => {
                        window.location.href = mailto;
                    }, 800);
                }

                contactForm.reset();
                btn.disabled = false;
                if (btnText) btnText.textContent = originalText;
            }, 600);
        });
    }

    // 24. Tag & Pill Stagger Animations
    const tagContainers = document.querySelectorAll('.matrix-tags, .service-meta-tags, .building-tech-stack');
    if (tagContainers.length && !prefersReducedMotion) {
        const tagObs = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        tagContainers.forEach(container => tagObs.observe(container));
    }
});
