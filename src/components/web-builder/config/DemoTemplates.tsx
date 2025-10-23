const DemoTemplates = [
  {
    id: "paksoft-main",
    name: "PaksoftSystems",
    data: {
      pages: [
        {
          name: "Home",
          component: `
            <style>
              /* Responsive adjustments */
              @media (max-width: 900px) {
                header {
                  padding: 1rem 2rem;
                }
                main.hero-gradient {
                  padding: 7rem 1rem 3rem;
                }
                h1 {
                  font-size: 2.5rem !important;
                }
                h2 {
                  font-size: 2rem !important;
                }
                .service-card, .glass-card, .pricing-card {
                  padding: 2rem 1rem !important;
                }
              }
              @media (max-width: 600px) {
                header {
                  flex-direction: column;
                  gap: 1rem;
                  padding: 0.5rem 0.5rem;
                }
                nav {
                  flex-direction: column;
                  gap: 1rem;
                }
                main.hero-gradient {
                  padding: 5rem 0.5rem 2rem;
                }
                h1 {
                  font-size: 1.5rem !important;
                }
                h2 {
                  font-size: 1.2rem !important;
                }
                .service-card, .glass-card, .pricing-card {
                  padding: 1rem 0.5rem !important;
                }
                .icon-wrapper {
                  width: 50px !important;
                  height: 50px !important;
                  font-size: 1.5rem !important;
                }
              }
              @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
              }
              
              @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-20px); }
              }
              
              @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
              }
              
              @keyframes gradient {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
              
              .animated { animation: fadeInUp 0.8s ease-out; }
              .float { animation: float 3s ease-in-out infinite; }
              
              .nav-link {
                position: relative;
                transition: color 0.3s ease;
              }
              
              .nav-link::after {
                content: '';
                position: absolute;
                bottom: -5px;
                left: 0;
                width: 0;
                height: 2px;
                background: #38bdf8;
                transition: width 0.3s ease;
              }
              
              .nav-link:hover::after {
                width: 100%;
              }
              
              .service-card {
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                cursor: pointer;
                position: relative;
                overflow: hidden;
              }
              
              .service-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(56,189,248,0.2), transparent);
                transition: left 0.5s ease;
              }
              
              .service-card:hover::before {
                left: 100%;
              }
              
              .service-card:hover {
                transform: translateY(-10px) scale(1.03);
                box-shadow: 0 20px 40px rgba(56,189,248,0.3);
              }
              
              .cta-button {
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
              }
              
              .cta-button::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: rgba(255,255,255,0.3);
                transform: translate(-50%, -50%);
                transition: width 0.6s ease, height 0.6s ease;
              }
              
              .cta-button:hover::before {
                width: 300px;
                height: 300px;
              }
              
              .cta-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(56,189,248,0.4);
              }
              
              .stat-card {
                transition: all 0.3s ease;
              }
              
              .stat-card:hover {
                transform: scale(1.1);
              }
              
              .form-input {
                transition: all 0.3s ease;
              }
              
              .form-input:focus {
                outline: none;
                box-shadow: 0 0 0 3px rgba(56,189,248,0.3);
                transform: scale(1.02);
              }
              
              .hero-gradient {
                background: linear-gradient(-45deg, #1e293b, #334155, #0f172a, #1e3a8a);
                background-size: 400% 400%;
                animation: gradient 15s ease infinite;
              }
              
              .glass-card {
                background: rgba(51, 65, 85, 0.6);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(56, 189, 248, 0.2);
              }
              
              .icon-wrapper {
                width: 80px;
                height: 80px;
                margin: 0 auto 1.5rem;
                background: linear-gradient(135deg, #38bdf8, #0ea5e9);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2.5rem;
                animation: pulse 2s ease-in-out infinite;
              }
              
              .team-member {
                transition: all 0.3s ease;
                cursor: pointer;
              }
              
              .team-member:hover {
                transform: translateY(-5px);
              }
              
              .pricing-card {
                transition: all 0.4s ease;
                position: relative;
              }
              
              .pricing-card:hover {
                transform: scale(1.05);
                z-index: 10;
              }
              
              .pricing-popular {
                border: 2px solid #38bdf8;
                box-shadow: 0 0 30px rgba(56,189,248,0.5);
              }
            </style>
            
            <section style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; color: #fff; overflow-x: hidden;">
              <!-- Navigation Header -->
              <header style="position: fixed; width: 100%; top: 0; z-index: 1000; display: flex; align-items: center; justify-content: space-between; padding: 1.5rem 4rem; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(10px); box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
                <div style="font-size: 2rem; font-weight: bold; letter-spacing: 1px; color: #38bdf8; display: flex; align-items: center; gap: 0.5rem;">
                  PaksoftSystems
                </div>
                <nav style="display: flex; gap: 2.5rem;">
                  <a href="#services" class="nav-link" style="color: #fff; text-decoration: none; font-size: 1rem; font-weight: 500;">Services</a>
                  <a href="#portfolio" class="nav-link" style="color: #fff; text-decoration: none; font-size: 1rem; font-weight: 500;">Portfolio</a>
                  <a href="#pricing" class="nav-link" style="color: #fff; text-decoration: none; font-size: 1rem; font-weight: 500;">Pricing</a>
                  <a href="#team" class="nav-link" style="color: #fff; text-decoration: none; font-size: 1rem; font-weight: 500;">Team</a>
                  <a href="#contact" class="nav-link" style="color: #fff; text-decoration: none; font-size: 1rem; font-weight: 500;">Contact</a>
                </nav>
              </header>
              
              <!-- Hero Section -->
              <main class="hero-gradient" style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 8rem 2rem 4rem; position: relative; overflow: hidden;">
                <div style="position: absolute; top: 20%; right: 10%; width: 300px; height: 300px; background: radial-gradient(circle, rgba(56,189,248,0.3), transparent); border-radius: 50%; filter: blur(60px);"></div>
                <div style="position: absolute; bottom: 20%; left: 10%; width: 400px; height: 400px; background: radial-gradient(circle, rgba(14,165,233,0.2), transparent); border-radius: 50%; filter: blur(80px);"></div>
                
                <div class="animated" style="animation-delay: 0.2s; z-index: 1;">
                  <h1 style="font-size: 4.5rem; font-weight: 900; margin-bottom: 1.5rem; background: linear-gradient(135deg, #fff, #38bdf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1.2;">
                    Build The Future<br/>With PaksoftSystems
                  </h1>
                  <p style="font-size: 1.4rem; max-width: 700px; margin: 0 auto 3rem; color: #cbd5e1; line-height: 1.8;">
                    We craft cutting-edge digital experiences that drive growth. From web applications to mobile solutions, we turn your vision into powerful, scalable products.
                  </p>
                  <div style="display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap;">
                    <a href="#contact" class="cta-button" style="background: linear-gradient(135deg, #38bdf8, #0ea5e9); color: #fff; padding: 1.2rem 3rem; border-radius: 50px; font-size: 1.2rem; font-weight: 700; text-decoration: none; box-shadow: 0 10px 30px rgba(56,189,248,0.3); position: relative; z-index: 1;">
                      Start Your Project
                    </a>
                    <a href="#portfolio" class="cta-button" style="background: transparent; color: #fff; padding: 1.2rem 3rem; border-radius: 50px; font-size: 1.2rem; font-weight: 700; text-decoration: none; border: 2px solid #38bdf8; position: relative; z-index: 1;">
                      View Our Work
                    </a>
                  </div>
                </div>
                
                <!-- Stats Section -->
                <div style="display: flex; gap: 4rem; margin-top: 5rem; flex-wrap: wrap; justify-content: center; z-index: 1;">
                  <div class="stat-card" style="text-align: center;">
                    <div style="font-size: 3rem; font-weight: 900; color: #38bdf8;">150+</div>
                    <div style="font-size: 1rem; color: #cbd5e1; margin-top: 0.5rem;">Projects Delivered</div>
                  </div>
                  <div class="stat-card" style="text-align: center;">
                    <div style="font-size: 3rem; font-weight: 900; color: #38bdf8;">98%</div>
                    <div style="font-size: 1rem; color: #cbd5e1; margin-top: 0.5rem;">Client Satisfaction</div>
                  </div>
                  <div class="stat-card" style="text-align: center;">
                    <div style="font-size: 3rem; font-weight: 900; color: #38bdf8;">50+</div>
                    <div style="font-size: 1rem; color: #cbd5e1; margin-top: 0.5rem;">Team Members</div>
                  </div>
                  <div class="stat-card" style="text-align: center;">
                    <div style="font-size: 3rem; font-weight: 900; color: #38bdf8;">24/7</div>
                    <div style="font-size: 1rem; color: #cbd5e1; margin-top: 0.5rem;">Support Available</div>
                  </div>
                </div>
              </main>
              
              <!-- Services Section -->
              <section id="services" style="padding: 6rem 4rem; background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);">
                <div style="text-align: center; margin-bottom: 4rem;">
                  <div style="color: #38bdf8; font-size: 1rem; font-weight: 600; letter-spacing: 2px; margin-bottom: 1rem;">WHAT WE OFFER</div>
                  <h2 style="font-size: 3.5rem; font-weight: 800; margin-bottom: 1.5rem;">Our Services</h2>
                  <p style="font-size: 1.2rem; color: #94a3b8; max-width: 600px; margin: 0 auto;">Comprehensive solutions tailored to your business needs</p>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2.5rem; max-width: 1400px; margin: 0 auto;">
                  <div class="service-card glass-card" style="border-radius: 20px; padding: 3rem 2rem; text-align: center;">
                    <div class="icon-wrapper">💻</div>
                    <h3 style="color: #38bdf8; font-size: 1.8rem; margin-bottom: 1rem; font-weight: 700;">Web Development</h3>
                    <p style="color: #cbd5e1; font-size: 1.1rem; line-height: 1.7;">Custom web applications built with cutting-edge technologies. Responsive, fast, and scalable solutions that grow with your business.</p>
                    <div style="margin-top: 2rem; display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center;">
                      <span style="background: rgba(56,189,248,0.2); padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.9rem; color: #38bdf8;">React</span>
                      <span style="background: rgba(56,189,248,0.2); padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.9rem; color: #38bdf8;">Node.js</span>
                      <span style="background: rgba(56,189,248,0.2); padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.9rem; color: #38bdf8;">Next.js</span>
                    </div>
                  </div>
                  
                  <div class="service-card glass-card" style="border-radius: 20px; padding: 3rem 2rem; text-align: center;">
                    <div class="icon-wrapper">📱</div>
                    <h3 style="color: #38bdf8; font-size: 1.8rem; margin-bottom: 1rem; font-weight: 700;">Mobile Applications</h3>
                    <p style="color: #cbd5e1; font-size: 1.1rem; line-height: 1.7;">Native and cross-platform mobile apps that deliver exceptional user experiences on iOS and Android devices.</p>
                    <div style="margin-top: 2rem; display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center;">
                      <span style="background: rgba(56,189,248,0.2); padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.9rem; color: #38bdf8;">React</span>
                      <span style="background: rgba(56,189,248,0.2); padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.9rem; color: #38bdf8;">Flutter</span>
                      <span style="background: rgba(56,189,248,0.2); padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.9rem; color: #38bdf8;">Swift</span>
                    </div>
                  </div>
                  
                  <div class="service-card glass-card" style="border-radius: 20px; padding: 3rem 2rem; text-align: center;">
                    <div class="icon-wrapper">☁️</div>
                    <h3 style="color: #38bdf8; font-size: 1.8rem; margin-bottom: 1rem; font-weight: 700;">Cloud Solutions</h3>
                    <p style="color: #cbd5e1; font-size: 1.1rem; line-height: 1.7;">Enterprise-grade cloud infrastructure, DevOps automation, and seamless deployment pipelines for optimal performance.</p>
                    <div style="margin-top: 2rem; display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center;">
                      <span style="background: rgba(56,189,248,0.2); padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.9rem; color: #38bdf8;">AWS</span>
                      <span style="background: rgba(56,189,248,0.2); padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.9rem; color: #38bdf8;">Azure</span>
                      <span style="background: rgba(56,189,248,0.2); padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.9rem; color: #38bdf8;">Docker</span>
                    </div>
                  </div>
                  
                  <div class="service-card glass-card" style="border-radius: 20px; padding: 3rem 2rem; text-align: center;">
                    <div class="icon-wrapper">🎨</div>
                    <h3 style="color: #38bdf8; font-size: 1.8rem; margin-bottom: 1rem; font-weight: 700;">UI/UX Design</h3>
                    <p style="color: #cbd5e1; font-size: 1.1rem; line-height: 1.7;">Beautiful, intuitive interfaces that users love. We blend aesthetics with functionality for memorable experiences.</p>
                    <div style="margin-top: 2rem; display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center;">
                      <span style="background: rgba(56,189,248,0.2); padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.9rem; color: #38bdf8;">Figma</span>
                      <span style="background: rgba(56,189,248,0.2); padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.9rem; color: #38bdf8;">Adobe XD</span>
                      <span style="background: rgba(56,189,248,0.2); padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.9rem; color: #38bdf8;">Sketch</span>
                    </div>
                  </div>
                  
                  <div class="service-card glass-card" style="border-radius: 20px; padding: 3rem 2rem; text-align: center;">
                    <div class="icon-wrapper">🤖</div>
                    <h3 style="color: #38bdf8; font-size: 1.8rem; margin-bottom: 1rem; font-weight: 700;">AI & Machine Learning</h3>
                    <p style="color: #cbd5e1; font-size: 1.1rem; line-height: 1.7;">Intelligent solutions powered by AI and ML to automate processes and unlock valuable insights from your data.</p>
                    <div style="margin-top: 2rem; display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center;">
                      <span style="background: rgba(56,189,248,0.2); padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.9rem; color: #38bdf8;">TensorFlow</span>
                      <span style="background: rgba(56,189,248,0.2); padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.9rem; color: #38bdf8;">PyTorch</span>
                      <span style="background: rgba(56,189,248,0.2); padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.9rem; color: #38bdf8;">OpenAI</span>
                    </div>
                  </div>
                  
                  <div class="service-card glass-card" style="border-radius: 20px; padding: 3rem 2rem; text-align: center;">
                    <div class="icon-wrapper">🔒</div>
                    <h3 style="color: #38bdf8; font-size: 1.8rem; margin-bottom: 1rem; font-weight: 700;">Cybersecurity</h3>
                    <p style="color: #cbd5e1; font-size: 1.1rem; line-height: 1.7;">Protect your digital assets with comprehensive security audits, penetration testing, and compliance solutions.</p>
                    <div style="margin-top: 2rem; display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center;">
                      <span style="background: rgba(56,189,248,0.2); padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.9rem; color: #38bdf8;">Security Audit</span>
                      <span style="background: rgba(56,189,248,0.2); padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.9rem; color: #38bdf8;">Pen Testing</span>
                      <span style="background: rgba(56,189,248,0.2); padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.9rem; color: #38bdf8;">GDPR</span>
                    </div>
                  </div>
                </div>
              </section>
              
              <!-- Portfolio Section -->
              <section id="portfolio" style="padding: 6rem 4rem; background: #1e293b;">
                <div style="text-align: center; margin-bottom: 4rem;">
                  <div style="color: #38bdf8; font-size: 1rem; font-weight: 600; letter-spacing: 2px; margin-bottom: 1rem;">OUR WORK</div>
                  <h2 style="font-size: 3.5rem; font-weight: 800; margin-bottom: 1.5rem;">Featured Projects</h2>
                  <p style="font-size: 1.2rem; color: #94a3b8; max-width: 600px; margin: 0 auto;">Showcasing excellence in digital innovation</p>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem; max-width: 1400px; margin: 0 auto;">
                  <div class="service-card" style="background: linear-gradient(135deg, #334155 0%, #1e293b 100%); border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
                    <div style="height: 250px; background: linear-gradient(135deg, #38bdf8, #0ea5e9); display: flex; align-items: center; justify-content: center; font-size: 4rem;">🏦</div>
                    <div style="padding: 2rem;">
                      <h3 style="color: #38bdf8; font-size: 1.6rem; margin-bottom: 0.8rem; font-weight: 700;">FinTech Dashboard</h3>
                      <p style="color: #cbd5e1; margin-bottom: 1.5rem; line-height: 1.6;">Real-time financial analytics platform with advanced data visualization and predictive insights.</p>
                      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <span style="background: rgba(56,189,248,0.2); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.85rem; color: #38bdf8;">React</span>
                        <span style="background: rgba(56,189,248,0.2); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.85rem; color: #38bdf8;">D3.js</span>
                        <span style="background: rgba(56,189,248,0.2); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.85rem; color: #38bdf8;">Node.js</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="service-card" style="background: linear-gradient(135deg, #334155 0%, #1e293b 100%); border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
                    <div style="height: 250px; background: linear-gradient(135deg, #8b5cf6, #6366f1); display: flex; align-items: center; justify-content: center; font-size: 4rem;">🛍️</div>
                    <div style="padding: 2rem;">
                      <h3 style="color: #38bdf8; font-size: 1.6rem; margin-bottom: 0.8rem; font-weight: 700;">E-Commerce Platform</h3>
                      <p style="color: #cbd5e1; margin-bottom: 1.5rem; line-height: 1.6;">Scalable marketplace with AI-powered recommendations and seamless checkout experience.</p>
                      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <span style="background: rgba(56,189,248,0.2); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.85rem; color: #38bdf8;">Next.js</span>
                        <span style="background: rgba(56,189,248,0.2); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.85rem; color: #38bdf8;">Stripe</span>
                        <span style="background: rgba(56,189,248,0.2); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.85rem; color: #38bdf8;">MongoDB</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="service-card" style="background: linear-gradient(135deg, #334155 0%, #1e293b 100%); border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
                    <div style="height: 250px; background: linear-gradient(135deg, #10b981, #059669); display: flex; align-items: center; justify-content: center; font-size: 4rem;">🏥</div>
                    <div style="padding: 2rem;">
                      <h3 style="color: #38bdf8; font-size: 1.6rem; margin-bottom: 0.8rem; font-weight: 700;">HealthTech App</h3>
                      <p style="color: #cbd5e1; margin-bottom: 1.5rem; line-height: 1.6;">HIPAA-compliant telemedicine platform connecting patients with healthcare providers globally.</p>
                      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <span style="background: rgba(56,189,248,0.2); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.85rem; color: #38bdf8;">React</span>
                        <span style="background: rgba(56,189,248,0.2); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.85rem; color: #38bdf8;">WebRTC</span>
                        <span style="background: rgba(56,189,248,0.2); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.85rem; color: #38bdf8;">AWS</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              
              <!-- Pricing Section -->
              <section id="pricing" style="padding: 6rem 4rem; background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);">
                <div style="text-align: center; margin-bottom: 4rem;">
                  <div style="color: #38bdf8; font-size: 1rem; font-weight: 600; letter-spacing: 2px; margin-bottom: 1rem;">PRICING</div>
                  <h2 style="font-size: 3.5rem; font-weight: 800; margin-bottom: 1.5rem;">Choose Your Plan</h2>
                  <p style="font-size: 1.2rem; color: #94a3b8; max-width: 600px; margin: 0 auto;">Flexible pricing for projects of all sizes</p>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; max-width: 1200px; margin: 0 auto;">
                  <div class="pricing-card glass-card" style="border-radius: 20px; padding: 3rem 2rem; text-align: center;">
                    <div style="font-size: 1.2rem; color: #94a3b8; font-weight: 600; margin-bottom: 1rem;">STARTER</div>
                    <div style="font-size: 3.5rem; font-weight: 900; color: #38bdf8; margin-bottom: 0.5rem;">$2,999</div>
                    <div style="color: #94a3b8; margin-bottom: 2rem;">Perfect for small projects</div>
                    <ul style="list-style: none; text-align: left; margin-bottom: 2rem;">
                      <li style="padding: 0.8rem 0; border-bottom: 1px solid rgba(56,189,248,0.2); color: #cbd5e1;">✓ Up to 5 pages</li>
                      <li style="padding: 0.8rem 0; border-bottom: 1px solid rgba(56,189,248,0.2); color: #cbd5e1;">✓ Responsive design</li>
                      <li style="padding: 0.8rem 0; border-bottom: 1px solid rgba(56,189,248,0.2); color: #cbd5e1;">✓ Basic SEO</li>
                      <li style="padding: 0.8rem 0; border-bottom: 1px solid rgba(56,189,248,0.2); color: #cbd5e1;">✓ 30 days support</li>
                      <li style="padding: 0.8rem 0; color: #64748b;">✗ Custom integrations</li>
                    </ul>
                    <a href="#contact" class="cta-button" style="display: block; background: transparent; color: #38bdf8; padding: 1rem 2rem; border-radius: 30px; font-weight: 600; text-decoration: none; border: 2px solid #38bdf8;">Choose Plan</a>
                  </div>
                  
                  <div class="pricing-card pricing-popular glass-card" style="border-radius: 20px; padding: 3rem 2rem; text-align: center; transform: scale(1.05);">
                    <div style="background: linear-gradient(135deg, #38bdf8, #0ea5e9); color: #fff; padding: 0.5rem 1rem; border-radius: 20px; display: inline-block; margin-bottom: 1rem; font-weight: 600;">MOST POPULAR</div>
                    <div style="font-size: 1.2rem; color: #94a3b8; font-weight: 600; margin-bottom: 1rem;">PROFESSIONAL</div>
                    <div style="font-size: 3.5rem; font-weight: 900; color: #38bdf8; margin-bottom: 0.5rem;">$7,999</div>
                    <div style="color: #94a3b8; margin-bottom: 2rem;">For growing businesses</div>
                    <ul style="list-style: none; text-align: left; margin-bottom: 2rem;">
                      <li style="padding: 0.8rem 0; border-bottom: 1px solid rgba(56,189,248,0.2); color: #cbd5e1;">✓ Up to 15 pages</li>
                      <li style="padding: 0.8rem 0; border-bottom: 1px solid rgba(56,189,248,0.2); color: #cbd5e1;">✓ Advanced animations</li>
                      <li style="padding: 0.8rem 0; border-bottom: 1px solid rgba(56,189,248,0.2); color: #cbd5e1;">✓ Premium SEO</li>
                      <li style="padding: 0.8rem 0; border-bottom: 1px solid rgba(56,189,248,0.2); color: #cbd5e1;">✓ 90 days support</li>
                      <li style="padding: 0.8rem 0; color: #cbd5e1;">✓ API integrations</li>
                    </ul>
                    <a href="#contact" class="cta-button" style="display: block; background: linear-gradient(135deg, #38bdf8, #0ea5e9); color: #fff; padding: 1rem 2rem; border-radius: 30px; font-weight: 600; text-decoration: none; border: none;">Choose Plan</a>
                  </div>
                  
                  <div class="pricing-card glass-card" style="border-radius: 20px; padding: 3rem 2rem; text-align: center;">
                    <div style="font-size: 1.2rem; color: #94a3b8; font-weight: 600; margin-bottom: 1rem;">ENTERPRISE</div>
                    <div style="font-size: 3.5rem; font-weight: 900; color: #38bdf8; margin-bottom: 0.5rem;">Custom</div>
                    <div style="color: #94a3b8; margin-bottom: 2rem;">Tailored solutions</div>
                    <ul style="list-style: none; text-align: left; margin-bottom: 2rem;">
                      <li style="padding: 0.8rem 0; border-bottom: 1px solid rgba(56,189,248,0.2); color: #cbd5e1;">✓ Unlimited pages</li>
                      <li style="padding: 0.8rem 0; border-bottom: 1px solid rgba(56,189,248,0.2); color: #cbd5e1;">✓ Custom features</li>
                      <li style="padding: 0.8rem 0; border-bottom: 1px solid rgba(56,189,248,0.2); color: #cbd5e1;">✓ Dedicated team</li>
                      <li style="padding: 0.8rem 0; border-bottom: 1px solid rgba(56,189,248,0.2); color: #cbd5e1;">✓ Priority support</li>
                      <li style="padding: 0.8rem 0; color: #cbd5e1;">✓ Full maintenance</li>
                    </ul>
                    <a href="#contact" class="cta-button" style="display: block; background: transparent; color: #38bdf8; padding: 1rem 2rem; border-radius: 30px; font-weight: 600; text-decoration: none; border: 2px solid #38bdf8;">Contact Us</a>
                  </div>
                </div>
              </section>
              
              <!-- Team Section -->
              <section id="team" style="padding: 6rem 4rem; background: #1e293b;">
                <div style="text-align: center; margin-bottom: 4rem;">
                  <div style="color: #38bdf8; font-size: 1rem; font-weight: 600; letter-spacing: 2px; margin-bottom: 1rem;">OUR TEAM</div>
                  <h2 style="font-size: 3.5rem; font-weight: 800; margin-bottom: 1.5rem;">Meet The Experts</h2>
                  <p style="font-size: 1.2rem; color: #94a3b8; max-width: 600px; margin: 0 auto;">Talented professionals driving innovation</p>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2.5rem; max-width: 1400px; margin: 0 auto;">
                  <div class="team-member glass-card" style="border-radius: 20px; padding: 2rem; text-align: center;">
                    <div style="width: 120px; height: 120px; margin: 0 auto 1.5rem; background: linear-gradient(135deg, #38bdf8, #0ea5e9); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 3rem;">👨‍💼</div>
                    <h3 style="color: #fff; font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 700;">Demo</h3>
                    <div style="color: #38bdf8; margin-bottom: 1rem; font-weight: 600;">CEO & Founder</div>
                    <p style="color: #94a3b8; line-height: 1.6;">Visionary leader with 15+ years in tech innovation and business strategy.</p>
                  </div>
                  
                  <div class="team-member glass-card" style="border-radius: 20px; padding: 2rem; text-align: center;">
                    <div style="width: 120px; height: 120px; margin: 0 auto 1.5rem; background: linear-gradient(135deg, #8b5cf6, #6366f1); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 3rem;">👩‍💻</div>
                    <h3 style="color: #fff; font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 700;">Demo</h3>
                    <div style="color: #38bdf8; margin-bottom: 1rem; font-weight: 600;">Lead Developer</div>
                    <p style="color: #94a3b8; line-height: 1.6;">Full-stack expert specializing in scalable web architectures.</p>
                  </div>
                  
                  <div class="team-member glass-card" style="border-radius: 20px; padding: 2rem; text-align: center;">
                    <div style="width: 120px; height: 120px; margin: 0 auto 1.5rem; background: linear-gradient(135deg, #10b981, #059669); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 3rem;">🎨</div>
                    <h3 style="color: #fff; font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 700;">Demo</h3>
                    <div style="color: #38bdf8; margin-bottom: 1rem; font-weight: 600;">Design Director</div>
                    <p style="color: #94a3b8; line-height: 1.6;">Award-winning designer creating stunning user experiences.</p>
                  </div>
                  
                  <div class="team-member glass-card" style="border-radius: 20px; padding: 2rem; text-align: center;">
                    <div style="width: 120px; height: 120px; margin: 0 auto 1.5rem; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 3rem;">🚀</div>
                    <h3 style="color: #fff; font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 700;">Demo</h3>
                    <div style="color: #38bdf8; margin-bottom: 1rem; font-weight: 600;">Project Manager</div>
                    <p style="color: #94a3b8; line-height: 1.6;">Expert in agile methodologies and seamless project delivery.</p>
                  </div>
                </div>
              </section>
              
              <!-- Contact Section -->
              <section id="contact" style="padding: 6rem 4rem; background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);">
                <div style="text-align: center; margin-bottom: 4rem;">
                  <div style="color: #38bdf8; font-size: 1rem; font-weight: 600; letter-spacing: 2px; margin-bottom: 1rem;">GET IN TOUCH</div>
                  <h2 style="font-size: 3.5rem; font-weight: 800; margin-bottom: 1.5rem;">Start Your Project Today</h2>
                  <p style="font-size: 1.2rem; color: #94a3b8; max-width: 600px; margin: 0 auto;">Let's transform your ideas into reality. We're here to help!</p>
                </div>
                
                <div style="margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 3rem;">
                  <div>
                    <div class="glass-card" style="padding: 2rem; border-radius: 20px; margin-bottom: 2rem;">
                      <div style="font-size: 2rem; margin-bottom: 1rem;">📧</div>
                      <h3 style="color: #38bdf8; font-size: 1.3rem; margin-bottom: 0.5rem; font-weight: 700;">Email Us</h3>
                      <p style="color: #cbd5e1;">info@paksoftsystems.com</p>
                    </div>
                    
                    <div class="glass-card" style="padding: 2rem; border-radius: 20px; margin-bottom: 2rem;">
                      <div style="font-size: 2rem; margin-bottom: 1rem;">📞</div>
                      <h3 style="color: #38bdf8; font-size: 1.3rem; margin-bottom: 0.5rem; font-weight: 700;">Call Us</h3>
                      <p style="color: #cbd5e1;">+92 300 1234567</p>
                    </div>
                    
                    <div class="glass-card" style="padding: 2rem; border-radius: 20px;">
                      <div style="font-size: 2rem; margin-bottom: 1rem;">📍</div>
                      <h3 style="color: #38bdf8; font-size: 1.3rem; margin-bottom: 0.5rem; font-weight: 700;">Visit Us</h3>
                      <p style="color: #cbd5e1;">Karachi, Pakistan</p>
                    </div>
                  </div>
                  
                  <div class="glass-card" style="padding: 3rem; border-radius: 20px;">
                    <form onsubmit="event.preventDefault(); alert('Thank you for your message! We will get back to you soon.');" style="display: flex; flex-direction: column; gap: 1.5rem;">
                      <input type="text" placeholder="Your Name" required class="form-input" style="padding: 1.2rem; border-radius: 12px; border: 2px solid rgba(56,189,248,0.3); font-size: 1rem; background: rgba(30,41,59,0.6); color: #fff;" />
                      <input type="email" placeholder="Your Email" required class="form-input" style="padding: 1.2rem; border-radius: 12px; border: 2px solid rgba(56,189,248,0.3); font-size: 1rem; background: rgba(30,41,59,0.6); color: #fff;" />
                      <input type="text" placeholder="Subject" required class="form-input" style="padding: 1.2rem; border-radius: 12px; border: 2px solid rgba(56,189,248,0.3); font-size: 1rem; background: rgba(30,41,59,0.6); color: #fff;" />
                      <textarea placeholder="Your Message" rows="5" required class="form-input" style="padding: 1.2rem; border-radius: 12px; border: 2px solid rgba(56,189,248,0.3); font-size: 1rem; background: rgba(30,41,59,0.6); color: #fff; resize: vertical;"></textarea>
                      <button type="submit" class="cta-button" style="background: linear-gradient(135deg, #38bdf8, #0ea5e9); color: #fff; padding: 1.2rem 2.5rem; border-radius: 30px; font-size: 1.1rem; font-weight: 700; border: none; cursor: pointer;">Send Message</button>
                    </form>
                  </div>
                </div>
              </section>
              
              <!-- Testimonials Section -->
              <section style="padding: 6rem 4rem; background: #1e293b;">
                <div style="text-align: center; margin-bottom: 4rem;">
                  <div style="color: #38bdf8; font-size: 1rem; font-weight: 600; letter-spacing: 2px; margin-bottom: 1rem;">TESTIMONIALS</div>
                  <h2 style="font-size: 3.5rem; font-weight: 800; margin-bottom: 1.5rem;">What Clients Say</h2>
                  <p style="font-size: 1.2rem; color: #94a3b8; max-width: 600px; margin: 0 auto;">Real feedback from satisfied clients</p>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; max-width: 1400px; margin: 0 auto;">
                  <div class="service-card glass-card" style="border-radius: 20px; padding: 2.5rem;">
                    <div style="color: #38bdf8; font-size: 1rem; margin-bottom: 1rem;">⭐⭐⭐⭐⭐</div>
                    <p style="color: #cbd5e1; font-size: 1.1rem; line-height: 1.7; margin-bottom: 1.5rem;">"PaksoftSystems delivered beyond our expectations. Their attention to detail and technical expertise transformed our digital presence completely."</p>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                      <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #38bdf8, #0ea5e9); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">👤</div>
                      <div>
                        <div style="color: #fff; font-weight: 700;">John Smith</div>
                        <div style="color: #94a3b8; font-size: 0.9rem;">CEO, TechCorp</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="service-card glass-card" style="border-radius: 20px; padding: 2.5rem;">
                    <div style="color: #38bdf8; font-size: 1rem; margin-bottom: 1rem;">⭐⭐⭐⭐⭐</div>
                    <p style="color: #cbd5e1; font-size: 1.1rem; line-height: 1.7; margin-bottom: 1.5rem;">"Professional, responsive, and innovative. They turned our complex requirements into an elegant solution. Highly recommend their services!"</p>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                      <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #8b5cf6, #6366f1); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">👤</div>
                      <div>
                        <div style="color: #fff; font-weight: 700;">Maria Garcia</div>
                        <div style="color: #94a3b8; font-size: 0.9rem;">Founder, ShopHub</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="service-card glass-card" style="border-radius: 20px; padding: 2.5rem;">
                    <div style="color: #38bdf8; font-size: 1em; margin-bottom: 1rem;">⭐⭐⭐⭐⭐</div>
                    <p style="color: #cbd5e1; font-size: 1.1rem; line-height: 1.7; margin-bottom: 1.5rem;">"Outstanding work! The team was collaborative, met all deadlines, and the final product exceeded our vision. True professionals."</p>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                      <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">👤</div>
                      <div>
                        <div style="color: #fff; font-weight: 700;">David Chen</div>
                        <div style="color: #94a3b8; font-size: 0.9rem;">CTO, FinanceFlow</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              
              <!-- Footer -->
              <footer style="padding: 4rem 4rem 2rem; background: #0f172a; border-top: 1px solid rgba(56,189,248,0.2);">
                <div style="max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 3rem; margin-bottom: 3rem;">
                  <div>
                    <div style="font-size: 2rem; font-weight: bold; color: #38bdf8; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                      PaksoftSystems
                    </div>
                    <p style="color: #94a3b8; line-height: 1.7; margin-bottom: 1.5rem;">Transforming businesses through innovative technology solutions. Your success is our mission.</p>
                    <div style="display: flex; gap: 1rem;">
                      <a href="#" style="width: 40px; height: 40px; background: rgba(56,189,248,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #38bdf8; text-decoration: none; transition: all 0.3s ease;" onmouseover="this.style.background='#38bdf8'; this.style.color='#fff';" onmouseout="this.style.background='rgba(56,189,248,0.2)'; this.style.color='#38bdf8';">📘</a>
                      <a href="#" style="width: 40px; height: 40px; background: rgba(56,189,248,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #38bdf8; text-decoration: none; transition: all 0.3s ease;" onmouseover="this.style.background='#38bdf8'; this.style.color='#fff';" onmouseout="this.style.background='rgba(56,189,248,0.2)'; this.style.color='#38bdf8';">🐦</a>
                      <a href="#" style="width: 40px; height: 40px; background: rgba(56,189,248,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #38bdf8; text-decoration: none; transition: all 0.3s ease;" onmouseover="this.style.background='#38bdf8'; this.style.color='#fff';" onmouseout="this.style.background='rgba(56,189,248,0.2)'; this.style.color='#38bdf8';">💼</a>
                      <a href="#" style="width: 40px; height: 40px; background: rgba(56,189,248,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #38bdf8; text-decoration: none; transition: all 0.3s ease;" onmouseover="this.style.background='#38bdf8'; this.style.color='#fff';" onmouseout="this.style.background='rgba(56,189,248,0.2)'; this.style.color='#38bdf8';">📷</a>
                    </div>
                  </div>
                  
                  <div>
                    <h3 style="color: #fff; font-size: 1.3rem; margin-bottom: 1.5rem; font-weight: 700;">Services</h3>
                    <ul style="list-style: none;">
                      <li style="margin-bottom: 0.8rem;"><a href="#services" style="color: #94a3b8; text-decoration: none; transition: color 0.3s ease;" onmouseover="this.style.color='#38bdf8';" onmouseout="this.style.color='#94a3b8';">Web Development</a></li>
                      <li style="margin-bottom: 0.8rem;"><a href="#services" style="color: #94a3b8; text-decoration: none; transition: color 0.3s ease;" onmouseover="this.style.color='#38bdf8';" onmouseout="this.style.color='#94a3b8';">Mobile Apps</a></li>
                      <li style="margin-bottom: 0.8rem;"><a href="#services" style="color: #94a3b8; text-decoration: none; transition: color 0.3s ease;" onmouseover="this.style.color='#38bdf8';" onmouseout="this.style.color='#94a3b8';">Cloud Solutions</a></li>
                      <li style="margin-bottom: 0.8rem;"><a href="#services" style="color: #94a3b8; text-decoration: none; transition: color 0.3s ease;" onmouseover="this.style.color='#38bdf8';" onmouseout="this.style.color='#94a3b8';">UI/UX Design</a></li>
                      <li style="margin-bottom: 0.8rem;"><a href="#services" style="color: #94a3b8; text-decoration: none; transition: color 0.3s ease;" onmouseover="this.style.color='#38bdf8';" onmouseout="this.style.color='#94a3b8';">AI & ML</a></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 style="color: #fff; font-size: 1.3rem; margin-bottom: 1.5rem; font-weight: 700;">Company</h3>
                    <ul style="list-style: none;">
                      <li style="margin-bottom: 0.8rem;"><a href="#team" style="color: #94a3b8; text-decoration: none; transition: color 0.3s ease;" onmouseover="this.style.color='#38bdf8';" onmouseout="this.style.color='#94a3b8';">About Us</a></li>
                      <li style="margin-bottom: 0.8rem;"><a href="#portfolio" style="color: #94a3b8; text-decoration: none; transition: color 0.3s ease;" onmouseover="this.style.color='#38bdf8';" onmouseout="this.style.color='#94a3b8';">Portfolio</a></li>
                      <li style="margin-bottom: 0.8rem;"><a href="#team" style="color: #94a3b8; text-decoration: none; transition: color 0.3s ease;" onmouseover="this.style.color='#38bdf8';" onmouseout="this.style.color='#94a3b8';">Careers</a></li>
                      <li style="margin-bottom: 0.8rem;"><a href="#" style="color: #94a3b8; text-decoration: none; transition: color 0.3s ease;" onmouseover="this.style.color='#38bdf8';" onmouseout="this.style.color='#94a3b8';">Blog</a></li>
                      <li style="margin-bottom: 0.8rem;"><a href="#contact" style="color: #94a3b8; text-decoration: none; transition: color 0.3s ease;" onmouseover="this.style.color='#38bdf8';" onmouseout="this.style.color='#94a3b8';">Contact</a></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 style="color: #fff; font-size: 1.3rem; margin-bottom: 1.5rem; font-weight: 700;">Newsletter</h3>
                    <p style="color: #94a3b8; margin-bottom: 1rem; line-height: 1.6;">Subscribe to get the latest news and updates.</p>
                    <form onsubmit="event.preventDefault(); alert('Thank you for subscribing!');" style="display: flex; gap: 0.5rem;">
                      <input type="email" placeholder="Your email" required style="flex: 1; padding: 0.8rem; border-radius: 8px; border: 2px solid rgba(56,189,248,0.3); background: rgba(30,41,59,0.6); color: #fff; font-size: 0.95rem;" />
                      <button type="submit" style="background: linear-gradient(135deg, #38bdf8, #0ea5e9); color: #fff; padding: 0.8rem 1.5rem; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; transition: transform 0.3s ease;" onmouseover="this.style.transform='scale(1.05)';" onmouseout="this.style.transform='scale(1)';">→</button>
                    </form>
                  </div>
                </div>
                
                <div style="border-top: 1px solid rgba(56,189,248,0.2); padding-top: 2rem; text-align: center; color: #94a3b8; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                  <div>&copy; 2025 PaksoftSystems. All rights reserved.</div>
                  <div style="display: flex; gap: 2rem; flex-wrap: wrap;">
                    <a href="#" style="color: #94a3b8; text-decoration: none; transition: color 0.3s ease;" onmouseover="this.style.color='#38bdf8';" onmouseout="this.style.color='#94a3b8';">Privacy Policy</a>
                    <a href="#" style="color: #94a3b8; text-decoration: none; transition: color 0.3s ease;" onmouseover="this.style.color='#38bdf8';" onmouseout="this.style.color='#94a3b8';">Terms of Service</a>
                    <a href="#" style="color: #94a3b8; text-decoration: none; transition: color 0.3s ease;" onmouseover="this.style.color='#38bdf8';" onmouseout="this.style.color='#94a3b8';">Cookie Policy</a>
                  </div>
                </div>
              </footer>
              
              <script>
                // Smooth scroll for navigation links
                document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                  anchor.addEventListener('click', function (e) {
                    const href = this.getAttribute('href');
                    if (href !== '#') {
                      e.preventDefault();
                      const target = document.querySelector(href);
                      if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }
                  });
                });
                
                // Animate elements on scroll
                const observerOptions = {
                  threshold: 0.1,
                  rootMargin: '0px 0px -100px 0px'
                };
                
                const observer = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting) {
                      entry.target.style.opacity = '1';
                      entry.target.style.transform = 'translateY(0)';
                    }
                  });
                }, observerOptions);
                
                // Observe all service cards, pricing cards, and team members
                document.querySelectorAll('.service-card, .pricing-card, .team-member').forEach(el => {
                  el.style.opacity = '0';
                  el.style.transform = 'translateY(30px)';
                  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                  observer.observe(el);
                });
                
                // Header scroll effect
                let lastScroll = 0;
                const header = document.querySelector('header');
                
                window.addEventListener('scroll', () => {
                  const currentScroll = window.pageYOffset;
                  
                  if (currentScroll > 100) {
                    header.style.padding = '1rem 4rem';
                    header.style.boxShadow = '0 4px 30px rgba(0,0,0,0.3)';
                  } else {
                    header.style.padding = '1.5rem 4rem';
                    header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
                  }
                  
                  lastScroll = currentScroll;
                });
                
                // Parallax effect for hero section
                window.addEventListener('scroll', () => {
                  const scrolled = window.pageYOffset;
                  const parallaxElements = document.querySelectorAll('.hero-gradient > div');
                  parallaxElements.forEach((el, index) => {
                    if (el.style.position === 'absolute') {
                      const speed = 0.5 + (index * 0.1);
                      el.style.transform = \`translateY(\${scrolled * speed}px)\`;
                    }
                  });
                });
                
                // Counter animation for stats
                const animateCounter = (element, target) => {
                  const duration = 2000;
                  const start = 0;
                  const increment = target / (duration / 16);
                  let current = start;
                  
                  const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                      element.textContent = target + (element.textContent.includes('%') ? '%' : '+');
                      clearInterval(timer);
                    } else {
                      element.textContent = Math.floor(current) + (element.textContent.includes('%') ? '%' : '+');
                    }
                  }, 16);
                };
                
                // Trigger counter animation when stats are visible
                const statsObserver = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting && !entry.target.dataset.animated) {
                      entry.target.dataset.animated = 'true';
                      const text = entry.target.textContent;
                      const num = parseInt(text.replace(/\D/g, ''));
                      animateCounter(entry.target, num);
                    }
                  });
                }, { threshold: 0.5 });
                
                document.querySelectorAll('.stat-card > div:first-child').forEach(stat => {
                  statsObserver.observe(stat);
                });
                
                // Form validation and enhancement
                document.querySelectorAll('form').forEach(form => {
                  form.addEventListener('submit', function(e) {
                    const button = this.querySelector('button[type="submit"]');
                    const originalText = button.textContent;
                    button.textContent = 'Sending...';
                    button.style.opacity = '0.7';
                    
                    setTimeout(() => {
                      button.textContent = originalText;
                      button.style.opacity = '1';
                    }, 1500);
                  });
                });
                
                // Add floating animation to icons
                document.querySelectorAll('.icon-wrapper').forEach((icon, index) => {
                  icon.style.animationDelay = \`\${index * 0.2}s\`;
                });
                
                // Cursor trail effect (optional enhancement)
                document.addEventListener('mousemove', (e) => {
                  if (window.innerWidth > 768) {
                    const trail = document.createElement('div');
                    trail.style.cssText = \`
                      position: fixed;
                      width: 5px;
                      height: 5px;
                      background: rgba(56, 189, 248, 0.5);
                      border-radius: 50%;
                      pointer-events: none;
                      left: \${e.clientX}px;
                      top: \${e.clientY}px;
                      z-index: 9999;
                      animation: fadeOut 1s ease-out forwards;
                    \`;
                    document.body.appendChild(trail);
                    setTimeout(() => trail.remove(), 1000);
                  }
                });
                
                // Add fadeOut animation
                const style = document.createElement('style');
                style.textContent = \`
                  @keyframes fadeOut {
                    to {
                      opacity: 0;
                      transform: scale(2);
                    }
                  }
                \`;
                document.head.appendChild(style);
                
              </script>
            </section>
          `,
        },
      ],
    },
  },
];

export default DemoTemplates;
