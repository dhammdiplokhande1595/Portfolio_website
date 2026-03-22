// ================================
// CUSTOM CURSOR
// ================================
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

let mouseX = 0;
let mouseY = 0;
let ringX = 0;
let ringY = 0;

// Only enable cursor logic on non-touch devices
if (!('ontouchstart' in window)) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    function animateRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        
        cursorRing.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;
        
        requestAnimationFrame(animateRing);
    }
    animateRing();
} else {
    // Ensure cursor is hidden on touch devices
    if(cursorDot) cursorDot.style.display = 'none';
    if(cursorRing) cursorRing.style.display = 'none';
}

// ================================
// PARTICLE CANVAS ANIMATION
// ================================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
// Reduce particle count on mobile for performance
const isMobile = window.innerWidth < 768;
const particleCount = isMobile ? 50 : 100;
const connectionDistance = isMobile ? 80 : 100;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }
    
    draw() {
        ctx.fillStyle = `rgba(0, 245, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}
initParticles();

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    // Connect nearby particles
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < connectionDistance) {
                ctx.strokeStyle = `rgba(0, 245, 255, ${0.2 * (1 - distance / connectionDistance)})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    
    requestAnimationFrame(animateParticles);
}

animateParticles();

window.addEventListener('resize', () => {
    resizeCanvas();
    // Optional: Re-init particles on drastic resize
});

// ================================
// TYPING EFFECT
// ================================
const typingText = document.querySelector('.typed-text');
const texts = [
    'Data Scientist',
    'Problem Solver'
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
        typingText.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let typeSpeed = 100;
    
    if (isDeleting) {
        typeSpeed = 50;
    }
    
    if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typeSpeed = 500;
    }
    
    setTimeout(type, typeSpeed);
}

// Start typing only if element exists
if(typingText) type();

// ================================
// MOBILE MENU TOGGLE
// ================================
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        
        // Prevent scrolling when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ================================
// NAVBAR SCROLL EFFECT
// ================================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ================================
// SMOOTH SCROLL
// ================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ================================
// COUNTER ANIMATION
// ================================
const speed = 200;

const animateCounter = (counter) => {
    const target = +counter.getAttribute('data-target');
    const increment = target / speed;
    
    const updateCount = () => {
        const count = +counter.innerText;
        
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(updateCount, 10);
        } else {
            counter.innerText = target + '+';
        }
    };
    
    updateCount();
};

// ================================
// ANIMATE ON SCROLL (AOS)
// ================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            
            // Trigger counter animation
            if (entry.target.querySelector('.counter')) {
                entry.target.querySelectorAll('.counter').forEach(counter => {
                    animateCounter(counter);
                });
            }
            
            // Trigger skill bar animation
            if (entry.target.classList.contains('skill-card')) {
                const progress = entry.target.querySelector('.skill-progress');
                if (progress) {
                    progress.style.width = progress.style.width || progress.getAttribute('style').split('width:')[1];
                    progress.style.animation = 'none'; // reset
                    progress.offsetHeight; /* trigger reflow */
                    progress.style.animation = 'fillBar 2s ease-out forwards';
                }
            }
        }
    });
}, observerOptions);

document.querySelectorAll('[data-aos], .stat-item, .skill-card').forEach(el => {
    observer.observe(el);
});

// ================================
// ACTIVE NAVIGATION HIGHLIGHTING
// ================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ================================
// HOVER EFFECT FOR INTERACTIVE ELEMENTS (Desktop Only)
// ================================
if (!('ontouchstart' in window)) {
    const interactiveElements = document.querySelectorAll('.btn, .social-icon, .skill-card, .project-card, .contact-card');

    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursorRing.style.transform = `translate(${ringX - 30}px, ${ringY - 30}px) scale(1.5)`;
            cursorRing.style.borderColor = '#ff006e';
        });
        
        element.addEventListener('mouseleave', () => {
            cursorRing.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px) scale(1)`;
            cursorRing.style.borderColor = '#00f5ff';
        });
    });
}

// ================================
// LOADING ANIMATION
// ================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ================================
// CONSOLE ART
// ================================
console.log('%cWelcome to my portfolio! 🚀', 'color: #ff006e; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with passion for data science by Dhammdip Lokhande', 'color: #00f5ff; font-size: 14px;');
// Skill Data configuration
const skillData = {
    programming: {
        labels: ['Python', 'C++','HTML/CSS','Javascript'],
        values: [75, 60, 70, 60],
        avg: '68%'
    },
    dataTools: {
        labels: ['Pandas', 'NumPy', 'Matplotlib', 'MySQL'],
        values: [82, 78, 70, 80],
        avg: '77%'
    },
    concepts: {
        labels: ['EDA', 'Statistics', 'Problem Decomposition'],
        values: [90, 65, 85],
        avg: '80%'
    },
    otherTools: {
        labels: ['GitHub', 'PowerBI', 'Jupyter'],
        values: [85, 90, 80],
        avg: '85%'
    }
};

let myChart;

function initDashboard() {
    const ctx = document.getElementById('skillsChart').getContext('2d');
    
    // Initialize Donut Chart
    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: skillData.programming.labels,
            datasets: [{
                data: skillData.programming.values,
                backgroundColor: ['#00ffff', '#0080ff', '#5000ff', '#00ffaa'],
                borderWidth: 0,
                cutout: '82%'
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            animation: { animateScale: true, animateRotate: true }
        }
    });

    // Load initial bars
    renderBars('programming');
}

// Logic to switch between tabs
function switchTab(category, event) {
    // Update Button UI
    document.querySelectorAll('.db-tab').forEach(t => t.classList.remove('active'));
    event.currentTarget.classList.add('active');

    // Update Chart Data
    myChart.data.labels = skillData[category].labels;
    myChart.data.datasets[0].data = skillData[category].values;
    myChart.update();

    // Update Text & Bars
    document.getElementById('chart-percent').innerText = skillData[category].avg;
    renderBars(category);
}

// Logic to render progress bars
function renderBars(category) {
    const container = document.getElementById('bars-display');
    container.innerHTML = ''; 

    skillData[category].labels.forEach((label, i) => {
        const val = skillData[category].values[i];
        container.innerHTML += `
            <div class="db-bar-item">
                <div class="db-bar-info">
                    <span>${label}</span>
                    <span>${val}%</span>
                </div>
                <div class="db-bar-bg">
                    <div class="db-bar-fill" style="width: ${val}%"></div>
                </div>
            </div>`;
    });
}

// Run when the page is ready
document.addEventListener('DOMContentLoaded', initDashboard);
// Update this line in your script.js
const interactiveElements = document.querySelectorAll('.btn, .social-icon, .skill-card, .project-card, .contact-card, .cred-item-alt, .intern-card, .btn-resume-gradient');