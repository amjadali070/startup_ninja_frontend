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
  {
    id: "luxury-fashion",
    name: "LuxuryFashion",
    data: {
      pages: [
        {
          name: "Home",
          component: `
            <style>
              /* Responsive adjustments */
              @media (max-width: 900px) {
                .hero-section {
                  padding: 6rem 2rem 3rem !important;
                }
                .hero-title {
                  font-size: 3rem !important;
                }
                .hero-subtitle {
                  font-size: 1.2rem !important;
                }
                .collection-grid {
                  grid-template-columns: 1fr !important;
                  gap: 2rem !important;
                }
                .feature-grid {
                  grid-template-columns: 1fr !important;
                }
              }
              @media (max-width: 600px) {
                .hero-section {
                  padding: 4rem 1rem 2rem !important;
                }
                .hero-title {
                  font-size: 2rem !important;
                }
                .hero-subtitle {
                  font-size: 1rem !important;
                }
                .nav-menu {
                  flex-direction: column !important;
                  gap: 1rem !important;
                }
                .collection-card {
                  padding: 1.5rem !important;
                }
              }
              
              @keyframes slideInLeft {
                from { opacity: 0; transform: translateX(-50px); }
                to { opacity: 1; transform: translateX(0); }
              }
              
              @keyframes slideInRight {
                from { opacity: 0; transform: translateX(50px); }
                to { opacity: 1; transform: translateX(0); }
              }
              
              @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
              }
              
              @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
              }
              
              .animate-slide-left { animation: slideInLeft 0.8s ease-out; }
              .animate-slide-right { animation: slideInRight 0.8s ease-out; }
              .animate-fade-up { animation: fadeInUp 0.8s ease-out; }
              
              .luxury-card {
                transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                position: relative;
                overflow: hidden;
              }
              
              .luxury-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                transition: left 0.6s ease;
              }
              
              .luxury-card:hover::before {
                left: 100%;
              }
              
              .luxury-card:hover {
                transform: translateY(-8px);
                box-shadow: 0 25px 50px rgba(0,0,0,0.15);
              }
              
              .gold-button {
                position: relative;
                overflow: hidden;
                background: linear-gradient(45deg, #d4af37, #ffd700, #d4af37);
                background-size: 200% 200%;
                animation: shimmer 2s ease-in-out infinite;
              }
              
              .gold-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 25px rgba(212,175,55,0.4);
              }
              
              .elegant-border {
                border: 1px solid rgba(255,255,255,0.1);
                backdrop-filter: blur(10px);
              }
              
              .text-gradient {
                background: linear-gradient(135deg, #d4af37, #ffd700, #ffed4e);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
              }
            </style>
            
            <section style="font-family: 'Playfair Display', 'Times New Roman', serif; background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%); color: #ffffff; min-height: 100vh;">
              <!-- Navigation -->
              <nav style="position: fixed; top: 0; width: 100%; z-index: 1000; padding: 1.5rem 0; background: rgba(0,0,0,0.9); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(212,175,55,0.2);">
                <div style="max-width: 1200px; margin: 0 auto; padding: 0 2rem; display: flex; justify-content: space-between; align-items: center;">
                  <div style="font-size: 2rem; font-weight: 700; letter-spacing: 2px;" class="text-gradient">
                    LUXE
                  </div>
                  <div class="nav-menu" style="display: flex; gap: 3rem; align-items: center;">
                    <a href="#collections" style="color: #ffffff; text-decoration: none; font-size: 1rem; font-weight: 500; letter-spacing: 1px; transition: color 0.3s ease;">Collections</a>
                    <a href="#about" style="color: #ffffff; text-decoration: none; font-size: 1rem; font-weight: 500; letter-spacing: 1px; transition: color 0.3s ease;">About</a>
                    <a href="#contact" style="color: #ffffff; text-decoration: none; font-size: 1rem; font-weight: 500; letter-spacing: 1px; transition: color 0.3s ease;">Contact</a>
                    <button class="gold-button" style="padding: 0.8rem 2rem; border: none; border-radius: 0; color: #000; font-weight: 600; letter-spacing: 1px; cursor: pointer; text-transform: uppercase;">Shop Now</button>
                  </div>
                </div>
              </nav>
              
              <!-- Hero Section -->
              <section class="hero-section" style="padding: 8rem 2rem 4rem; text-align: center; position: relative; overflow: hidden;">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%; height: 100%; background: radial-gradient(circle at center, rgba(212,175,55,0.1) 0%, transparent 70%);"></div>
                
                <div class="animate-fade-up" style="position: relative; z-index: 2;">
                  <h1 class="hero-title" style="font-size: 4.5rem; font-weight: 300; margin-bottom: 1.5rem; letter-spacing: 3px; line-height: 1.2;">
                    ELEGANCE<br/>
                    <span class="text-gradient" style="font-weight: 400;">REDEFINED</span>
                  </h1>
                  <p class="hero-subtitle" style="font-size: 1.4rem; max-width: 600px; margin: 0 auto 3rem; color: #cccccc; line-height: 1.6; font-weight: 300;">
                    Discover our exclusive collection of luxury fashion pieces that embody timeless sophistication and contemporary style.
                  </p>
                  <div style="display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap;">
                    <button class="gold-button" style="padding: 1.2rem 3rem; border: none; border-radius: 0; color: #000; font-size: 1.1rem; font-weight: 600; letter-spacing: 1px; cursor: pointer; text-transform: uppercase;">
                      Explore Collection
                    </button>
                    <button style="padding: 1.2rem 3rem; background: transparent; border: 1px solid #d4af37; color: #d4af37; font-size: 1.1rem; font-weight: 500; letter-spacing: 1px; cursor: pointer; text-transform: uppercase; transition: all 0.3s ease;">
                      View Lookbook
                    </button>
                  </div>
                </div>
              </section>
              
              <!-- Collections Section -->
              <section id="collections" style="padding: 6rem 2rem; background: linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%);">
                <div style="max-width: 1200px; margin: 0 auto;">
                  <div style="text-align: center; margin-bottom: 4rem;">
                    <div style="color: #d4af37; font-size: 0.9rem; font-weight: 600; letter-spacing: 3px; margin-bottom: 1rem; text-transform: uppercase;">Our Collections</div>
                    <h2 style="font-size: 3rem; font-weight: 300; margin-bottom: 1rem; letter-spacing: 2px;">CURATED EXCELLENCE</h2>
                    <div style="width: 60px; height: 1px; background: #d4af37; margin: 0 auto;"></div>
                  </div>
                  
                  <div class="collection-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 3rem;">
                    <div class="luxury-card elegant-border" style="background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%); padding: 3rem; text-align: center;">
                      <div style="width: 100px; height: 100px; margin: 0 auto 2rem; background: linear-gradient(135deg, #d4af37, #ffd700); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem;">👗</div>
                      <h3 style="font-size: 1.8rem; font-weight: 400; margin-bottom: 1rem; letter-spacing: 1px;">Evening Wear</h3>
                      <p style="color: #cccccc; line-height: 1.6; margin-bottom: 2rem;">Exquisite evening gowns and formal attire for the most special occasions.</p>
                      <button style="background: transparent; border: 1px solid #d4af37; color: #d4af37; padding: 0.8rem 2rem; font-weight: 500; letter-spacing: 1px; cursor: pointer; transition: all 0.3s ease;">
                        View Collection
                      </button>
                    </div>
                    
                    <div class="luxury-card elegant-border" style="background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%); padding: 3rem; text-align: center;">
                      <div style="width: 100px; height: 100px; margin: 0 auto 2rem; background: linear-gradient(135deg, #d4af37, #ffd700); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem;">👔</div>
                      <h3 style="font-size: 1.8rem; font-weight: 400; margin-bottom: 1rem; letter-spacing: 1px;">Business Attire</h3>
                      <p style="color: #cccccc; line-height: 1.6; margin-bottom: 2rem;">Professional and sophisticated business wear for the modern executive.</p>
                      <button style="background: transparent; border: 1px solid #d4af37; color: #d4af37; padding: 0.8rem 2rem; font-weight: 500; letter-spacing: 1px; cursor: pointer; transition: all 0.3s ease;">
                        View Collection
                      </button>
                    </div>
                    
                    <div class="luxury-card elegant-border" style="background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%); padding: 3rem; text-align: center;">
                      <div style="width: 100px; height: 100px; margin: 0 auto 2rem; background: linear-gradient(135deg, #d4af37, #ffd700); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem;">👜</div>
                      <h3 style="font-size: 1.8rem; font-weight: 400; margin-bottom: 1rem; letter-spacing: 1px;">Accessories</h3>
                      <p style="color: #cccccc; line-height: 1.6; margin-bottom: 2rem;">Luxury handbags, jewelry, and accessories to complete your look.</p>
                      <button style="background: transparent; border: 1px solid #d4af37; color: #d4af37; padding: 0.8rem 2rem; font-weight: 500; letter-spacing: 1px; cursor: pointer; transition: all 0.3s ease;">
                        View Collection
                      </button>
                    </div>
                  </div>
                </div>
              </section>
              
              <!-- Features Section -->
              <section style="padding: 6rem 2rem; background: #0a0a0a;">
                <div style="max-width: 1200px; margin: 0 auto;">
                  <div class="feature-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 4rem;">
                    <div class="animate-slide-left" style="text-align: center;">
                      <div style="width: 80px; height: 80px; margin: 0 auto 1.5rem; background: linear-gradient(135deg, #d4af37, #ffd700); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem;">✈️</div>
                      <h3 style="font-size: 1.5rem; font-weight: 400; margin-bottom: 1rem; letter-spacing: 1px;">Worldwide Shipping</h3>
                      <p style="color: #cccccc; line-height: 1.6;">Free express shipping to over 50 countries worldwide.</p>
                    </div>
                    
                    <div class="animate-fade-up" style="text-align: center;">
                      <div style="width: 80px; height: 80px; margin: 0 auto 1.5rem; background: linear-gradient(135deg, #d4af37, #ffd700); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem;">🔒</div>
                      <h3 style="font-size: 1.5rem; font-weight: 400; margin-bottom: 1rem; letter-spacing: 1px;">Secure Payment</h3>
                      <p style="color: #cccccc; line-height: 1.6;">100% secure payment processing with buyer protection.</p>
                    </div>
                    
                    <div class="animate-slide-right" style="text-align: center;">
                      <div style="width: 80px; height: 80px; margin: 0 auto 1.5rem; background: linear-gradient(135deg, #d4af37, #ffd700); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem;">💎</div>
                      <h3 style="font-size: 1.5rem; font-weight: 400; margin-bottom: 1rem; letter-spacing: 1px;">Premium Quality</h3>
                      <p style="color: #cccccc; line-height: 1.6;">Handcrafted pieces using only the finest materials.</p>
                    </div>
                  </div>
                </div>
              </section>
              
              <!-- Contact Section -->
              <section id="contact" style="padding: 6rem 2rem; background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);">
                <div style="max-width: 800px; margin: 0 auto; text-align: center;">
                  <div style="color: #d4af37; font-size: 0.9rem; font-weight: 600; letter-spacing: 3px; margin-bottom: 1rem; text-transform: uppercase;">Get In Touch</div>
                  <h2 style="font-size: 3rem; font-weight: 300; margin-bottom: 2rem; letter-spacing: 2px;">Experience Luxury</h2>
                  <p style="color: #cccccc; font-size: 1.2rem; line-height: 1.6; margin-bottom: 3rem;">
                    Visit our flagship store or contact our personal stylists for a bespoke shopping experience.
                  </p>
                  
                  <div class="elegant-border" style="background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%); padding: 3rem; text-align: left;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
                      <div>
                        <h4 style="color: #d4af37; font-size: 1.1rem; font-weight: 500; margin-bottom: 0.5rem; letter-spacing: 1px;">Address</h4>
                        <p style="color: #cccccc; line-height: 1.5;">123 Luxury Avenue<br/>New York, NY 10001</p>
                      </div>
                      <div>
                        <h4 style="color: #d4af37; font-size: 1.1rem; font-weight: 500; margin-bottom: 0.5rem; letter-spacing: 1px;">Phone</h4>
                        <p style="color: #cccccc; line-height: 1.5;">+1 (555) 123-4567</p>
                      </div>
                      <div>
                        <h4 style="color: #d4af37; font-size: 1.1rem; font-weight: 500; margin-bottom: 0.5rem; letter-spacing: 1px;">Email</h4>
                        <p style="color: #cccccc; line-height: 1.5;">info@luxefashion.com</p>
                      </div>
                    </div>
                    <button class="gold-button" style="width: 100%; padding: 1rem 2rem; border: none; border-radius: 0; color: #000; font-size: 1.1rem; font-weight: 600; letter-spacing: 1px; cursor: pointer; text-transform: uppercase;">
                      Schedule Consultation
                    </button>
                  </div>
                </div>
              </section>
              
              <!-- Footer -->
              <footer style="padding: 3rem 2rem 2rem; background: #000000; border-top: 1px solid rgba(212,175,55,0.2);">
                <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
                  <div style="font-size: 2rem; font-weight: 700; letter-spacing: 2px; margin-bottom: 1rem;" class="text-gradient">
                    LUXE
                  </div>
                  <p style="color: #888888; margin-bottom: 2rem; font-size: 0.9rem; letter-spacing: 1px;">
                    Redefining luxury fashion for the modern world
                  </p>
                  <div style="border-top: 1px solid rgba(212,175,55,0.2); padding-top: 2rem; color: #666666; font-size: 0.8rem; letter-spacing: 1px;">
                    &copy; 2025 Luxe Fashion. All rights reserved.
                  </div>
                </div>
              </footer>
            </section>
          `,
        },
      ],
    },
  },
  {
    id: "healthcare-pro",
    name: "HealthcarePro",
    data: {
      pages: [
        {
          name: "Home",
          component: `
            <style>
              /* Responsive adjustments */
              @media (max-width: 900px) {
                .hero-container {
                  padding: 6rem 2rem 3rem !important;
                }
                .hero-title {
                  font-size: 3rem !important;
                }
                .hero-subtitle {
                  font-size: 1.2rem !important;
                }
                .services-grid {
                  grid-template-columns: 1fr !important;
                  gap: 2rem !important;
                }
                .stats-grid {
                  grid-template-columns: repeat(2, 1fr) !important;
                }
              }
              @media (max-width: 600px) {
                .hero-container {
                  padding: 4rem 1rem 2rem !important;
                }
                .hero-title {
                  font-size: 2rem !important;
                }
                .hero-subtitle {
                  font-size: 1rem !important;
                }
                .nav-menu {
                  flex-direction: column !important;
                  gap: 1rem !important;
                }
                .stats-grid {
                  grid-template-columns: 1fr !important;
                }
                .service-card {
                  padding: 2rem !important;
                }
              }
              
              @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
              }
              
              @keyframes slideInLeft {
                from { opacity: 0; transform: translateX(-30px); }
                to { opacity: 1; transform: translateX(0); }
              }
              
              @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
              }
              
              @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
              }
              
              .animate-fade-up { animation: fadeInUp 0.8s ease-out; }
              .animate-slide-left { animation: slideInLeft 0.8s ease-out; }
              .animate-pulse { animation: pulse 2s ease-in-out infinite; }
              .animate-float { animation: float 3s ease-in-out infinite; }
              
              .medical-card {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
              }
              
              .medical-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #00bcd4, #4fc3f7);
                transform: scaleX(0);
                transition: transform 0.3s ease;
              }
              
              .medical-card:hover::before {
                transform: scaleX(1);
              }
              
              .medical-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 20px 40px rgba(0,188,212,0.15);
              }
              
              .primary-button {
                background: linear-gradient(135deg, #00bcd4, #4fc3f7);
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
              }
              
              .primary-button::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                background: rgba(255,255,255,0.2);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: width 0.6s ease, height 0.6s ease;
              }
              
              .primary-button:hover::before {
                width: 300px;
                height: 300px;
              }
              
              .primary-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 25px rgba(0,188,212,0.4);
              }
              
              .secondary-button {
                background: transparent;
                border: 2px solid #00bcd4;
                color: #00bcd4;
                transition: all 0.3s ease;
              }
              
              .secondary-button:hover {
                background: #00bcd4;
                color: white;
                transform: translateY(-2px);
              }
              
              .glass-effect {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
              }
              
              .icon-container {
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #00bcd4, #4fc3f7);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 1.5rem;
                font-size: 2rem;
                color: white;
                box-shadow: 0 10px 30px rgba(0,188,212,0.3);
              }
            </style>
            
            <section style="font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 50%, #bbdefb 100%); color: #333; min-height: 100vh;">
              <!-- Navigation -->
              <nav style="position: fixed; top: 0; width: 100%; z-index: 1000; padding: 1rem 0; background: rgba(255,255,255,0.95); backdrop-filter: blur(20px); box-shadow: 0 2px 20px rgba(0,0,0,0.1);">
                <div style="max-width: 1200px; margin: 0 auto; padding: 0 2rem; display: flex; justify-content: space-between; align-items: center;">
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #00bcd4, #4fc3f7); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">H</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: #00bcd4;">HealthCare Pro</div>
                  </div>
                  <div class="nav-menu" style="display: flex; gap: 2rem; align-items: center;">
                    <a href="#services" style="color: #333; text-decoration: none; font-size: 1rem; font-weight: 500; transition: color 0.3s ease;">Services</a>
                    <a href="#about" style="color: #333; text-decoration: none; font-size: 1rem; font-weight: 500; transition: color 0.3s ease;">About</a>
                    <a href="#contact" style="color: #333; text-decoration: none; font-size: 1rem; font-weight: 500; transition: color 0.3s ease;">Contact</a>
                    <button class="primary-button" style="padding: 0.8rem 2rem; border: none; border-radius: 25px; color: white; font-weight: 600; cursor: pointer;">
                      Book Appointment
                    </button>
                  </div>
                </div>
              </nav>
              
              <!-- Hero Section -->
              <section class="hero-container" style="padding: 8rem 2rem 4rem; text-align: center; position: relative; overflow: hidden;">
                <div style="position: absolute; top: 20%; right: 10%; width: 200px; height: 200px; background: radial-gradient(circle, rgba(0,188,212,0.1) 0%, transparent 70%); border-radius: 50%;"></div>
                <div style="position: absolute; bottom: 20%; left: 10%; width: 150px; height: 150px; background: radial-gradient(circle, rgba(79,195,247,0.1) 0%, transparent 70%); border-radius: 50%;"></div>
                
                <div class="animate-fade-up" style="position: relative; z-index: 2;">
                  <h1 class="hero-title" style="font-size: 4rem; font-weight: 300; margin-bottom: 1.5rem; color: #00bcd4; line-height: 1.2;">
                    Your Health,<br/>
                    <span style="font-weight: 700; color: #333;">Our Priority</span>
                  </h1>
                  <p class="hero-subtitle" style="font-size: 1.3rem; max-width: 600px; margin: 0 auto 3rem; color: #666; line-height: 1.6;">
                    Comprehensive healthcare services delivered with compassion, expertise, and cutting-edge technology for your well-being.
                  </p>
                  <div style="display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap;">
                    <button class="primary-button" style="padding: 1.2rem 3rem; border: none; border-radius: 30px; color: white; font-size: 1.1rem; font-weight: 600; cursor: pointer;">
                      Schedule Visit
                    </button>
                    <button class="secondary-button" style="padding: 1.2rem 3rem; border-radius: 30px; font-size: 1.1rem; font-weight: 600; cursor: pointer;">
                      Learn More
                    </button>
                  </div>
                </div>
              </section>
              
              <!-- Stats Section -->
              <section style="padding: 4rem 2rem; background: white;">
                <div style="max-width: 1200px; margin: 0 auto;">
                  <div class="stats-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 3rem;">
                    <div class="animate-slide-left" style="text-align: center;">
                      <div style="font-size: 3rem; font-weight: 700; color: #00bcd4; margin-bottom: 0.5rem;">15+</div>
                      <div style="color: #666; font-size: 1rem;">Years Experience</div>
                    </div>
                    <div class="animate-fade-up" style="text-align: center;">
                      <div style="font-size: 3rem; font-weight: 700; color: #00bcd4; margin-bottom: 0.5rem;">50K+</div>
                      <div style="color: #666; font-size: 1rem;">Patients Treated</div>
                    </div>
                    <div class="animate-fade-up" style="text-align: center;">
                      <div style="font-size: 3rem; font-weight: 700; color: #00bcd4; margin-bottom: 0.5rem;">24/7</div>
                      <div style="color: #666; font-size: 1rem;">Emergency Care</div>
                    </div>
                    <div class="animate-slide-left" style="text-align: center;">
                      <div style="font-size: 3rem; font-weight: 700; color: #00bcd4; margin-bottom: 0.5rem;">98%</div>
                      <div style="color: #666; font-size: 1rem;">Success Rate</div>
                    </div>
                  </div>
                </div>
              </section>
              
              <!-- Services Section -->
              <section id="services" style="padding: 6rem 2rem; background: linear-gradient(135deg, #e3f2fd 0%, #f8f9fa 100%);">
                <div style="max-width: 1200px; margin: 0 auto;">
                  <div style="text-align: center; margin-bottom: 4rem;">
                    <div style="color: #00bcd4; font-size: 1rem; font-weight: 600; letter-spacing: 2px; margin-bottom: 1rem; text-transform: uppercase;">Our Services</div>
                    <h2 style="font-size: 3rem; font-weight: 300; margin-bottom: 1rem; color: #333;">Comprehensive Healthcare</h2>
                    <div style="width: 60px; height: 3px; background: linear-gradient(90deg, #00bcd4, #4fc3f7); margin: 0 auto;"></div>
                  </div>
                  
                  <div class="services-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2.5rem;">
                    <div class="medical-card glass-effect" style="background: white; padding: 3rem; text-align: center; border-radius: 15px;">
                      <div class="icon-container animate-pulse">🏥</div>
                      <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem; color: #333;">Emergency Care</h3>
                      <p style="color: #666; line-height: 1.6; margin-bottom: 2rem;">24/7 emergency medical services with state-of-the-art facilities and experienced medical professionals.</p>
                      <button class="secondary-button" style="padding: 0.8rem 2rem; border-radius: 25px; font-weight: 500; cursor: pointer;">
                        Learn More
                      </button>
                    </div>
                    
                    <div class="medical-card glass-effect" style="background: white; padding: 3rem; text-align: center; border-radius: 15px;">
                      <div class="icon-container animate-float">👨‍⚕️</div>
                      <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem; color: #333;">Primary Care</h3>
                      <p style="color: #666; line-height: 1.6; margin-bottom: 2rem;">Comprehensive primary healthcare services including routine checkups, preventive care, and chronic disease management.</p>
                      <button class="secondary-button" style="padding: 0.8rem 2rem; border-radius: 25px; font-weight: 500; cursor: pointer;">
                        Learn More
                      </button>
                    </div>
                    
                    <div class="medical-card glass-effect" style="background: white; padding: 3rem; text-align: center; border-radius: 15px;">
                      <div class="icon-container animate-pulse">🔬</div>
                      <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem; color: #333;">Diagnostic Services</h3>
                      <p style="color: #666; line-height: 1.6; margin-bottom: 2rem;">Advanced diagnostic imaging, laboratory services, and specialized testing for accurate medical diagnosis.</p>
                      <button class="secondary-button" style="padding: 0.8rem 2rem; border-radius: 25px; font-weight: 500; cursor: pointer;">
                        Learn More
                      </button>
                    </div>
                    
                    <div class="medical-card glass-effect" style="background: white; padding: 3rem; text-align: center; border-radius: 15px;">
                      <div class="icon-container animate-float">💊</div>
                      <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem; color: #333;">Pharmacy Services</h3>
                      <p style="color: #666; line-height: 1.6; margin-bottom: 2rem;">Full-service pharmacy with prescription medications, health consultations, and medication management.</p>
                      <button class="secondary-button" style="padding: 0.8rem 2rem; border-radius: 25px; font-weight: 500; cursor: pointer;">
                        Learn More
                      </button>
                    </div>
                    
                    <div class="medical-card glass-effect" style="background: white; padding: 3rem; text-align: center; border-radius: 15px;">
                      <div class="icon-container animate-pulse">🧠</div>
                      <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem; color: #333;">Mental Health</h3>
                      <p style="color: #666; line-height: 1.6; margin-bottom: 2rem;">Comprehensive mental health services including counseling, therapy, and psychiatric care for all ages.</p>
                      <button class="secondary-button" style="padding: 0.8rem 2rem; border-radius: 25px; font-weight: 500; cursor: pointer;">
                        Learn More
                      </button>
                    </div>
                    
                    <div class="medical-card glass-effect" style="background: white; padding: 3rem; text-align: center; border-radius: 15px;">
                      <div class="icon-container animate-float">👶</div>
                      <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem; color: #333;">Pediatric Care</h3>
                      <p style="color: #666; line-height: 1.6; margin-bottom: 2rem;">Specialized pediatric healthcare services with child-friendly facilities and experienced pediatricians.</p>
                      <button class="secondary-button" style="padding: 0.8rem 2rem; border-radius: 25px; font-weight: 500; cursor: pointer;">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              </section>
              
              <!-- Contact Section -->
              <section id="contact" style="padding: 6rem 2rem; background: white;">
                <div style="max-width: 1000px; margin: 0 auto;">
                  <div style="text-align: center; margin-bottom: 4rem;">
                    <div style="color: #00bcd4; font-size: 1rem; font-weight: 600; letter-spacing: 2px; margin-bottom: 1rem; text-transform: uppercase;">Contact Us</div>
                    <h2 style="font-size: 3rem; font-weight: 300; margin-bottom: 1rem; color: #333;">Get In Touch</h2>
                    <p style="color: #666; font-size: 1.2rem; line-height: 1.6;">
                      Ready to take care of your health? Contact us today to schedule an appointment.
                    </p>
                  </div>
                  
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start;">
                    <div>
                      <div style="display: grid; gap: 2rem;">
                        <div style="display: flex; align-items: center; gap: 1rem; padding: 1.5rem; background: #f8f9fa; border-radius: 10px;">
                          <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #00bcd4, #4fc3f7); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem;">📍</div>
                          <div>
                            <h4 style="font-weight: 600; margin-bottom: 0.5rem; color: #333;">Address</h4>
                            <p style="color: #666;">123 Medical Center Drive<br/>Healthcare City, HC 12345</p>
                          </div>
                        </div>
                        
                        <div style="display: flex; align-items: center; gap: 1rem; padding: 1.5rem; background: #f8f9fa; border-radius: 10px;">
                          <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #00bcd4, #4fc3f7); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem;">📞</div>
                          <div>
                            <h4 style="font-weight: 600; margin-bottom: 0.5rem; color: #333;">Phone</h4>
                            <p style="color: #666;">Emergency: (555) 911-HELP<br/>Appointments: (555) 123-CARE</p>
                          </div>
                        </div>
                        
                        <div style="display: flex; align-items: center; gap: 1rem; padding: 1.5rem; background: #f8f9fa; border-radius: 10px;">
                          <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #00bcd4, #4fc3f7); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem;">✉️</div>
                          <div>
                            <h4 style="font-weight: 600; margin-bottom: 0.5rem; color: #333;">Email</h4>
                            <p style="color: #666;">info@healthcarepro.com<br/>appointments@healthcarepro.com</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="glass-effect" style="background: white; padding: 3rem; border-radius: 15px;">
                      <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 2rem; color: #333;">Schedule Appointment</h3>
                      <form onsubmit="event.preventDefault(); alert('Thank you! We will contact you soon to confirm your appointment.');" style="display: flex; flex-direction: column; gap: 1.5rem;">
                        <input type="text" placeholder="Full Name" required style="padding: 1rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem; transition: border-color 0.3s ease;" onfocus="this.style.borderColor='#00bcd4';" onblur="this.style.borderColor='#e0e0e0';" />
                        <input type="email" placeholder="Email Address" required style="padding: 1rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem; transition: border-color 0.3s ease;" onfocus="this.style.borderColor='#00bcd4';" onblur="this.style.borderColor='#e0e0e0';" />
                        <input type="tel" placeholder="Phone Number" required style="padding: 1rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem; transition: border-color 0.3s ease;" onfocus="this.style.borderColor='#00bcd4';" onblur="this.style.borderColor='#e0e0e0';" />
                        <select required style="padding: 1rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem; transition: border-color 0.3s ease;" onfocus="this.style.borderColor='#00bcd4';" onblur="this.style.borderColor='#e0e0e0';">
                          <option value="">Select Service</option>
                          <option value="primary">Primary Care</option>
                          <option value="emergency">Emergency Care</option>
                          <option value="diagnostic">Diagnostic Services</option>
                          <option value="mental">Mental Health</option>
                          <option value="pediatric">Pediatric Care</option>
                        </select>
                        <textarea placeholder="Additional Information" rows="4" style="padding: 1rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem; resize: vertical; transition: border-color 0.3s ease;" onfocus="this.style.borderColor='#00bcd4';" onblur="this.style.borderColor='#e0e0e0';"></textarea>
                        <button type="submit" class="primary-button" style="padding: 1rem 2rem; border: none; border-radius: 8px; color: white; font-size: 1.1rem; font-weight: 600; cursor: pointer;">
                          Request Appointment
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </section>
              
              <!-- Footer -->
              <footer style="padding: 3rem 2rem 2rem; background: #333; color: white;">
                <div style="max-width: 1200px; margin: 0 auto;">
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 3rem; margin-bottom: 2rem;">
                    <div>
                      <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #00bcd4, #4fc3f7); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">H</div>
                        <div style="font-size: 1.5rem; font-weight: 700; color: #00bcd4;">HealthCare Pro</div>
                      </div>
                      <p style="color: #ccc; line-height: 1.6; margin-bottom: 1rem;">
                        Providing exceptional healthcare services with compassion, expertise, and cutting-edge technology.
                      </p>
                    </div>
                    
                    <div>
                      <h4 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 1rem; color: #00bcd4;">Services</h4>
                      <ul style="list-style: none; padding: 0;">
                        <li style="margin-bottom: 0.5rem;"><a href="#services" style="color: #ccc; text-decoration: none; transition: color 0.3s ease;">Emergency Care</a></li>
                        <li style="margin-bottom: 0.5rem;"><a href="#services" style="color: #ccc; text-decoration: none; transition: color 0.3s ease;">Primary Care</a></li>
                        <li style="margin-bottom: 0.5rem;"><a href="#services" style="color: #ccc; text-decoration: none; transition: color 0.3s ease;">Diagnostic Services</a></li>
                        <li style="margin-bottom: 0.5rem;"><a href="#services" style="color: #ccc; text-decoration: none; transition: color 0.3s ease;">Mental Health</a></li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 1rem; color: #00bcd4;">Contact Info</h4>
                      <p style="color: #ccc; margin-bottom: 0.5rem;">📞 (555) 123-CARE</p>
                      <p style="color: #ccc; margin-bottom: 0.5rem;">✉️ info@healthcarepro.com</p>
                      <p style="color: #ccc;">📍 123 Medical Center Drive</p>
                    </div>
                  </div>
                  
                  <div style="border-top: 1px solid #555; padding-top: 2rem; text-align: center; color: #999;">
                    <p>&copy; 2025 HealthCare Pro. All rights reserved. | Privacy Policy | Terms of Service</p>
                  </div>
                </div>
              </footer>
            </section>
          `,
        },
      ],
    },
  },
];

export default DemoTemplates;
