document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Scroll Reveal Animations
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger on load

    // 2. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(faq => {
                faq.classList.remove('active');
                faq.querySelector('.faq-answer').style.maxHeight = null;
            });

            // If it wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // 4. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80; // Height of fixed header
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // 5. Vagas Countdown
    const vagasCountEl = document.getElementById('vagas-count');
    if (vagasCountEl) {
        let vagas = 46;
        
        const updateVagas = () => {
            vagas--;
            if (vagas < 19) {
                vagas = 46;
            }
            vagasCountEl.textContent = vagas;
            
            vagasCountEl.classList.remove('number-pulse');
            void vagasCountEl.offsetWidth; // trigger reflow
            vagasCountEl.classList.add('number-pulse');
        };

        const scheduleNextUpdate = () => {
            const delay = Math.floor(Math.random() * (30000 - 20000 + 1)) + 20000;
            setTimeout(() => {
                updateVagas();
                scheduleNextUpdate();
            }, delay);
        };

        scheduleNextUpdate();
    }

    // 6. Interactive Canvas Particles
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const heroSection = document.getElementById('hero-section');
        
        let width, height;
        let particles = [];
        
        // Adjust count based on screen size (mobile performance)
        const isMobile = window.innerWidth <= 768;
        const particleCount = isMobile ? 30 : 80;
        
        let mouse = { x: null, y: null };
        
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        
        heroSection.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        function resize() {
            width = heroSection.clientWidth;
            height = heroSection.clientHeight;
            canvas.width = width;
            canvas.height = height;
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 3 + 1;
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = (Math.random() * 30) + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                // Premium Purple and Neon colors
                const colors = ['rgba(176, 38, 255, 0.6)', 'rgba(153, 0, 255, 0.4)', 'rgba(255, 255, 255, 0.15)'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.blur = Math.random() > 0.5;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Bounce off edges smoothly
                if (this.x < 0 || this.x > width) this.speedX *= -1;
                if (this.y < 0 || this.y > height) this.speedY *= -1;

                // Gentle mouse repulsion
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    let maxDistance = 150;
                    
                    if (distance < maxDistance) {
                        let forceDirectionX = dx / distance;
                        let forceDirectionY = dy / distance;
                        let force = (maxDistance - distance) / maxDistance;
                        let directionX = forceDirectionX * force * this.density;
                        let directionY = forceDirectionY * force * this.density;
                        
                        this.x -= directionX * 0.05;
                        this.y -= directionY * 0.05;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fillStyle = this.color;
                
                if (this.blur) {
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = 'rgba(176, 38, 255, 0.8)';
                } else {
                    ctx.shadowBlur = 0;
                }
                
                ctx.fill();
            }
        }

        function init() {
            resize();
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', () => {
            resize();
        });

        init();
        animate();
    }

    // 7. Global Vimeo Custom Overlay Integration
    if (typeof Vimeo !== 'undefined') {
        const vimeoWrappers = document.querySelectorAll('.custom-vimeo-wrapper');
        
        vimeoWrappers.forEach(wrapper => {
            const iframe = wrapper.querySelector('.custom-vimeo-iframe');
            const overlay = wrapper.querySelector('.custom-vimeo-overlay');
            
            if (iframe && overlay) {
                const player = new Vimeo.Player(iframe);
                let isPlaying = false;

                overlay.addEventListener('click', () => {
                    if (!isPlaying) {
                        player.setVolume(1).then(() => {
                            player.play();
                        }).catch(error => {
                            console.error('Erro ao iniciar o vídeo do Vimeo:', error);
                            player.play(); // Fallback
                        });
                    } else {
                        player.pause();
                    }
                });

                player.on('play', () => {
                    isPlaying = true;
                    overlay.classList.add('playing');
                });

                player.on('pause', () => {
                    isPlaying = false;
                    overlay.classList.remove('playing');
                });

                player.on('ended', () => {
                    isPlaying = false;
                    overlay.classList.remove('playing');
                });
            }
        });
    }
});

function appendCurrentParamsToUrl(baseUrl) {
  const currentParams = new URLSearchParams(window.location.search);
  const checkoutUrl = new URL(baseUrl);

  currentParams.forEach((value, key) => {
    checkoutUrl.searchParams.set(key, value);
  });

  return checkoutUrl.toString();
}

function irParaCheckout(event, checkoutBaseUrl) {
  if (event) event.preventDefault();

  if (typeof fbq === 'function') {
    fbq('track', 'InitiateCheckout', {
      content_name: 'Extra IA',
      content_ids: ['extra-ia-mensal'],
      content_type: 'product',
      value: 17.90,
      currency: 'BRL',
      num_items: 1
    });
  }

  const finalCheckoutUrl = appendCurrentParamsToUrl(checkoutBaseUrl);

  setTimeout(function() {
    window.location.href = finalCheckoutUrl;
  }, 300);
}
