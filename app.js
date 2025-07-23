// DOM Elements
const body = document.body;
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const themeToggle = document.getElementById('theme-toggle');
const heroImage = document.getElementById('hero-image');
const typingText = document.getElementById('typing-text');
const aiInput = document.getElementById('ai-input');
const aiPersonalizeBtn = document.getElementById('ai-personalize');
const aiResult = document.getElementById('ai-result');
const contactForm = document.getElementById('contact-form');

// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('portfolio-theme') || 'dark';
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    setTheme(theme) {
        console.log(`Setting theme to: ${theme}`);
        body.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('portfolio-theme', theme);
        
        // Update theme toggle text
        if (themeToggle) {
            const toggleText = themeToggle.querySelector('.theme-toggle__text');
            if (toggleText) {
                toggleText.textContent = theme === 'hacker' ? 'Dark Mode' : 'Hacker Mode';
            }
        }
        
        // Force style recalculation
        body.style.display = 'none';
        body.offsetHeight; // trigger reflow
        body.style.display = '';
    }

    toggleTheme() {
        console.log(`Current theme: ${this.currentTheme}`);
        const newTheme = this.currentTheme === 'dark' ? 'hacker' : 'dark';
        console.log(`Switching to theme: ${newTheme}`);
        this.setTheme(newTheme);
    }
}

// Navigation
class Navigation {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        // Mobile menu toggle
        if (navToggle) {
            navToggle.addEventListener('click', () => this.toggleMenu());
        }
        
        // Close menu when clicking on links
        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleNavClick(e);
                this.closeMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && navMenu && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Handle scroll for header effects
        window.addEventListener('scroll', () => this.handleScroll());
    }

    toggleMenu() {
        this.isOpen = !this.isOpen;
        if (navMenu) navMenu.classList.toggle('show', this.isOpen);
        if (navToggle) navToggle.classList.toggle('active', this.isOpen);
    }

    closeMenu() {
        this.isOpen = false;
        if (navMenu) navMenu.classList.remove('show');
        if (navToggle) navToggle.classList.remove('active');
    }

    handleNavClick(e) {
        e.preventDefault();
        const href = e.target.getAttribute('href');
        if (href && href.startsWith('#')) {
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = 70;
                const targetPosition = target.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }

    handleScroll() {
        const header = document.getElementById('header');
        if (header) {
            const isHacker = body.getAttribute('data-theme') === 'hacker';
            if (window.scrollY > 100) {
                header.style.background = isHacker 
                    ? 'rgba(0, 0, 0, 0.98)' 
                    : 'rgba(57, 62, 70, 0.98)';
            } else {
                header.style.background = isHacker 
                    ? 'rgba(0, 0, 0, 0.95)' 
                    : 'rgba(57, 62, 70, 0.95)';
            }
        }
    }
}

// Typing Animation
class TypingAnimation {
    constructor(element, text) {
        this.element = element;
        this.text = text;
        this.isDeleting = false;
        this.currentText = '';
        this.typeSpeed = 100;
        this.deleteSpeed = 50;
        this.pauseTime = 2000;
    }

    init() {
        this.type();
    }

    type() {
        const fullText = this.text;
        
        if (!this.isDeleting) {
            this.currentText = fullText.substring(0, this.currentText.length + 1);
        } else {
            this.currentText = fullText.substring(0, this.currentText.length - 1);
        }

        this.element.textContent = this.currentText;

        let speed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

        if (!this.isDeleting && this.currentText === fullText) {
            speed = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentText === '') {
            this.isDeleting = false;
            speed = 500;
        }

        setTimeout(() => this.type(), speed);
    }
}

// AI Personalization
class AIPersonalizer {
    constructor() {
        this.responses = {
            'recruiter': {
                title: 'For Tech Recruiters',
                content: `I'm Pranav Dixit, a passionate B.Tech CSE student specializing in AI/ML with hands-on experience in full-stack development and machine learning. I've built production-ready applications using React, Next.js, and Python, with a strong foundation in data structures and algorithms.

My recent projects include sentiment analysis tools and interactive web applications, demonstrating both technical depth and user-centric design thinking. I'm actively seeking opportunities to contribute to innovative teams where I can apply my AI/ML expertise and grow as a software engineer.

I'm particularly interested in roles that blend frontend development with AI integration, and I'm ready to bring fresh perspectives and strong problem-solving skills to your organization.`
            },
            'founder': {
                title: 'For Startup Founders',
                content: `I'm Pranav Dixit, a technically versatile developer who thrives in fast-paced, innovation-driven environments. With expertise spanning from React/Next.js frontend development to AI/ML backend systems, I can wear multiple hats and adapt quickly to evolving product needs.

My experience building sentiment analysis tools and interactive applications has taught me to balance technical excellence with user experience. I understand the startup mindset of rapid iteration and building MVPs that can scale.

I'm drawn to startups tackling meaningful problems in education, healthcare, or automation. I bring not just coding skills, but also the entrepreneurial mindset needed to help transform ideas into impactful products that users love.`
            },
            'student': {
                title: 'For Fellow Students',
                content: `Hey there! I'm Pranav, a B.Tech CSE student just like you, passionate about AI/ML and always eager to learn and share knowledge. My journey has been all about building cool projects while mastering the fundamentals.

From creating sentiment analysis tools with Python to building responsive web apps with React, I believe in learning by doing. I've participated in coding challenges like the 21-Day DSA Challenge and workshops on robotics and cloud technologies.

If you're looking for someone to collaborate on projects, discuss the latest in AI/ML, or just geek out about code, I'd love to connect! I'm always excited to work with fellow students on innovative projects and learn from each other's experiences.`
            },
            'professor': {
                title: 'For Academic Professionals',
                content: `I'm Pranav Dixit, a dedicated B.Tech Computer Science student with a specialization in Artificial Intelligence and Machine Learning. My academic journey reflects a deep commitment to understanding both theoretical foundations and practical applications of computer science.

My projects demonstrate a systematic approach to problem-solving, from implementing NLTK's VADER sentiment analysis model to developing interactive applications with modern web technologies. I've actively participated in academic workshops and coding challenges, earning certifications from IEEE and industry partnerships.

I'm particularly interested in the ethical applications of AI in education and healthcare, and I approach each project with both technical rigor and consideration for real-world impact. I value continuous learning and am always seeking opportunities to deepen my understanding of emerging technologies.`
            }
        };
        this.init();
    }

    init() {
        if (!aiInput || !aiPersonalizeBtn) return;

        // Enable/disable button based on input
        aiInput.addEventListener('input', () => {
            const hasContent = aiInput.value.trim().length > 0;
            aiPersonalizeBtn.disabled = !hasContent;
        });

        // Handle personalization
        aiPersonalizeBtn.addEventListener('click', () => this.personalizeIntroduction());

        // Handle Enter key in textarea
        aiInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (!aiPersonalizeBtn.disabled) {
                    this.personalizeIntroduction();
                }
            }
        });
    }

    personalizeIntroduction() {
        const input = aiInput.value.trim().toLowerCase();
        if (!input) return;

        this.showLoading(true);

        // Simulate AI processing delay
        setTimeout(() => {
            const response = this.generateResponse(input);
            this.displayResponse(response);
            this.showLoading(false);
        }, 1500);
    }

    generateResponse(input) {
        // Simple keyword matching for demo
        if (input.includes('recruit') || input.includes('hr') || input.includes('hiring')) {
            return this.responses.recruiter;
        } else if (input.includes('founder') || input.includes('startup') || input.includes('entrepreneur')) {
            return this.responses.founder;
        } else if (input.includes('student') || input.includes('peer') || input.includes('classmate')) {
            return this.responses.student;
        } else if (input.includes('professor') || input.includes('academic') || input.includes('teacher') || input.includes('faculty')) {
            return this.responses.professor;
        } else {
            // Default personalized response
            return {
                title: 'Personalized Introduction',
                content: `Hi! I'm Pranav Dixit, a passionate developer and AI/ML enthusiast currently pursuing B.Tech in Computer Science. Based on your background, I'd love to connect and explore how we can collaborate or learn from each other.

My experience spans full-stack development with React and Next.js, machine learning with Python, and building user-centric applications. I'm always excited to discuss technology, share knowledge, and work on meaningful projects that make a positive impact.

Whether you're interested in my technical projects, want to collaborate, or simply want to chat about the latest in AI and development, I'm here and eager to connect!`
            };
        }
    }

    showLoading(isLoading) {
        if (!aiPersonalizeBtn) return;
        
        const btnText = aiPersonalizeBtn.querySelector('.btn-text');
        const spinner = aiPersonalizeBtn.querySelector('.loading-spinner');
        
        if (isLoading) {
            aiPersonalizeBtn.classList.add('loading');
            aiPersonalizeBtn.disabled = true;
            if (btnText) btnText.style.opacity = '0';
            if (spinner) spinner.style.display = 'block';
        } else {
            aiPersonalizeBtn.classList.remove('loading');
            aiPersonalizeBtn.disabled = false;
            if (btnText) btnText.style.opacity = '1';
            if (spinner) spinner.style.display = 'none';
        }
    }

    displayResponse(response) {
        if (!aiResult) return;
        
        const content = aiResult.querySelector('.ai-result__content');
        if (content) {
            content.innerHTML = `
                <h3 style="color: var(--primary-color); margin-bottom: 1rem; font-family: var(--font-heading);">
                    ${response.title}
                </h3>
                <div style="color: var(--text-secondary); line-height: 1.6; white-space: pre-line;">
                    ${response.content}
                </div>
            `;
        }
        
        aiResult.style.display = 'block';
        aiResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Contact Form Handler
class ContactForm {
    constructor() {
        this.init();
    }

    init() {
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const subjectEl = document.getElementById('contact-subject');
        const messageEl = document.getElementById('contact-message');
        
        if (!subjectEl || !messageEl) return;
        
        const subject = subjectEl.value.trim();
        const message = messageEl.value.trim();
        
        if (!subject && !message) {
            alert('Please fill in at least the subject or message field.');
            return;
        }

        // Create mailto link
        const email = 'pranav1467d@gmail.com';
        const mailtoSubject = subject || 'Portfolio Contact';
        const mailtoBody = message || 'Hello Pranav, I would like to get in touch with you.';
        
        const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(mailtoSubject)}&body=${encodeURIComponent(mailtoBody)}`;
        
        // Open default email client
        window.location.href = mailtoLink;
    }
}

// Image Loader
class ImageLoader {
    constructor() {
        this.init();
    }

    init() {
        if (heroImage) {
            this.loadHeroImage();
        }
    }

    loadHeroImage() {
        // Add loading class initially
        heroImage.style.opacity = '0';
        heroImage.style.transform = 'scale(0.8)';
        
        // When image loads, trigger animation
        heroImage.addEventListener('load', () => {
            setTimeout(() => {
                heroImage.style.opacity = '1';
                heroImage.style.transform = 'scale(1)';
            }, 500);
        });

        // If image is already cached and loaded
        if (heroImage.complete) {
            setTimeout(() => {
                heroImage.style.opacity = '1';
                heroImage.style.transform = 'scale(1)';
            }, 500);
        }
    }
}

// Animation Observer
class AnimationObserver {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        // Create intersection observer for animations
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.card, .section__header, .hero__content');
        animatedElements.forEach(el => {
            this.observer.observe(el);
        });
    }
}

// Smooth Scrolling Enhancement
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Add smooth scrolling to all internal links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link && !link.hasAttribute('target')) {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = 70;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        // Lazy load images
        if ('IntersectionObserver' in window) {
            this.lazyLoadImages();
        }
        
        // Optimize scrolling performance
        this.optimizeScrolling();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    optimizeScrolling() {
        let ticking = false;
        
        const updateScrollPosition = () => {
            // Any scroll-based updates go here
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollPosition);
                ticking = true;
            }
        }, { passive: true });
    }
}

// Initialize Application
class App {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        try {
            // Initialize all components
            console.log('Initializing Portfolio App components...');
            
            new ThemeManager();
            new Navigation();
            new AIPersonalizer();
            new ContactForm();
            new ImageLoader();
            new AnimationObserver();
            new SmoothScroll();
            new PerformanceMonitor();

            // Initialize typing animation
            if (typingText) {
                const typingAnimation = new TypingAnimation(typingText, 'Crafting Digital Experiences');
                setTimeout(() => typingAnimation.init(), 1000);
            }

            // Add loaded class to body for CSS transitions
            document.body.classList.add('loaded');

            console.log('🤖 Portfolio application initialized successfully!');
        } catch (error) {
            console.error('Error initializing application:', error);
        }
    }
}

// Global error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// Start the application
new App();

// Export for debugging
window.PortfolioApp = {
    ThemeManager,
    Navigation,
    AIPersonalizer,
    ContactForm,
    ImageLoader
};