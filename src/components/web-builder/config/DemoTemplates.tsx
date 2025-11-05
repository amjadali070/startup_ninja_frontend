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
    id: "art-folio",
    name: "ArtFolio",
    data: {
      pages: [
        {
          name: "Home",
          component: `
            <style>
              .af-nav{position:fixed;top:0;left:0;right:0;height:60px;display:flex;align-items:center;justify-content:space-between;padding:0 1rem;background:rgba(17,17,17,.7);backdrop-filter:blur(8px);border-bottom:1px solid #222}
              .af-brand{font-family:'Playfair Display',serif;color:#F59E0B;font-weight:700}
              .af-hero{padding:7rem 2rem 5rem;background:linear-gradient(135deg,#111 0%,#1a1a1a 100%);color:#fff;text-align:center}
              .af-title{font-family:'Playfair Display',serif;font-size:3.5rem;letter-spacing:1px}
              .af-title span{color:#F59E0B}
              .af-sub{max-width:760px;margin:1rem auto 2rem;color:#d1d5db}
              .af-btn{margin-top:1rem;border:1px solid #F59E0B;color:#F59E0B;background:transparent;padding:.7rem 1.3rem;border-radius:999px}
              .af-section{padding:2.5rem 2rem;background:#111}
              .af-grid{max-width:1100px;margin:0 auto;display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(260px,1fr))}
              .af-card{position:relative;border-radius:14px;overflow:hidden}
              .af-card img{width:100%;height:260px;object-fit:cover;display:block;filter:grayscale(.15)}
              .af-cap{position:absolute;left:0;right:0;bottom:0;padding:.75rem 1rem;background:linear-gradient(180deg,transparent,rgba(0,0,0,.75));color:#fff}
              .af-test{max-width:900px;margin:0 auto;color:#ddd;text-align:center}
              .af-footer{padding:2rem;background:#0d0d0d;color:#9ca3af;border-top:1px solid #222;text-align:center}
              @media(max-width:600px){.af-title{font-size:2.2rem}}
            </style>
            <nav class="af-nav"><div class="af-brand">ArtFolio</div><div style="color:#bbb;font-size:.95rem">Portfolio · Services · Contact</div></nav>
            <section class="af-hero">
              <h1 class="af-title">Discover <span>Artistry</span> in Motion</h1>
              <p class="af-sub">A bold portfolio template for designers, illustrators and studios who want their work to speak first.</p>
              <button class="af-btn">View Portfolio</button>
            </section>
            <section class="af-section" id="about">
              <div style="max-width:900px;margin:0 auto;text-align:center;color:#ddd">
                <h3 style="color:#F59E0B;margin:0 0 .5rem">About Me</h3>
                <p>I’m a multidisciplinary artist exploring the intersection of texture, light and narrative. My work spans brand identity, editorial and digital craft.</p>
              </div>
            </section>
            <section class="af-section">
              <div class="af-grid">
                <figure class="af-card"><img src="https://images.unsplash.com/photo-1526312426976-593c1a1fb1a5?q=80&w=1200&auto=format&fit=crop" alt="work1"/><figcaption class="af-cap">Brand Identity</figcaption></figure>
                <figure class="af-card"><img src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1200&auto=format&fit=crop" alt="work2"/><figcaption class="af-cap">Packaging</figcaption></figure>
                <figure class="af-card"><img src="https://images.unsplash.com/photo-1496302662116-35cc4f36df92?q=80&w=1200&auto=format&fit=crop" alt="work3"/><figcaption class="af-cap">Editorial</figcaption></figure>
              </div>
            </section>
            <section class="af-section" id="exhibitions">
              <div style="max-width:900px;margin:0 auto;color:#ddd">
                <h3 style="color:#F59E0B;text-align:center;margin:0 0 1rem">Exhibitions</h3>
                <ul style="list-style:none;padding:0;display:grid;gap:.75rem;grid-template-columns:1fr 1fr">
                  <li style="background:#0d0d0d;border:1px solid #222;border-radius:10px;padding:1rem">2024 — Shapes in Motion, Modern Arts Gallery</li>
                  <li style="background:#0d0d0d;border:1px solid #222;border-radius:10px;padding:1rem">2023 — Light & Grain, Downtown Studio</li>
                  <li style="background:#0d0d0d;border:1px solid #222;border-radius:10px;padding:1rem">2022 — Print Stories, Collective Space</li>
                  <li style="background:#0d0d0d;border:1px solid #222;border-radius:10px;padding:1rem">Awards — AIGA, D&AD (shortlist)</li>
                </ul>
              </div>
            </section>
            <section class="af-section" id="services">
              <div class="af-grid">
                <div class="af-card" style="background:#0d0d0d;border:1px solid #222;height:auto">
                  <div style="padding:1rem;color:#fff"><h3 style="margin:.25rem 0">Brand Strategy</h3><p style="color:#a3a3a3">Positioning, tone and narrative systems.</p></div>
                </div>
                <div class="af-card" style="background:#0d0d0d;border:1px solid #222;height:auto">
                  <div style="padding:1rem;color:#fff"><h3 style="margin:.25rem 0">Visual Identity</h3><p style="color:#a3a3a3">Logos, type, color and guidelines.</p></div>
                </div>
                <div class="af-card" style="background:#0d0d0d;border:1px solid #222;height:auto">
                  <div style="padding:1rem;color:#fff"><h3 style="margin:.25rem 0">Digital Design</h3><p style="color:#a3a3a3">Web, product and marketing assets.</p></div>
                </div>
              </div>
            </section>
            <section class="af-section" id="blog">
              <div class="af-grid" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">
                <article style="background:#0d0d0d;border:1px solid #222;border-radius:14px;padding:1rem;color:#fff"><h3>Process Notes</h3><p style="color:#a3a3a3">Sketching type by hand before vector.</p></article>
                <article style="background:#0d0d0d;border:1px solid #222;border-radius:14px;padding:1rem;color:#fff"><h3>Studio Tools</h3><p style="color:#a3a3a3">Palette building for brand systems.</p></article>
                <article style="background:#0d0d0d;border:1px solid #222;border-radius:14px;padding:1rem;color:#fff"><h3>Case Study</h3><p style="color:#a3a3a3">From moodboard to launch in 4 weeks.</p></article>
              </div>
            </section>
            <section class="af-section">
              <div class="af-test">
                <h3 style="color:#F59E0B;margin-bottom:.5rem">What clients say</h3>
                <p>“ArtFolio delivered a stunning visual language for our brand. The attention to detail and craft is exceptional.”</p>
              </div>
            </section>
            <section class="af-section" id="pricing">
              <div class="af-grid" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">
                <div style="background:#0d0d0d;border:1px solid #222;border-radius:14px;padding:1.25rem;color:#fff"><h3>Starter</h3><div style="color:#F59E0B;font-weight:700;font-size:1.8rem">$899</div><p style="color:#a3a3a3">Logo, palette and basic guidelines.</p></div>
                <div style="background:#0d0d0d;border:1px solid #222;border-radius:14px;padding:1.25rem;color:#fff"><h3>Studio</h3><div style="color:#F59E0B;font-weight:700;font-size:1.8rem">$2,999</div><p style="color:#a3a3a3">Identity system, website design, assets.</p></div>
                <div style="background:#0d0d0d;border:1px solid #222;border-radius:14px;padding:1.25rem;color:#fff"><h3>Custom</h3><div style="color:#F59E0B;font-weight:700;font-size:1.8rem">Quote</div><p style="color:#a3a3a3">Tailored scope for larger engagements.</p></div>
              </div>
            </section>
            <section class="af-section" id="team">
              <div class="af-grid" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
                <div class="af-card" style="background:#0d0d0d;border:1px solid #222;height:auto;text-align:center">
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop" alt="m1" style="width:100%;height:180px;object-fit:cover"/>
                  <div class="af-cap" style="position:static;background:none;color:#fff;padding:1rem 0 .25rem">Amelia Hart — Creative Director</div>
                </div>
                <div class="af-card" style="background:#0d0d0d;border:1px solid #222;height:auto;text-align:center">
                  <img src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=600&auto=format&fit=crop" alt="m2" style="width:100%;height:180px;object-fit:cover"/>
                  <div class="af-cap" style="position:static;background:none;color:#fff;padding:1rem 0 .25rem">Liam Brooks — Designer</div>
                </div>
                <div class="af-card" style="background:#0d0d0d;border:1px solid #222;height:auto;text-align:center">
                  <img src="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=600&auto=format&fit=crop" alt="m3" style="width:100%;height:180px;object-fit:cover"/>
                  <div class="af-cap" style="position:static;background:none;color:#fff;padding:1rem 0 .25rem">Noah Chen — Illustrator</div>
                </div>
              </div>
            </section>
            <section class="af-section" style="text-align:center">
              <h3 style="color:#fff">Work with us</h3>
              <p class="af-sub" style="margin:.5rem auto 1.25rem">Tell us about your project and we’ll craft something unique.</p>
              <form onsubmit="event.preventDefault(); alert('Message sent');" style="display:inline-grid;grid-template-columns:1fr 1fr;gap:.75rem;max-width:720px;width:100%">
                <input placeholder="Your name" required style="padding:.8rem 1rem;border:1px solid #2a2a2a;background:#0d0d0d;color:#fff;border-radius:8px;grid-column:span 1"/>
                <input placeholder="Email" type="email" required style="padding:.8rem 1rem;border:1px solid #2a2a2a;background:#0d0d0d;color:#fff;border-radius:8px;grid-column:span 1"/>
                <textarea placeholder="Project details" rows="3" style="padding:.8rem 1rem;border:1px solid #2a2a2a;background:#0d0d0d;color:#fff;border-radius:8px;grid-column:span 2"></textarea>
                <button class="af-btn" type="submit" style="grid-column:span 2">Send Inquiry</button>
              </form>
            </section>
            <footer class="af-footer">
              <div style="max-width:1100px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap">
                <div>© 2025 ArtFolio Studio</div>
                <div style="display:flex;gap:1rem"><a href="#" style="color:#bbb;text-decoration:none">Privacy</a><a href="#" style="color:#bbb;text-decoration:none">Terms</a><a href="#" style="color:#bbb;text-decoration:none">Licensing</a></div>
                <div style="display:flex;gap:.75rem;color:#bbb"><span>Instagram</span><span>Behance</span><span>Dribbble</span></div>
              </div>
            </footer>
          `,
        },
      ],
    },
  },
  {
    id: "wander-green",
    name: "WanderGreen",
    data: {
      pages: [
        {
          name: "Home",
          component: `
            <style>
              :root{--wg-primary:#10B981;--wg-deep:#064E3B}
              .wg-nav{position:fixed;inset:0 0 auto 0;height:60px;display:flex;align-items:center;justify-content:space-between;padding:0 1rem;background:rgba(2,44,34,.6);backdrop-filter:blur(8px);border-bottom:1px solid rgba(255,255,255,.08);z-index:50;color:#eafff7}
              .wg-brand{font-weight:800;color:#10B981}
              .wg-hero{padding:7.5rem 2rem 5rem;text-align:center;color:#e6fffb;background:linear-gradient(180deg,#022c22 0%,#064e3b 100%)}
              .wg-title{font-size:3.8rem;font-weight:800;letter-spacing:1px}
              .wg-title span{color:var(--wg-primary)}
              .wg-sub{max-width:820px;margin:1rem auto 2.25rem;color:#c7ffe9}
              .wg-cta{display:inline-flex;gap:.75rem}
              .wg-btn{padding:.9rem 1.5rem;border-radius:12px;background:var(--wg-primary);color:#053227;font-weight:800;border:none}
              .wg-section{padding:2.5rem 2rem;background:#022c22}
              .wg-feats{max-width:1100px;margin:0 auto;display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
              .wg-card{background:#0a3b2f;border:1px solid #115e49;border-radius:12px;padding:1.1rem;color:#eafff7}
              .wg-gallery{max-width:1100px;margin:0 auto;display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(260px,1fr))}
              .wg-gallery img{width:100%;height:220px;object-fit:cover;border-radius:12px;border:1px solid #105e49}
              .wg-dests{max-width:1100px;margin:0 auto;display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(260px,1fr))}
              .wg-dest{background:#0a3b2f;border:1px solid #115e49;border-radius:12px;padding:1rem;color:#eafff7}
              .wg-dest h4{margin:0 0 .25rem;color:#10B981}
              .wg-dest ul{margin:.25rem 0 0;padding-left:1rem;color:#c7ffe9}
              .wg-footer{padding:2rem;background:#012019;color:#b6ffe8;border-top:1px solid #115e49;text-align:center}
              @media(max-width:600px){.wg-title{font-size:2.2rem}}
            </style>
            <nav class="wg-nav"><div class="wg-brand">WanderGreen</div><div style="font-size:.95rem">Trips · Gallery · Contact</div></nav>
            <section class="wg-hero">
              <h1 class="wg-title">Travel <span>Greener</span>, Explore Deeper</h1>
              <p class="wg-sub">Sustainable adventures and eco‑friendly escapes that cherish our planet.</p>
              <div class="wg-cta"><button class="wg-btn">Plan a Trip</button></div>
            </section>
            <section class="wg-section" id="about" style="text-align:center">
              <h3 style="color:#eafff7;margin:0 0 .5rem">Our Mission</h3>
              <p style="color:#c7ffe9;max-width:900px;margin:0 auto">WanderGreen crafts meaningful journeys that respect local communities and preserve nature. We believe travel can be transformative—for you and the planet.</p>
            </section>
            <section class="wg-section">
              <div class="wg-feats">
                <div class="wg-card"><strong>Low‑impact stays</strong><p>Handpicked eco lodges and green hotels.</p></div>
                <div class="wg-card"><strong>Community tours</strong><p>Give back while you explore new cultures.</p></div>
                <div class="wg-card"><strong>Offset program</strong><p>We offset every mile you travel with us.</p></div>
              </div>
            </section>
            <section class="wg-section" id="destinations">
              <h3 style="color:#eafff7;text-align:center;margin:0 0 .5rem">Destinations</h3>
              <p style="color:#c7ffe9;text-align:center;max-width:900px;margin:0 auto 1rem">Handpicked eco‑friendly locations around the world. From ancient forests to pristine coasts—travel lightly and leave places better than you found them.</p>
              <div class="wg-dests">
                <div class="wg-dest"><h4>Japan</h4><ul><li>Kyoto — temples & tea gardens</li><li>Hokkaido — alpine trails & onsens</li><li>Okinawa — coral reefs & culture</li><li>Nara — cedar forests & deer park</li></ul></div>
                <div class="wg-dest"><h4>New Zealand</h4><ul><li>Fiordland National Park</li><li>Queenstown & Lake Wakatipu</li><li>Abel Tasman Coast Track</li><li>Kaikōura marine encounters</li></ul></div>
                <div class="wg-dest"><h4>Iceland</h4><ul><li>Golden Circle & Þingvellir</li><li>Vík black‑sand beaches</li><li>Skaftafell glacier hikes</li><li>Blue Lagoon geothermal spa</li></ul></div>
                <div class="wg-dest"><h4>Peru</h4><ul><li>Machu Picchu & Inca Trail</li><li>Sacred Valley communities</li><li>Arequipa & Colca Canyon</li><li>Lake Titicaca islands</li></ul></div>
                <div class="wg-dest"><h4>Italy</h4><ul><li>Cinque Terre coastal paths</li><li>Dolomites alpine huts</li><li>Amalfi Coast terraces</li><li>Tuscany slow routes</li></ul></div>
                <div class="wg-dest"><h4>Indonesia</h4><ul><li>Ubud rice terraces</li><li>Komodo National Park</li><li>Raja Ampat diving</li><li>Lombok waterfalls</li></ul></div>
              </div>
            </section>
            <section class="wg-section" id="experiences">
              <div class="wg-feats">
                <div class="wg-card"><h3>Hiking & Trails</h3><p>Guided treks through pristine reserves.</p></div>
                <div class="wg-card"><h3>Wildlife Safaris</h3><p>Responsible encounters with local fauna.</p></div>
                <div class="wg-card"><h3>Cultural Immersions</h3><p>Learn, cook and create with local artisans.</p></div>
              </div>
            </section>
            <section class="wg-section">
              <div class="wg-gallery">
                <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop" alt="g1"/>
                <img src="https://images.unsplash.com/photo-1526481280698-8fcc13fd7906?q=80&w=1400&auto=format&fit=crop" alt="g2"/>
                <img src="https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=1400&auto=format&fit=crop" alt="g3"/>
              </div>
            </section>
            <section class="wg-section" id="blog">
              <h3 style="color:#eafff7;text-align:center;margin:0 0 1rem">Travel Tips</h3>
              <div class="wg-feats" style="grid-template-columns:repeat(auto-fit,minmax(280px,1fr))">
                <div class="wg-card"><strong>Pack Lighter</strong><p>Reduce weight and increase flexibility.</p></div>
                <div class="wg-card"><strong>Eco Etiquette</strong><p>Respect wildlife and local customs.</p></div>
                <div class="wg-card"><strong>Offset Smarter</strong><p>Choose verified carbon projects.</p></div>
              </div>
            </section>
            <section class="wg-section" id="contact" style="text-align:center">
              <h3 style="color:#eafff7;margin:0 0 .5rem">Book Your Journey</h3>
              <p style="color:#c7ffe9;margin:0 0 1rem">Tell us where you want to go and we’ll plan the rest.</p>
              <form onsubmit="event.preventDefault(); alert('Request sent!');" style="display:inline-grid;grid-template-columns:1fr 1fr;gap:.75rem;max-width:720px;width:100%">
                <input placeholder="Full name" required style="padding:.8rem 1rem;border:1px solid #115e49;background:#013325;color:#eafff7;border-radius:8px"/>
                <input placeholder="Email" type="email" required style="padding:.8rem 1rem;border:1px solid #115e49;background:#013325;color:#eafff7;border-radius:8px"/>
                <textarea placeholder="Destination & dates" rows="3" style="padding:.8rem 1rem;border:1px solid #115e49;background:#013325;color:#eafff7;border-radius:8px;grid-column:span 2"></textarea>
                <button class="wg-btn" type="submit" style="grid-column:span 2">Request Plan</button>
              </form>
            </section>
            <section class="wg-section" id="packages">
              <div class="wg-feats">
                <div class="wg-card"><h3>Weekend Escape</h3><p>2 nights eco‑lodge, guided trail. <strong>$399</strong></p></div>
                <div class="wg-card"><h3>Island Retreat</h3><p>5 nights reef clean‑up, community tour. <strong>$1299</strong></p></div>
                <div class="wg-card"><h3>Highland Trek</h3><p>7 days camping, reforestation support. <strong>$1899</strong></p></div>
              </div>
            </section>
            <section class="wg-section" id="testimonials" style="text-align:center">
              <h3 style="color:#eafff7;margin:0 0 .5rem">Traveler Stories</h3>
              <p style="color:#c7ffe9;max-width:800px;margin:0 auto 1.25rem">“The most thoughtful, sustainable experience we’ve had. Every detail minimized impact while maximizing wonder.”</p>
            </section>
            <section class="wg-section" id="team">
              <div class="wg-feats">
                <div class="wg-card" style="text-align:center"><img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop" alt="g4" style="width:100%;height:180px;object-fit:cover;border-radius:10px;margin-bottom:.5rem"/><div><strong>Elena</strong><p>Lead Guide</p></div></div>
                <div class="wg-card" style="text-align:center"><img src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=600&auto=format&fit=crop" alt="g5" style="width:100%;height:180px;object-fit:cover;border-radius:10px;margin-bottom:.5rem"/><div><strong>Marco</strong><p>Conservationist</p></div></div>
                <div class="wg-card" style="text-align:center"><img src="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=600&auto=format&fit=crop" alt="g6" style="width:100%;height:180px;object-fit:cover;border-radius:10px;margin-bottom:.5rem"/><div><strong>Asha</strong><p>Community Lead</p></div></div>
              </div>
            </section>
            <section class="wg-section" style="text-align:center">
              <h3 style="color:#eafff7;margin:0 0 .5rem">Join our newsletter</h3>
              <p style="color:#c7ffe9;margin:0 0 1rem">Eco tips and destination inspiration.</p>
              <form onsubmit="event.preventDefault(); alert('Subscribed!');" style="display:inline-flex;gap:.5rem;flex-wrap:wrap;justify-content:center">
                <input type="email" required placeholder="you@example.com" style="padding:.8rem 1rem;border-radius:10px;border:1px solid #115e49;background:#013325;color:#eafff7;min-width:260px"/>
                <button class="wg-btn" type="submit">Subscribe</button>
              </form>
            </section>
            <footer class="wg-footer">
              <div style="max-width:1100px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap">
                <div>© 2025 WanderGreen</div>
                <div style="display:flex;gap:1rem"><a href="#" style="color:#b6ffe8;text-decoration:none">Privacy</a><a href="#" style="color:#b6ffe8;text-decoration:none">Terms</a><a href="#" style="color:#b6ffe8;text-decoration:none">Sustainability</a></div>
                <div style="display:flex;gap:.75rem;color:#b6ffe8"><span>Instagram</span><span>Facebook</span><span>Twitter</span></div>
              </div>
            </footer>
          `,
        },
      ],
    },
  },
  {
    id: "city-cafe",
    name: "CityCafe",
    data: {
      pages: [
        {
          name: "Home",
          component: `
            <style>
              .cc-nav{position:fixed;inset:0 0 auto 0;height:60px;background:rgba(28,20,15,.8);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:space-between;padding:0 1rem;color:#FDE68A;border-bottom:1px solid rgba(253,230,138,.2);z-index:50}
              .cc-hero{padding:7rem 2rem 5rem;text-align:center;background:linear-gradient(180deg,#1c140f 0%,#120c08 100%);color:#fff}
              .cc-title{font-size:3.2rem;font-weight:800;letter-spacing:.5px}
              .cc-sub{max-width:740px;margin:1rem auto 2rem;color:#e5d5b3}
              .cc-btn{padding:.8rem 1.4rem;border-radius:999px;background:#F59E0B;color:#1b120b;border:none;font-weight:800}
              .cc-section{padding:2.5rem 2rem;background:#120c08;color:#f3ebe0}
              .cc-grid{max-width:1100px;margin:0 auto;display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
              .cc-card{background:#1b120b;border:1px solid #3a2a1e;border-radius:12px;padding:1rem}
              .cc-gallery img{width:100%;height:220px;object-fit:cover;border-radius:10px;border:1px solid #3a2a1e}
              .cc-footer{padding:2rem;background:#0c0906;color:#e5d5b3;border-top:1px solid #3a2a1e;text-align:center}
            </style>
            <nav class="cc-nav"><div style="font-weight:800">CityCafe</div><div style="opacity:.9">Menu · Gallery · Reservations</div></nav>
            <section class="cc-hero"><h1 class="cc-title">Brewed to Perfection</h1><p class="cc-sub">Artisanal coffee, fresh bakes and cozy ambience in the heart of the city.</p><button class="cc-btn">Reserve a Table</button></section>
            <section class="cc-section" id="menu"><div class="cc-grid">
              <div class="cc-card"><h3>Espresso</h3><p>Rich and bold shot</p></div>
              <div class="cc-card"><h3>Latte</h3><p>Velvety smooth milk</p></div>
              <div class="cc-card"><h3>Croissant</h3><p>Buttery, flaky layers</p></div>
              <div class="cc-card"><h3>Cheesecake</h3><p>Creamy, seasonal fruit</p></div>
            </div></section>
            <section class="cc-section" id="gallery"><div class="cc-grid cc-gallery">
              <img src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1400&auto=format&fit=crop" alt="c1"/>
              <img src="https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1400&auto=format&fit=crop" alt="c2"/>
              <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1400&auto=format&fit=crop" alt="c3"/>
            </div></section>
            <section class="cc-section" id="pricing"><div class="cc-grid">
              <div class="cc-card"><h3>Breakfast</h3><p>Pastry + Coffee <strong>$8</strong></p></div>
              <div class="cc-card"><h3>Lunch</h3><p>Panini + Drink <strong>$14</strong></p></div>
              <div class="cc-card"><h3>Dessert</h3><p>Cake + Cappuccino <strong>$10</strong></p></div>
            </div></section>
            <section class="cc-section" id="team"><div class="cc-grid">
              <div class="cc-card" style="text-align:center"><img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop" style="width:100%;height:180px;object-fit:cover;border-radius:10px;margin-bottom:.5rem"/><div><strong>Maria</strong><p>Head Barista</p></div></div>
              <div class="cc-card" style="text-align:center"><img src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=600&auto=format&fit=crop" style="width:100%;height:180px;object-fit:cover;border-radius:10px;margin-bottom:.5rem"/><div><strong>Jon</strong><p>Pastry Chef</p></div></div>
              <div class="cc-card" style="text-align:center"><img src="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=600&auto=format&fit=crop" style="width:100%;height:180px;object-fit:cover;border-radius:10px;margin-bottom:.5rem"/><div><strong>Eva</strong><p>Manager</p></div></div>
            </div></section>
            <section class="cc-section" style="text-align:center"><h3>Book a table</h3>
              <form onsubmit="event.preventDefault(); alert('Booked!');" style="display:inline-grid;grid-template-columns:1fr 1fr;gap:.75rem;max-width:720px;width:100%">
                <input placeholder="Name" required style="padding:.8rem 1rem;border:1px solid #3a2a1e;background:#1b120b;color:#f3ebe0;border-radius:8px"/>
                <input placeholder="Phone" required style="padding:.8rem 1rem;border:1px solid #3a2a1e;background:#1b120b;color:#f3ebe0;border-radius:8px"/>
                <input type="date" required style="padding:.8rem 1rem;border:1px solid #3a2a1e;background:#1b120b;color:#f3ebe0;border-radius:8px;grid-column:span 2"/>
                <button class="cc-btn" type="submit" style="grid-column:span 2">Reserve</button>
              </form>
            </section>
            <footer class="cc-footer">© 2025 CityCafe. All rights reserved.</footer>
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
                .lux-hero-section {
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
                .lux-hero-section {
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
              <section class="lux-hero-section" style="padding: 8rem 2rem 6rem; text-align: center; position: relative; overflow: hidden;">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%; height: 100%; background: radial-gradient(circle at center, rgba(212,175,55,0.1) 0%, transparent 70%);"></div>
                
                <div class="animate-fade-up" style="position: relative; z-index: 2;">
                  <h1 class="hero-title" style="font-size: 4.25rem; font-weight: 300; margin-bottom: 1rem; letter-spacing: 3px; line-height: 1.15;">
                    Elevate Your <span class="text-gradient" style="font-weight: 500;">Elegance</span>
                  </h1>
                  <p class="hero-subtitle" style="font-size: 1.25rem; max-width: 760px; margin: 0 auto 2.25rem; color: #d1d1d1; line-height: 1.7; font-weight: 300;">
                    Curated luxury fashion that blends timeless craftsmanship with modern minimalism.
                  </p>
                  <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button class="gold-button" style="padding: 1rem 2.5rem; border: none; border-radius: 999px; color: #000; font-size: 1.05rem; font-weight: 700; letter-spacing: 0.5px; cursor: pointer; box-shadow: 0 10px 30px rgba(212,175,55,0.35);">
                      Explore Collection
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
  {
    id: "restaurant-premium",
    name: "RestaurantPremium",
    data: {
      pages: [
        {
          name: "Home",
          component: `
            <style>
              /* Responsive adjustments */
              @media (max-width: 900px) {
                .restaurant-hero-section {
                  padding: 6rem 2rem 3rem !important;
                }
                .hero-title {
                  font-size: 3rem !important;
                }
                .hero-subtitle {
                  font-size: 1.2rem !important;
                }
                .menu-grid {
                  grid-template-columns: 1fr !important;
                  gap: 2rem !important;
                }
                .chef-grid {
                  grid-template-columns: 1fr !important;
                }
              }
              @media (max-width: 600px) {
                .restaurant-hero-section {
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
                .chef-grid {
                  grid-template-columns: 1fr !important;
                }
                .menu-item {
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
              
              @keyframes slideInRight {
                from { opacity: 0; transform: translateX(30px); }
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
              .animate-slide-right { animation: slideInRight 0.8s ease-out; }
              .animate-pulse { animation: pulse 2s ease-in-out infinite; }
              .animate-float { animation: float 3s ease-in-out infinite; }
              
              .restaurant-card {
                transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                position: relative;
                overflow: hidden;
              }
              
              .restaurant-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #d4af37, #f4d03f);
                transform: scaleX(0);
                transition: transform 0.3s ease;
              }
              
              .restaurant-card:hover::before {
                transform: scaleX(1);
              }
              
              .restaurant-card:hover {
                transform: translateY(-8px);
                box-shadow: 0 25px 50px rgba(212,175,55,0.2);
              }
              
              .gold-button {
                background: linear-gradient(135deg, #d4af37, #f4d03f);
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
              }
              
              .gold-button::before {
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
              
              .gold-button:hover::before {
                width: 300px;
                height: 300px;
              }
              
              .gold-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 25px rgba(212,175,55,0.4);
              }
              
              .outline-button {
                background: transparent;
                border: 2px solid #d4af37;
                color: #d4af37;
                transition: all 0.3s ease;
              }
              
              .outline-button:hover {
                background: #d4af37;
                color: white;
                transform: translateY(-2px);
              }
              
              .warm-gradient {
                background: linear-gradient(135deg, #8b4513 0%, #a0522d 50%, #cd853f 100%);
              }
              
              .menu-icon {
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #d4af37, #f4d03f);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 1.5rem;
                font-size: 2rem;
                color: white;
                box-shadow: 0 10px 30px rgba(212,175,55,0.3);
              }
            </style>
            
            <section style="font-family: 'Crimson Text', 'Times New Roman', serif; background: linear-gradient(135deg, #2c1810 0%, #3d2817 50%, #4a2c1a 100%); color: #f5f5dc; min-height: 100vh;">
              <!-- Navigation -->
              <nav style="position: fixed; top: 0; width: 100%; z-index: 1000; padding: 1.5rem 0; background: rgba(44,24,16,0.95); backdrop-filter: blur(20px); box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
                <div style="max-width: 1200px; margin: 0 auto; padding: 0 2rem; display: flex; justify-content: space-between; align-items: center;">
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #d4af37, #f4d03f); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #2c1810; font-weight: bold; font-size: 1.2rem;">🍽️</div>
                    <div style="font-size: 1.8rem; font-weight: 700; color: #d4af37; letter-spacing: 1px;">Bella Vista</div>
                  </div>
                  <div class="nav-menu" style="display: flex; gap: 2.5rem; align-items: center;">
                    <a href="#menu" style="color: #f5f5dc; text-decoration: none; font-size: 1rem; font-weight: 500; letter-spacing: 1px; transition: color 0.3s ease;">Menu</a>
                    <a href="#about" style="color: #f5f5dc; text-decoration: none; font-size: 1rem; font-weight: 500; letter-spacing: 1px; transition: color 0.3s ease;">About</a>
                    <a href="#chefs" style="color: #f5f5dc; text-decoration: none; font-size: 1rem; font-weight: 500; letter-spacing: 1px; transition: color 0.3s ease;">Chefs</a>
                    <a href="#contact" style="color: #f5f5dc; text-decoration: none; font-size: 1rem; font-weight: 500; letter-spacing: 1px; transition: color 0.3s ease;">Contact</a>
                    <button class="gold-button" style="padding: 0.8rem 2rem; border: none; border-radius: 25px; color: #2c1810; font-weight: 600; cursor: pointer;">
                      Reserve Table
                    </button>
                  </div>
                </div>
              </nav>
              
              <!-- Hero Section -->
              <section class="restaurant-hero-section" style="padding: 8rem 2rem 6rem; text-align: center; position: relative; overflow: hidden;">
                <div style="position: absolute; top: 20%; right: 10%; width: 300px; height: 300px; background: radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 70%); border-radius: 50%;"></div>
                <div style="position: absolute; bottom: 20%; left: 10%; width: 250px; height: 250px; background: radial-gradient(circle, rgba(244,208,63,0.1) 0%, transparent 70%); border-radius: 50%;"></div>
                
                <div class="animate-fade-up" style="position: relative; z-index: 2;">
                  <h1 class="hero-title" style="font-size: 4rem; font-weight: 300; margin-bottom: 1rem; color: #f5f5dc; line-height: 1.15; letter-spacing: 2px;">
                    Experience <span style="color:#d4af37;font-weight:500;">Fine Dining</span>
                  </h1>
                  <p class="hero-subtitle" style="font-size: 1.25rem; max-width: 760px; margin: 0 auto 2.25rem; color: #d2b48c; line-height: 1.7; font-weight: 300;">
                    Authentic Italian flavors, crafted with passion and served with elegance.
                  </p>
                  <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button class="gold-button" style="padding: 1rem 2.5rem; border: none; border-radius: 999px; color: #2c1810; font-size: 1.05rem; font-weight: 700; cursor: pointer; box-shadow: 0 10px 30px rgba(212,175,55,0.35);">
                      Reserve Table
                    </button>
                  </div>
                </div>
              </section>
              
              <!-- Featured Menu Section -->
              <section id="menu" style="padding: 6rem 2rem; background: linear-gradient(180deg, #3d2817 0%, #2c1810 100%);">
                <div style="max-width: 1200px; margin: 0 auto;">
                  <div style="text-align: center; margin-bottom: 4rem;">
                    <div style="color: #d4af37; font-size: 1rem; font-weight: 600; letter-spacing: 3px; margin-bottom: 1rem; text-transform: uppercase;">Our Signature</div>
                    <h2 style="font-size: 3.5rem; font-weight: 300; margin-bottom: 1rem; color: #f5f5dc; letter-spacing: 2px;">Featured Dishes</h2>
                    <div style="width: 80px; height: 2px; background: linear-gradient(90deg, #d4af37, #f4d03f); margin: 0 auto;"></div>
                  </div>
                  
                  <div class="menu-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 3rem;">
                    <div class="restaurant-card" style="background: linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(244,208,63,0.05) 100%); padding: 3rem; text-align: center; border-radius: 20px; border: 1px solid rgba(212,175,55,0.2);">
                      <div class="menu-icon animate-pulse">🍝</div>
                      <h3 style="font-size: 1.8rem; font-weight: 400; margin-bottom: 1rem; color: #d4af37; letter-spacing: 1px;">Pasta Carbonara</h3>
                      <p style="color: #d2b48c; line-height: 1.6; margin-bottom: 2rem; font-size: 1.1rem;">Traditional Roman pasta with eggs, pecorino cheese, pancetta, and black pepper.</p>
                      <div style="font-size: 1.5rem; font-weight: 600; color: #d4af37; margin-bottom: 1.5rem;">$24</div>
                      <button class="outline-button" style="padding: 0.8rem 2rem; border-radius: 25px; font-weight: 500; cursor: pointer;">
                        Order Now
                      </button>
                    </div>
                    
                    <div class="restaurant-card" style="background: linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(244,208,63,0.05) 100%); padding: 3rem; text-align: center; border-radius: 20px; border: 1px solid rgba(212,175,55,0.2);">
                      <div class="menu-icon animate-float">🥩</div>
                      <h3 style="font-size: 1.8rem; font-weight: 400; margin-bottom: 1rem; color: #d4af37; letter-spacing: 1px;">Osso Buco</h3>
                      <p style="color: #d2b48c; line-height: 1.6; margin-bottom: 2rem; font-size: 1.1rem;">Braised veal shanks with vegetables, white wine, and aromatic herbs, served with risotto.</p>
                      <div style="font-size: 1.5rem; font-weight: 600; color: #d4af37; margin-bottom: 1.5rem;">$38</div>
                      <button class="outline-button" style="padding: 0.8rem 2rem; border-radius: 25px; font-weight: 500; cursor: pointer;">
                        Order Now
                      </button>
                    </div>
                    
                    <div class="restaurant-card" style="background: linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(244,208,63,0.05) 100%); padding: 3rem; text-align: center; border-radius: 20px; border: 1px solid rgba(212,175,55,0.2);">
                      <div class="menu-icon animate-pulse">🍕</div>
                      <h3 style="font-size: 1.8rem; font-weight: 400; margin-bottom: 1rem; color: #d4af37; letter-spacing: 1px;">Margherita Pizza</h3>
                      <p style="color: #d2b48c; line-height: 1.6; margin-bottom: 2rem; font-size: 1.1rem;">Classic Neapolitan pizza with San Marzano tomatoes, mozzarella di bufala, and fresh basil.</p>
                      <div style="font-size: 1.5rem; font-weight: 600; color: #d4af37; margin-bottom: 1.5rem;">$18</div>
                      <button class="outline-button" style="padding: 0.8rem 2rem; border-radius: 25px; font-weight: 500; cursor: pointer;">
                        Order Now
                      </button>
                    </div>
                  </div>
                </div>
              </section>
              
              <!-- Chefs Section -->
              <section id="chefs" style="padding: 6rem 2rem; background: #2c1810;">
                <div style="max-width: 1200px; margin: 0 auto;">
                  <div style="text-align: center; margin-bottom: 4rem;">
                    <div style="color: #d4af37; font-size: 1rem; font-weight: 600; letter-spacing: 3px; margin-bottom: 1rem; text-transform: uppercase;">Meet Our</div>
                    <h2 style="font-size: 3.5rem; font-weight: 300; margin-bottom: 1rem; color: #f5f5dc; letter-spacing: 2px;">Master Chefs</h2>
                    <div style="width: 80px; height: 2px; background: linear-gradient(90deg, #d4af37, #f4d03f); margin: 0 auto;"></div>
                  </div>
                  
                  <div class="chef-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 3rem;">
                    <div class="animate-slide-left" style="text-align: center;">
                      <div style="width: 150px; height: 150px; margin: 0 auto 2rem; background: linear-gradient(135deg, #d4af37, #f4d03f); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 4rem;">👨‍🍳</div>
                      <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem; color: #d4af37;">Chef Marco</h3>
                      <p style="color: #d2b48c; line-height: 1.6; margin-bottom: 1rem;">Head Chef</p>
                      <p style="color: #d2b48c; line-height: 1.6;">20+ years of experience in traditional Italian cuisine, trained in Tuscany.</p>
                    </div>
                    
                    <div class="animate-fade-up" style="text-align: center;">
                      <div style="width: 150px; height: 150px; margin: 0 auto 2rem; background: linear-gradient(135deg, #d4af37, #f4d03f); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 4rem;">👩‍🍳</div>
                      <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem; color: #d4af37;">Chef Sofia</h3>
                      <p style="color: #d2b48c; line-height: 1.6; margin-bottom: 1rem;">Pastry Chef</p>
                      <p style="color: #d2b48c; line-height: 1.6;">Specializes in authentic Italian desserts and artisanal bread making.</p>
                    </div>
                    
                    <div class="animate-slide-right" style="text-align: center;">
                      <div style="width: 150px; height: 150px; margin: 0 auto 2rem; background: linear-gradient(135deg, #d4af37, #f4d03f); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 4rem;">👨‍🍳</div>
                      <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem; color: #d4af37;">Chef Antonio</h3>
                      <p style="color: #d2b48c; line-height: 1.6; margin-bottom: 1rem;">Sous Chef</p>
                      <p style="color: #d2b48c; line-height: 1.6;">Expert in seafood and wine pairings, bringing coastal Italian flavors to our menu.</p>
                    </div>
                  </div>
                </div>
              </section>
              
              <!-- Contact Section -->
              <section id="contact" style="padding: 6rem 2rem; background: linear-gradient(135deg, #3d2817 0%, #2c1810 100%);">
                <div style="max-width: 1000px; margin: 0 auto;">
                  <div style="text-align: center; margin-bottom: 4rem;">
                    <div style="color: #d4af37; font-size: 1rem; font-weight: 600; letter-spacing: 3px; margin-bottom: 1rem; text-transform: uppercase;">Reservations</div>
                    <h2 style="font-size: 3.5rem; font-weight: 300; margin-bottom: 1rem; color: #f5f5dc; letter-spacing: 2px;">Book Your Table</h2>
                    <p style="color: #d2b48c; font-size: 1.2rem; line-height: 1.6;">
                      Experience fine dining in an intimate atmosphere. Reserve your table for an unforgettable culinary journey.
                    </p>
                  </div>
                  
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start;">
                    <div>
                      <div style="display: grid; gap: 2rem;">
                        <div style="display: flex; align-items: center; gap: 1rem; padding: 2rem; background: rgba(212,175,55,0.1); border-radius: 15px; border: 1px solid rgba(212,175,55,0.2);">
                          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #d4af37, #f4d03f); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #2c1810; font-size: 1.5rem;">📍</div>
                          <div>
                            <h4 style="font-weight: 600; margin-bottom: 0.5rem; color: #d4af37; font-size: 1.2rem;">Address</h4>
                            <p style="color: #d2b48c;">123 Via Roma<br/>Little Italy, NY 10013</p>
                          </div>
                        </div>
                        
                        <div style="display: flex; align-items: center; gap: 1rem; padding: 2rem; background: rgba(212,175,55,0.1); border-radius: 15px; border: 1px solid rgba(212,175,55,0.2);">
                          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #d4af37, #f4d03f); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #2c1810; font-size: 1.5rem;">📞</div>
                          <div>
                            <h4 style="font-weight: 600; margin-bottom: 0.5rem; color: #d4af37; font-size: 1.2rem;">Phone</h4>
                            <p style="color: #d2b48c;">(555) 123-BELLA<br/>Reservations: (555) 123-TABLE</p>
                          </div>
                        </div>
                        
                        <div style="display: flex; align-items: center; gap: 1rem; padding: 2rem; background: rgba(212,175,55,0.1); border-radius: 15px; border: 1px solid rgba(212,175,55,0.2);">
                          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #d4af37, #f4d03f); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #2c1810; font-size: 1.5rem;">🕒</div>
                          <div>
                            <h4 style="font-weight: 600; margin-bottom: 0.5rem; color: #d4af37; font-size: 1.2rem;">Hours</h4>
                            <p style="color: #d2b48c;">Mon-Thu: 5:00 PM - 10:00 PM<br/>Fri-Sun: 5:00 PM - 11:00 PM</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div style="background: rgba(212,175,55,0.1); padding: 3rem; border-radius: 20px; border: 1px solid rgba(212,175,55,0.2);">
                      <h3 style="font-size: 1.8rem; font-weight: 600; margin-bottom: 2rem; color: #d4af37; text-align: center;">Make a Reservation</h3>
                      <form onsubmit="event.preventDefault(); alert('Thank you! Your reservation has been confirmed. We will contact you soon.');" style="display: flex; flex-direction: column; gap: 1.5rem;">
                        <input type="text" placeholder="Full Name" required style="padding: 1.2rem; border: 2px solid rgba(212,175,55,0.3); border-radius: 10px; font-size: 1rem; background: rgba(44,24,16,0.5); color: #f5f5dc; transition: border-color 0.3s ease;" onfocus="this.style.borderColor='#d4af37';" onblur="this.style.borderColor='rgba(212,175,55,0.3)';" />
                        <input type="email" placeholder="Email Address" required style="padding: 1.2rem; border: 2px solid rgba(212,175,55,0.3); border-radius: 10px; font-size: 1rem; background: rgba(44,24,16,0.5); color: #f5f5dc; transition: border-color 0.3s ease;" onfocus="this.style.borderColor='#d4af37';" onblur="this.style.borderColor='rgba(212,175,55,0.3)';" />
                        <input type="tel" placeholder="Phone Number" required style="padding: 1.2rem; border: 2px solid rgba(212,175,55,0.3); border-radius: 10px; font-size: 1rem; background: rgba(44,24,16,0.5); color: #f5f5dc; transition: border-color 0.3s ease;" onfocus="this.style.borderColor='#d4af37';" onblur="this.style.borderColor='rgba(212,175,55,0.3)';" />
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                          <input type="date" required style="padding: 1.2rem; border: 2px solid rgba(212,175,55,0.3); border-radius: 10px; font-size: 1rem; background: rgba(44,24,16,0.5); color: #f5f5dc; transition: border-color 0.3s ease;" onfocus="this.style.borderColor='#d4af37';" onblur="this.style.borderColor='rgba(212,175,55,0.3)';" />
                          <select required style="padding: 1.2rem; border: 2px solid rgba(212,175,55,0.3); border-radius: 10px; font-size: 1rem; background: rgba(44,24,16,0.5); color: #f5f5dc; transition: border-color 0.3s ease;" onfocus="this.style.borderColor='#d4af37';" onblur="this.style.borderColor='rgba(212,175,55,0.3)';">
                            <option value="">Select Time</option>
                            <option value="17:00">5:00 PM</option>
                            <option value="17:30">5:30 PM</option>
                            <option value="18:00">6:00 PM</option>
                            <option value="18:30">6:30 PM</option>
                            <option value="19:00">7:00 PM</option>
                            <option value="19:30">7:30 PM</option>
                            <option value="20:00">8:00 PM</option>
                            <option value="20:30">8:30 PM</option>
                            <option value="21:00">9:00 PM</option>
                            <option value="21:30">9:30 PM</option>
                            <option value="22:00">10:00 PM</option>
                          </select>
                        </div>
                        <select required style="padding: 1.2rem; border: 2px solid rgba(212,175,55,0.3); border-radius: 10px; font-size: 1rem; background: rgba(44,24,16,0.5); color: #f5f5dc; transition: border-color 0.3s ease;" onfocus="this.style.borderColor='#d4af37';" onblur="this.style.borderColor='rgba(212,175,55,0.3)';">
                          <option value="">Party Size</option>
                          <option value="1">1 Person</option>
                          <option value="2">2 People</option>
                          <option value="3">3 People</option>
                          <option value="4">4 People</option>
                          <option value="5">5 People</option>
                          <option value="6">6 People</option>
                          <option value="7">7 People</option>
                          <option value="8">8 People</option>
                        </select>
                        <textarea placeholder="Special Requests" rows="3" style="padding: 1.2rem; border: 2px solid rgba(212,175,55,0.3); border-radius: 10px; font-size: 1rem; background: rgba(44,24,16,0.5); color: #f5f5dc; resize: vertical; transition: border-color 0.3s ease;" onfocus="this.style.borderColor='#d4af37';" onblur="this.style.borderColor='rgba(212,175,55,0.3)';"></textarea>
                        <button type="submit" class="gold-button" style="padding: 1.2rem 2rem; border: none; border-radius: 10px; color: #2c1810; font-size: 1.1rem; font-weight: 600; cursor: pointer;">
                          Reserve Table
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </section>
              
              <!-- Footer -->
              <footer style="padding: 3rem 2rem 2rem; background: #1a0f0a; border-top: 1px solid rgba(212,175,55,0.2);">
                <div style="max-width: 1200px; margin: 0 auto;">
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 3rem; margin-bottom: 2rem;">
                    <div>
                      <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #d4af37, #f4d03f); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #2c1810; font-weight: bold; font-size: 1.2rem;">🍽️</div>
                        <div style="font-size: 1.8rem; font-weight: 700; color: #d4af37; letter-spacing: 1px;">Bella Vista</div>
                      </div>
                      <p style="color: #d2b48c; line-height: 1.6; margin-bottom: 1rem;">
                        Authentic Italian cuisine served with passion and tradition in the heart of the city.
                      </p>
                    </div>
                    
                    <div>
                      <h4 style="font-size: 1.3rem; font-weight: 600; margin-bottom: 1rem; color: #d4af37;">Quick Links</h4>
                      <ul style="list-style: none; padding: 0;">
                        <li style="margin-bottom: 0.5rem;"><a href="#menu" style="color: #d2b48c; text-decoration: none; transition: color 0.3s ease;">Our Menu</a></li>
                        <li style="margin-bottom: 0.5rem;"><a href="#about" style="color: #d2b48c; text-decoration: none; transition: color 0.3s ease;">About Us</a></li>
                        <li style="margin-bottom: 0.5rem;"><a href="#chefs" style="color: #d2b48c; text-decoration: none; transition: color 0.3s ease;">Our Chefs</a></li>
                        <li style="margin-bottom: 0.5rem;"><a href="#contact" style="color: #d2b48c; text-decoration: none; transition: color 0.3s ease;">Reservations</a></li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 style="font-size: 1.3rem; font-weight: 600; margin-bottom: 1rem; color: #d4af37;">Contact Info</h4>
                      <p style="color: #d2b48c; margin-bottom: 0.5rem;">📞 (555) 123-BELLA</p>
                      <p style="color: #d2b48c; margin-bottom: 0.5rem;">✉️ info@bellavista.com</p>
                      <p style="color: #d2b48c;">📍 123 Via Roma, Little Italy</p>
                    </div>
                  </div>
                  
                  <div style="border-top: 1px solid rgba(212,175,55,0.2); padding-top: 2rem; text-align: center; color: #d2b48c;">
                    <p>&copy; 2025 Bella Vista Restaurant. All rights reserved. | Privacy Policy | Terms of Service</p>
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
    id: "fitness-center",
    name: "FitnessCenter",
    data: {
      pages: [
        {
          name: "Home",
          component: `
            <style>
              /* Responsive adjustments */
              @media (max-width: 900px) {
                .fitness-hero-section {
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
                .trainer-grid {
                  grid-template-columns: 1fr !important;
                }
              }
              @media (max-width: 600px) {
                .fitness-hero-section {
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
                .trainer-grid {
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
              
              @keyframes slideInRight {
                from { opacity: 0; transform: translateX(30px); }
                to { opacity: 1; transform: translateX(0); }
              }
              
              @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
              }
              
              @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                60% { transform: translateY(-5px); }
              }
              
              .animate-fade-up { animation: fadeInUp 0.8s ease-out; }
              .animate-slide-left { animation: slideInLeft 0.8s ease-out; }
              .animate-slide-right { animation: slideInRight 0.8s ease-out; }
              .animate-pulse { animation: pulse 2s ease-in-out infinite; }
              .animate-bounce { animation: bounce 2s ease-in-out infinite; }
              
              .fitness-card {
                transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                position: relative;
                overflow: hidden;
              }
              
              .fitness-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #ff6b35, #f7931e);
                transform: scaleX(0);
                transition: transform 0.3s ease;
              }
              
              .fitness-card:hover::before {
                transform: scaleX(1);
              }
              
              .fitness-card:hover {
                transform: translateY(-8px);
                box-shadow: 0 25px 50px rgba(255,107,53,0.2);
              }
              
              .orange-button {
                background: linear-gradient(135deg, #ff6b35, #f7931e);
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
              }
              
              .orange-button::before {
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
              
              .orange-button:hover::before {
                width: 300px;
                height: 300px;
              }
              
              .orange-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 25px rgba(255,107,53,0.4);
              }
              
              .outline-button {
                background: transparent;
                border: 2px solid #ff6b35;
                color: #ff6b35;
                transition: all 0.3s ease;
              }
              
              .outline-button:hover {
                background: #ff6b35;
                color: white;
                transform: translateY(-2px);
              }
              
              .energy-gradient {
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
              }
              
              .fitness-icon {
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #ff6b35, #f7931e);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 1.5rem;
                font-size: 2rem;
                color: white;
                box-shadow: 0 10px 30px rgba(255,107,53,0.3);
              }
            </style>
            
            <section style="font-family: 'Montserrat', 'Arial', sans-serif; background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%); color: #ffffff; min-height: 100vh;">
              <!-- Navigation -->
              <nav style="position: fixed; top: 0; width: 100%; z-index: 1000; padding: 1.5rem 0; background: rgba(15,15,35,0.95); backdrop-filter: blur(20px); box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
                <div style="max-width: 1200px; margin: 0 auto; padding: 0 2rem; display: flex; justify-content: space-between; align-items: center;">
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #ff6b35, #f7931e); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.2rem;">💪</div>
                    <div style="font-size: 1.8rem; font-weight: 700; color: #ff6b35; letter-spacing: 1px;">POWER GYM</div>
                  </div>
                  <div class="nav-menu" style="display: flex; gap: 2.5rem; align-items: center;">
                    <a href="#services" style="color: #ffffff; text-decoration: none; font-size: 1rem; font-weight: 500; letter-spacing: 1px; transition: color 0.3s ease;">Services</a>
                    <a href="#trainers" style="color: #ffffff; text-decoration: none; font-size: 1rem; font-weight: 500; letter-spacing: 1px; transition: color 0.3s ease;">Trainers</a>
                    <a href="#pricing" style="color: #ffffff; text-decoration: none; font-size: 1rem; font-weight: 500; letter-spacing: 1px; transition: color 0.3s ease;">Pricing</a>
                    <a href="#contact" style="color: #ffffff; text-decoration: none; font-size: 1rem; font-weight: 500; letter-spacing: 1px; transition: color 0.3s ease;">Contact</a>
                    <button class="orange-button" style="padding: 0.8rem 2rem; border: none; border-radius: 25px; color: white; font-weight: 600; cursor: pointer;">
                      Join Now
                    </button>
                  </div>
                </div>
              </nav>
              
              <!-- Hero Section -->
              <section class="fitness-hero-section" style="padding: 8rem 2rem 6rem; text-align: center; position: relative; overflow: hidden;">
                <div style="position: absolute; top: 20%; right: 10%; width: 300px; height: 300px; background: radial-gradient(circle, rgba(255,107,53,0.1) 0%, transparent 70%); border-radius: 50%;"></div>
                <div style="position: absolute; bottom: 20%; left: 10%; width: 250px; height: 250px; background: radial-gradient(circle, rgba(247,147,30,0.1) 0%, transparent 70%); border-radius: 50%;"></div>
                
                <div class="animate-fade-up" style="position: relative; z-index: 2;">
                  <h1 class="hero-title" style="font-size: 4.25rem; font-weight: 800; margin-bottom: 1rem; color: #ffffff; line-height: 1.15; letter-spacing: 2px;">
                    Transform <span style="color:#ff6b35; font-weight:800;">Your Body</span>
                  </h1>
                  <p class="hero-subtitle" style="font-size: 1.25rem; max-width: 760px; margin: 0 auto 2.25rem; color: #cbd5e1; line-height: 1.7; font-weight: 300;">
                    Train smarter with elite coaching and performance-focused programs.
                  </p>
                  <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button class="orange-button" style="padding: 1rem 2.5rem; border: none; border-radius: 999px; color: white; font-size: 1.05rem; font-weight: 700; cursor: pointer; box-shadow: 0 10px 30px rgba(255,107,53,0.35);">
                      Start Training
                    </button>
                  </div>
                </div>
              </section>
              
              <!-- Services Section -->
              <section id="services" style="padding: 6rem 2rem; background: linear-gradient(180deg, #16213e 0%, #0f0f23 100%);">
                <div style="max-width: 1200px; margin: 0 auto;">
                  <div style="text-align: center; margin-bottom: 4rem;">
                    <div style="color: #ff6b35; font-size: 1rem; font-weight: 600; letter-spacing: 3px; margin-bottom: 1rem; text-transform: uppercase;">Our Services</div>
                    <h2 style="font-size: 3.5rem; font-weight: 700; margin-bottom: 1rem; color: #ffffff; letter-spacing: 2px;">FITNESS PROGRAMS</h2>
                    <div style="width: 80px; height: 3px; background: linear-gradient(90deg, #ff6b35, #f7931e); margin: 0 auto;"></div>
                  </div>
                  
                  <div class="services-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 3rem;">
                    <div class="fitness-card" style="background: linear-gradient(135deg, rgba(255,107,53,0.1) 0%, rgba(247,147,30,0.05) 100%); padding: 3rem; text-align: center; border-radius: 20px; border: 1px solid rgba(255,107,53,0.2);">
                      <div class="fitness-icon animate-pulse">🏋️‍♂️</div>
                      <h3 style="font-size: 1.8rem; font-weight: 600; margin-bottom: 1rem; color: #ff6b35; letter-spacing: 1px;">Weight Training</h3>
                      <p style="color: #cbd5e1; line-height: 1.6; margin-bottom: 2rem; font-size: 1.1rem;">Build strength and muscle with our comprehensive weight training programs and premium equipment.</p>
                      <div style="font-size: 1.5rem; font-weight: 600; color: #ff6b35; margin-bottom: 1.5rem;">$89/month</div>
                      <button class="outline-button" style="padding: 0.8rem 2rem; border-radius: 25px; font-weight: 500; cursor: pointer;">
                        Learn More
                      </button>
                    </div>
                    
                    <div class="fitness-card" style="background: linear-gradient(135deg, rgba(255,107,53,0.1) 0%, rgba(247,147,30,0.05) 100%); padding: 3rem; text-align: center; border-radius: 20px; border: 1px solid rgba(255,107,53,0.2);">
                      <div class="fitness-icon animate-bounce">🏃‍♂️</div>
                      <h3 style="font-size: 1.8rem; font-weight: 600; margin-bottom: 1rem; color: #ff6b35; letter-spacing: 1px;">Cardio Classes</h3>
                      <p style="color: #cbd5e1; line-height: 1.6; margin-bottom: 2rem; font-size: 1.1rem;">High-energy cardio workouts including HIIT, spinning, and dance fitness classes.</p>
                      <div style="font-size: 1.5rem; font-weight: 600; color: #ff6b35; margin-bottom: 1.5rem;">$79/month</div>
                      <button class="outline-button" style="padding: 0.8rem 2rem; border-radius: 25px; font-weight: 500; cursor: pointer;">
                        Learn More
                      </button>
                    </div>
                    
                    <div class="fitness-card" style="background: linear-gradient(135deg, rgba(255,107,53,0.1) 0%, rgba(247,147,30,0.05) 100%); padding: 3rem; text-align: center; border-radius: 20px; border: 1px solid rgba(255,107,53,0.2);">
                      <div class="fitness-icon animate-pulse">🧘‍♀️</div>
                      <h3 style="font-size: 1.8rem; font-weight: 600; margin-bottom: 1rem; color: #ff6b35; letter-spacing: 1px;">Yoga & Pilates</h3>
                      <p style="color: #cbd5e1; line-height: 1.6; margin-bottom: 2rem; font-size: 1.1rem;">Improve flexibility, balance, and mental wellness with our yoga and Pilates sessions.</p>
                      <div style="font-size: 1.5rem; font-weight: 600; color: #ff6b35; margin-bottom: 1.5rem;">$69/month</div>
                      <button class="outline-button" style="padding: 0.8rem 2rem; border-radius: 25px; font-weight: 500; cursor: pointer;">
                        Learn More
                      </button>
                    </div>
                    
                    <div class="fitness-card" style="background: linear-gradient(135deg, rgba(255,107,53,0.1) 0%, rgba(247,147,30,0.05) 100%); padding: 3rem; text-align: center; border-radius: 20px; border: 1px solid rgba(255,107,53,0.2);">
                      <div class="fitness-icon animate-bounce">🥊</div>
                      <h3 style="font-size: 1.8rem; font-weight: 600; margin-bottom: 1rem; color: #ff6b35; letter-spacing: 1px;">Martial Arts</h3>
                      <p style="color: #cbd5e1; line-height: 1.6; margin-bottom: 2rem; font-size: 1.1rem;">Learn self-defense and build confidence with our martial arts and boxing programs.</p>
                      <div style="font-size: 1.5rem; font-weight: 600; color: #ff6b35; margin-bottom: 1.5rem;">$99/month</div>
                      <button class="outline-button" style="padding: 0.8rem 2rem; border-radius: 25px; font-weight: 500; cursor: pointer;">
                        Learn More
                      </button>
                    </div>
                    
                    <div class="fitness-card" style="background: linear-gradient(135deg, rgba(255,107,53,0.1) 0%, rgba(247,147,30,0.05) 100%); padding: 3rem; text-align: center; border-radius: 20px; border: 1px solid rgba(255,107,53,0.2);">
                      <div class="fitness-icon animate-pulse">🏊‍♂️</div>
                      <h3 style="font-size: 1.8rem; font-weight: 600; margin-bottom: 1rem; color: #ff6b35; letter-spacing: 1px;">Swimming</h3>
                      <p style="color: #cbd5e1; line-height: 1.6; margin-bottom: 2rem; font-size: 1.1rem;">Full-body workout in our Olympic-size pool with professional swimming instructors.</p>
                      <div style="font-size: 1.5rem; font-weight: 600; color: #ff6b35; margin-bottom: 1.5rem;">$89/month</div>
                      <button class="outline-button" style="padding: 0.8rem 2rem; border-radius: 25px; font-weight: 500; cursor: pointer;">
                        Learn More
                      </button>
                    </div>
                    
                    <div class="fitness-card" style="background: linear-gradient(135deg, rgba(255,107,53,0.1) 0%, rgba(247,147,30,0.05) 100%); padding: 3rem; text-align: center; border-radius: 20px; border: 1px solid rgba(255,107,53,0.2);">
                      <div class="fitness-icon animate-bounce">👨‍⚕️</div>
                      <h3 style="font-size: 1.8rem; font-weight: 600; margin-bottom: 1rem; color: #ff6b35; letter-spacing: 1px;">Personal Training</h3>
                      <p style="color: #cbd5e1; line-height: 1.6; margin-bottom: 2rem; font-size: 1.1rem;">One-on-one training sessions with certified personal trainers for personalized fitness plans.</p>
                      <div style="font-size: 1.5rem; font-weight: 600; color: #ff6b35; margin-bottom: 1.5rem;">$150/session</div>
                      <button class="outline-button" style="padding: 0.8rem 2rem; border-radius: 25px; font-weight: 500; cursor: pointer;">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              </section>
              
              <!-- Trainers Section -->
              <section id="trainers" style="padding: 6rem 2rem; background: #0f0f23;">
                <div style="max-width: 1200px; margin: 0 auto;">
                  <div style="text-align: center; margin-bottom: 4rem;">
                    <div style="color: #ff6b35; font-size: 1rem; font-weight: 600; letter-spacing: 3px; margin-bottom: 1rem; text-transform: uppercase;">Meet Our</div>
                    <h2 style="font-size: 3.5rem; font-weight: 700; margin-bottom: 1rem; color: #ffffff; letter-spacing: 2px;">EXPERT TRAINERS</h2>
                    <div style="width: 80px; height: 3px; background: linear-gradient(90deg, #ff6b35, #f7931e); margin: 0 auto;"></div>
                  </div>
                  
                  <div class="trainer-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 3rem;">
                    <div class="animate-slide-left" style="text-align: center;">
                      <div style="width: 200px; height: 200px; margin: 0 auto 2rem; background: linear-gradient(135deg, #ff6b35, #f7931e); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 5rem;">💪</div>
                      <h3 style="font-size: 1.8rem; font-weight: 600; margin-bottom: 1rem; color: #ff6b35;">Mike Johnson</h3>
                      <p style="color: #cbd5e1; line-height: 1.6; margin-bottom: 1rem; font-size: 1.1rem;">Head Trainer</p>
                      <p style="color: #cbd5e1; line-height: 1.6;">Certified personal trainer with 10+ years experience in strength training and bodybuilding.</p>
                    </div>
                    
                    <div class="animate-fade-up" style="text-align: center;">
                      <div style="width: 200px; height: 200px; margin: 0 auto 2rem; background: linear-gradient(135deg, #ff6b35, #f7931e); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 5rem;">🏃‍♀️</div>
                      <h3 style="font-size: 1.8rem; font-weight: 600; margin-bottom: 1rem; color: #ff6b35;">Sarah Martinez</h3>
                      <p style="color: #cbd5e1; line-height: 1.6; margin-bottom: 1rem; font-size: 1.1rem;">Cardio Specialist</p>
                      <p style="color: #cbd5e1; line-height: 1.6;">Expert in HIIT, spinning, and functional fitness with a passion for helping clients achieve their goals.</p>
                    </div>
                    
                    <div class="animate-slide-right" style="text-align: center;">
                      <div style="width: 200px; height: 200px; margin: 0 auto 2rem; background: linear-gradient(135deg, #ff6b35, #f7931e); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 5rem;">🧘‍♂️</div>
                      <h3 style="font-size: 1.8rem; font-weight: 600; margin-bottom: 1rem; color: #ff6b35;">David Chen</h3>
                      <p style="color: #cbd5e1; line-height: 1.6; margin-bottom: 1rem; font-size: 1.1rem;">Yoga Instructor</p>
                      <p style="color: #cbd5e1; line-height: 1.6;">Certified yoga and Pilates instructor focused on mindfulness, flexibility, and holistic wellness.</p>
                    </div>
                  </div>
                </div>
              </section>
              
              <!-- Contact Section -->
              <section id="contact" style="padding: 6rem 2rem; background: linear-gradient(135deg, #16213e 0%, #0f0f23 100%);">
                <div style="max-width: 1000px; margin: 0 auto;">
                  <div style="text-align: center; margin-bottom: 4rem;">
                    <div style="color: #ff6b35; font-size: 1rem; font-weight: 600; letter-spacing: 3px; margin-bottom: 1rem; text-transform: uppercase;">Get Started</div>
                    <h2 style="font-size: 3.5rem; font-weight: 700; margin-bottom: 1rem; color: #ffffff; letter-spacing: 2px;">JOIN POWER GYM</h2>
                    <p style="color: #cbd5e1; font-size: 1.2rem; line-height: 1.6;">
                      Ready to transform your body and achieve your fitness goals? Join our community today!
                    </p>
                  </div>
                  
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start;">
                    <div>
                      <div style="display: grid; gap: 2rem;">
                        <div style="display: flex; align-items: center; gap: 1rem; padding: 2rem; background: rgba(255,107,53,0.1); border-radius: 15px; border: 1px solid rgba(255,107,53,0.2);">
                          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #ff6b35, #f7931e); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">📍</div>
                          <div>
                            <h4 style="font-weight: 600; margin-bottom: 0.5rem; color: #ff6b35; font-size: 1.2rem;">Address</h4>
                            <p style="color: #cbd5e1;">456 Fitness Avenue<br/>Sports District, SD 12345</p>
                          </div>
                        </div>
                        
                        <div style="display: flex; align-items: center; gap: 1rem; padding: 2rem; background: rgba(255,107,53,0.1); border-radius: 15px; border: 1px solid rgba(255,107,53,0.2);">
                          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #ff6b35, #f7931e); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">📞</div>
                          <div>
                            <h4 style="font-weight: 600; margin-bottom: 0.5rem; color: #ff6b35; font-size: 1.2rem;">Phone</h4>
                            <p style="color: #cbd5e1;">(555) 123-POWER<br/>Membership: (555) 123-JOIN</p>
                          </div>
                        </div>
                        
                        <div style="display: flex; align-items: center; gap: 1rem; padding: 2rem; background: rgba(255,107,53,0.1); border-radius: 15px; border: 1px solid rgba(255,107,53,0.2);">
                          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #ff6b35, #f7931e); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">🕒</div>
                          <div>
                            <h4 style="font-weight: 600; margin-bottom: 0.5rem; color: #ff6b35; font-size: 1.2rem;">Hours</h4>
                            <p style="color: #cbd5e1;">Mon-Fri: 5:00 AM - 11:00 PM<br/>Sat-Sun: 6:00 AM - 10:00 PM</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div style="background: rgba(255,107,53,0.1); padding: 3rem; border-radius: 20px; border: 1px solid rgba(255,107,53,0.2);">
                      <h3 style="font-size: 1.8rem; font-weight: 600; margin-bottom: 2rem; color: #ff6b35; text-align: center;">Start Your Journey</h3>
                      <form onsubmit="event.preventDefault(); alert('Thank you! We will contact you soon to schedule your free trial session.');" style="display: flex; flex-direction: column; gap: 1.5rem;">
                        <input type="text" placeholder="Full Name" required style="padding: 1.2rem; border: 2px solid rgba(255,107,53,0.3); border-radius: 10px; font-size: 1rem; background: rgba(15,15,35,0.5); color: #ffffff; transition: border-color 0.3s ease;" onfocus="this.style.borderColor='#ff6b35';" onblur="this.style.borderColor='rgba(255,107,53,0.3)';" />
                        <input type="email" placeholder="Email Address" required style="padding: 1.2rem; border: 2px solid rgba(255,107,53,0.3); border-radius: 10px; font-size: 1rem; background: rgba(15,15,35,0.5); color: #ffffff; transition: border-color 0.3s ease;" onfocus="this.style.borderColor='#ff6b35';" onblur="this.style.borderColor='rgba(255,107,53,0.3)';" />
                        <input type="tel" placeholder="Phone Number" required style="padding: 1.2rem; border: 2px solid rgba(255,107,53,0.3); border-radius: 10px; font-size: 1rem; background: rgba(15,15,35,0.5); color: #ffffff; transition: border-color 0.3s ease;" onfocus="this.style.borderColor='#ff6b35';" onblur="this.style.borderColor='rgba(255,107,53,0.3)';" />
                        <select required style="padding: 1.2rem; border: 2px solid rgba(255,107,53,0.3); border-radius: 10px; font-size: 1rem; background: rgba(15,15,35,0.5); color: #ffffff; transition: border-color 0.3s ease;" onfocus="this.style.borderColor='#ff6b35';" onblur="this.style.borderColor='rgba(255,107,53,0.3)';">
                          <option value="">Select Interest</option>
                          <option value="weight-training">Weight Training</option>
                          <option value="cardio">Cardio Classes</option>
                          <option value="yoga">Yoga & Pilates</option>
                          <option value="martial-arts">Martial Arts</option>
                          <option value="swimming">Swimming</option>
                          <option value="personal-training">Personal Training</option>
                        </select>
                        <textarea placeholder="Fitness Goals" rows="3" style="padding: 1.2rem; border: 2px solid rgba(255,107,53,0.3); border-radius: 10px; font-size: 1rem; background: rgba(15,15,35,0.5); color: #ffffff; resize: vertical; transition: border-color 0.3s ease;" onfocus="this.style.borderColor='#ff6b35';" onblur="this.style.borderColor='rgba(255,107,53,0.3)';"></textarea>
                        <button type="submit" class="orange-button" style="padding: 1.2rem 2rem; border: none; border-radius: 10px; color: white; font-size: 1.1rem; font-weight: 600; cursor: pointer;">
                          Get Free Trial
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </section>
              
              <!-- Footer -->
              <footer style="padding: 3rem 2rem 2rem; background: #0a0a1a; border-top: 1px solid rgba(255,107,53,0.2);">
                <div style="max-width: 1200px; margin: 0 auto;">
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 3rem; margin-bottom: 2rem;">
                    <div>
                      <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #ff6b35, #f7931e); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.2rem;">💪</div>
                        <div style="font-size: 1.8rem; font-weight: 700; color: #ff6b35; letter-spacing: 1px;">POWER GYM</div>
                      </div>
                      <p style="color: #cbd5e1; line-height: 1.6; margin-bottom: 1rem;">
                        Transform your body and mind with our state-of-the-art fitness facilities and expert trainers.
                      </p>
                    </div>
                    
                    <div>
                      <h4 style="font-size: 1.3rem; font-weight: 600; margin-bottom: 1rem; color: #ff6b35;">Quick Links</h4>
                      <ul style="list-style: none; padding: 0;">
                        <li style="margin-bottom: 0.5rem;"><a href="#services" style="color: #cbd5e1; text-decoration: none; transition: color 0.3s ease;">Our Services</a></li>
                        <li style="margin-bottom: 0.5rem;"><a href="#trainers" style="color: #cbd5e1; text-decoration: none; transition: color 0.3s ease;">Our Trainers</a></li>
                        <li style="margin-bottom: 0.5rem;"><a href="#pricing" style="color: #cbd5e1; text-decoration: none; transition: color 0.3s ease;">Membership</a></li>
                        <li style="margin-bottom: 0.5rem;"><a href="#contact" style="color: #cbd5e1; text-decoration: none; transition: color 0.3s ease;">Contact Us</a></li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 style="font-size: 1.3rem; font-weight: 600; margin-bottom: 1rem; color: #ff6b35;">Contact Info</h4>
                      <p style="color: #cbd5e1; margin-bottom: 0.5rem;">📞 (555) 123-POWER</p>
                      <p style="color: #cbd5e1; margin-bottom: 0.5rem;">✉️ info@powergym.com</p>
                      <p style="color: #cbd5e1;">📍 456 Fitness Avenue</p>
                    </div>
                  </div>
                  
                  <div style="border-top: 1px solid rgba(255,107,53,0.2); padding-top: 2rem; text-align: center; color: #cbd5e1;">
                    <p>&copy; 2025 Power Gym. All rights reserved. | Privacy Policy | Terms of Service</p>
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
    id: "edu-platform",
    name: "EduPlatform",
    data: {
      pages: [
        {
          name: "Home",
          component: `
            <style>
              @media (max-width: 900px) {
                .edu-hero-section { padding: 6rem 2rem 3rem !important; }
                .hero-title { font-size: 3rem !important; }
                .hero-subtitle { font-size: 1.2rem !important; }
                .course-grid { grid-template-columns: 1fr !important; }
              }
              @media (max-width: 600px) {
                .edu-hero-section { padding: 4rem 1rem 2rem !important; }
                .hero-title { font-size: 2rem !important; }
                .nav-menu { flex-direction: column !important; gap: 1rem !important; }
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
              .animate-fade-up { animation: fadeInUp 0.8s ease-out; }
              .animate-slide-left { animation: slideInLeft 0.8s ease-out; }
              .animate-pulse { animation: pulse 2s ease-in-out infinite; }
              .edu-card {
                transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                position: relative;
                overflow: hidden;
              }
              .edu-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(147,51,234,0.2), transparent);
                transition: left 0.5s ease;
              }
              .edu-card:hover::before { left: 100%; }
              .edu-card:hover {
                transform: translateY(-8px);
                box-shadow: 0 25px 50px rgba(147,51,234,0.3);
              }
              .purple-button {
                background: linear-gradient(135deg, #9333ea, #a855f7);
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
              }
              .purple-button::before {
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
              .purple-button:hover::before {
                width: 300px;
                height: 300px;
              }
              .purple-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 25px rgba(147,51,234,0.4);
              }
              .outline-button {
                background: transparent;
                border: 2px solid #9333ea;
                color: #9333ea;
                transition: all 0.3s ease;
              }
              .outline-button:hover {
                background: #9333ea;
                color: white;
                transform: translateY(-2px);
              }
              .edu-icon {
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #9333ea, #a855f7);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 1.5rem;
                font-size: 2rem;
                color: white;
                box-shadow: 0 10px 30px rgba(147,51,234,0.3);
              }
            </style>
            <section style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%); color: #ffffff; min-height: 100vh;">
              <nav style="position: fixed; top: 0; width: 100%; z-index: 1000; padding: 1.5rem 0; background: rgba(30,27,75,0.95); backdrop-filter: blur(20px); box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
                <div style="max-width: 1200px; margin: 0 auto; padding: 0 2rem; display: flex; justify-content: space-between; align-items: center;">
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #9333ea, #a855f7); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.2rem;">📚</div>
                    <div style="font-size: 1.8rem; font-weight: 700; color: #e9d5ff; letter-spacing: 1px;">EduPlatform</div>
                  </div>
                  <div class="nav-menu" style="display: flex; gap: 2.5rem; align-items: center;">
                    <a href="#courses" style="color: #e9d5ff; text-decoration: none; font-size: 1rem; font-weight: 500; transition: color 0.3s ease;">Courses</a>
                    <a href="#about" style="color: #e9d5ff; text-decoration: none; font-size: 1rem; font-weight: 500; transition: color 0.3s ease;">About</a>
                    <a href="#instructors" style="color: #e9d5ff; text-decoration: none; font-size: 1rem; font-weight: 500; transition: color 0.3s ease;">Instructors</a>
                    <a href="#contact" style="color: #e9d5ff; text-decoration: none; font-size: 1rem; font-weight: 500; transition: color 0.3s ease;">Contact</a>
                    <button class="purple-button" style="padding: 0.8rem 2rem; border: none; border-radius: 25px; color: white; font-weight: 600; cursor: pointer;">
                      Enroll Now
                    </button>
                  </div>
                </div>
              </nav>
              <section class="edu-hero-section" style="padding: 8rem 2rem 6rem; text-align: center; position: relative; overflow: hidden;">
                <div style="position: absolute; top: 20%; right: 10%; width: 300px; height: 300px; background: radial-gradient(circle, rgba(147,51,234,0.2) 0%, transparent 70%); border-radius: 50%; filter: blur(60px);"></div>
                <div style="position: absolute; bottom: 20%; left: 10%; width: 400px; height: 400px; background: radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%); border-radius: 50%; filter: blur(80px);"></div>
                <div class="animate-fade-up" style="position: relative; z-index: 2;">
                  <h1 class="hero-title" style="font-size: 4.5rem; font-weight: 900; margin-bottom: 1.5rem; background: linear-gradient(135deg, #fff, #e9d5ff, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1.2;">
                    Learn Without Limits<br/>Grow Without Boundaries
                  </h1>
                  <p class="hero-subtitle" style="font-size: 1.4rem; max-width: 700px; margin: 0 auto 3rem; color: #c4b5fd; line-height: 1.8;">
                    Transform your future with expert-led courses, hands-on projects, and a community of learners. Start your journey today.
                  </p>
                  <div style="display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap;">
                    <button class="purple-button" style="padding: 1.2rem 3rem; border: none; border-radius: 50px; color: white; font-size: 1.2rem; font-weight: 700; cursor: pointer; box-shadow: 0 10px 30px rgba(147,51,234,0.35);">
                      Explore Courses
                    </button>
                    <button class="outline-button" style="padding: 1.2rem 3rem; border-radius: 50px; font-size: 1.2rem; font-weight: 700; cursor: pointer; border: 2px solid #9333ea; color: #e9d5ff;">
                      Free Trial
                    </button>
                  </div>
                </div>
                <div style="display: flex; gap: 4rem; margin-top: 5rem; flex-wrap: wrap; justify-content: center; z-index: 1;">
                  <div class="animate-slide-left" style="text-align: center;">
                    <div style="font-size: 3rem; font-weight: 900; color: #c084fc;">10K+</div>
                    <div style="font-size: 1rem; color: #c4b5fd; margin-top: 0.5rem;">Active Students</div>
                  </div>
                  <div class="animate-fade-up" style="text-align: center;">
                    <div style="font-size: 3rem; font-weight: 900; color: #c084fc;">500+</div>
                    <div style="font-size: 1rem; color: #c4b5fd; margin-top: 0.5rem;">Expert Courses</div>
                  </div>
                  <div class="animate-fade-up" style="text-align: center;">
                    <div style="font-size: 3rem; font-weight: 900; color: #c084fc;">95%</div>
                    <div style="font-size: 1rem; color: #c4b5fd; margin-top: 0.5rem;">Success Rate</div>
                  </div>
                  <div class="animate-slide-left" style="text-align: center;">
                    <div style="font-size: 3rem; font-weight: 900; color: #c084fc;">24/7</div>
                    <div style="font-size: 1rem; color: #c4b5fd; margin-top: 0.5rem;">Support</div>
                  </div>
                </div>
              </section>
              <section id="courses" style="padding: 6rem 2rem; background: linear-gradient(180deg, #312e81 0%, #1e1b4b 100%);">
                <div style="max-width: 1200px; margin: 0 auto;">
                  <div style="text-align: center; margin-bottom: 4rem;">
                    <div style="color: #c084fc; font-size: 1rem; font-weight: 600; letter-spacing: 2px; margin-bottom: 1rem; text-transform: uppercase;">Our Courses</div>
                    <h2 style="font-size: 3.5rem; font-weight: 800; margin-bottom: 1.5rem;">Featured Programs</h2>
                    <p style="font-size: 1.2rem; color: #c4b5fd; max-width: 600px; margin: 0 auto;">Hand-picked courses designed by industry experts</p>
                  </div>
                  <div class="course-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 3rem;">
                    <div class="edu-card" style="background: rgba(147,51,234,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(168,85,247,0.3); border-radius: 20px; padding: 3rem; text-align: center;">
                      <div class="edu-icon animate-pulse">💻</div>
                      <h3 style="font-size: 1.8rem; font-weight: 700; margin-bottom: 1rem; color: #e9d5ff;">Web Development</h3>
                      <p style="color: #c4b5fd; font-size: 1.1rem; line-height: 1.7; margin-bottom: 2rem;">Master modern web development with React, Node.js, and full-stack technologies.</p>
                      <div style="margin-bottom: 2rem;">
                        <span style="background: rgba(147,51,234,0.3); padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.9rem; color: #e9d5ff; margin-right: 0.5rem;">12 Weeks</span>
                        <span style="background: rgba(147,51,234,0.3); padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.9rem; color: #e9d5ff;">Beginner</span>
                      </div>
                      <div style="font-size: 1.5rem; font-weight: 700; color: #c084fc; margin-bottom: 1.5rem;">$299</div>
                      <button class="outline-button" style="padding: 0.8rem 2rem; border-radius: 25px; font-weight: 500; cursor: pointer;">
                        Enroll Now
                      </button>
                    </div>
                    <div class="edu-card" style="background: rgba(147,51,234,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(168,85,247,0.3); border-radius: 20px; padding: 3rem; text-align: center;">
                      <div class="edu-icon animate-pulse">📱</div>
                      <h3 style="font-size: 1.8rem; font-weight: 700; margin-bottom: 1rem; color: #e9d5ff;">Mobile Development</h3>
                      <p style="color: #c4b5fd; font-size: 1.1rem; line-height: 1.7; margin-bottom: 2rem;">Build native and cross-platform mobile apps with Flutter and React Native.</p>
                      <div style="margin-bottom: 2rem;">
                        <span style="background: rgba(147,51,234,0.3); padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.9rem; color: #e9d5ff; margin-right: 0.5rem;">10 Weeks</span>
                        <span style="background: rgba(147,51,234,0.3); padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.9rem; color: #e9d5ff;">Intermediate</span>
                      </div>
                      <div style="font-size: 1.5rem; font-weight: 700; color: #c084fc; margin-bottom: 1.5rem;">$349</div>
                      <button class="outline-button" style="padding: 0.8rem 2rem; border-radius: 25px; font-weight: 500; cursor: pointer;">
                        Enroll Now
                      </button>
                    </div>
                    <div class="edu-card" style="background: rgba(147,51,234,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(168,85,247,0.3); border-radius: 20px; padding: 3rem; text-align: center;">
                      <div class="edu-icon animate-pulse">🤖</div>
                      <h3 style="font-size: 1.8rem; font-weight: 700; margin-bottom: 1rem; color: #e9d5ff;">Data Science & AI</h3>
                      <p style="color: #c4b5fd; font-size: 1.1rem; line-height: 1.7; margin-bottom: 2rem;">Learn machine learning, data analysis, and AI with Python and TensorFlow.</p>
                      <div style="margin-bottom: 2rem;">
                        <span style="background: rgba(147,51,234,0.3); padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.9rem; color: #e9d5ff; margin-right: 0.5rem;">16 Weeks</span>
                        <span style="background: rgba(147,51,234,0.3); padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.9rem; color: #e9d5ff;">Advanced</span>
                      </div>
                      <div style="font-size: 1.5rem; font-weight: 700; color: #c084fc; margin-bottom: 1.5rem;">$449</div>
                      <button class="outline-button" style="padding: 0.8rem 2rem; border-radius: 25px; font-weight: 500; cursor: pointer;">
                        Enroll Now
                      </button>
                    </div>
                  </div>
                </div>
              </section>
              <section id="instructors" style="padding: 6rem 2rem; background: #1e1b4b;">
                <div style="max-width: 1200px; margin: 0 auto;">
                  <div style="text-align: center; margin-bottom: 4rem;">
                    <div style="color: #c084fc; font-size: 1rem; font-weight: 600; letter-spacing: 2px; margin-bottom: 1rem; text-transform: uppercase;">Meet Our</div>
                    <h2 style="font-size: 3.5rem; font-weight: 800; margin-bottom: 1.5rem;">Expert Instructors</h2>
                    <p style="font-size: 1.2rem; color: #c4b5fd; max-width: 600px; margin: 0 auto;">Learn from industry professionals with years of experience</p>
                  </div>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 3rem;">
                    <div class="edu-card" style="background: rgba(147,51,234,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(168,85,247,0.3); border-radius: 20px; padding: 2rem; text-align: center;">
                      <div style="width: 120px; height: 120px; margin: 0 auto 1.5rem; background: linear-gradient(135deg, #9333ea, #a855f7); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 3rem;">👨‍💻</div>
                      <h3 style="color: #fff; font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 700;">Alex Johnson</h3>
                      <div style="color: #c084fc; margin-bottom: 1rem; font-weight: 600;">Senior Developer</div>
                      <p style="color: #c4b5fd; line-height: 1.6;">15+ years in software development, former Google engineer.</p>
                    </div>
                    <div class="edu-card" style="background: rgba(147,51,234,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(168,85,247,0.3); border-radius: 20px; padding: 2rem; text-align: center;">
                      <div style="width: 120px; height: 120px; margin: 0 auto 1.5rem; background: linear-gradient(135deg, #a855f7, #c084fc); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 3rem;">👩‍💻</div>
                      <h3 style="color: #fff; font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 700;">Sarah Chen</h3>
                      <div style="color: #c084fc; margin-bottom: 1rem; font-weight: 600;">Data Scientist</div>
                      <p style="color: #c4b5fd; line-height: 1.6;">AI researcher with published papers in machine learning.</p>
                    </div>
                    <div class="edu-card" style="background: rgba(147,51,234,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(168,85,247,0.3); border-radius: 20px; padding: 2rem; text-align: center;">
                      <div style="width: 120px; height: 120px; margin: 0 auto 1.5rem; background: linear-gradient(135deg, #9333ea, #a855f7); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 3rem;">👨‍🎓</div>
                      <h3 style="color: #fff; font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 700;">Michael Park</h3>
                      <div style="color: #c084fc; margin-bottom: 1rem; font-weight: 600;">Mobile Expert</div>
                      <p style="color: #c4b5fd; line-height: 1.6;">Creator of award-winning mobile applications.</p>
                    </div>
                  </div>
                </div>
              </section>
              <section id="contact" style="padding: 6rem 2rem; background: linear-gradient(135deg, #312e81 0%, #1e1b4b 100%);">
                <div style="max-width: 1000px; margin: 0 auto;">
                  <div style="text-align: center; margin-bottom: 4rem;">
                    <div style="color: #c084fc; font-size: 1rem; font-weight: 600; letter-spacing: 2px; margin-bottom: 1rem; text-transform: uppercase;">Get In Touch</div>
                    <h2 style="font-size: 3.5rem; font-weight: 800; margin-bottom: 1rem;">Start Your Learning Journey</h2>
                    <p style="color: #c4b5fd; font-size: 1.2rem; line-height: 1.6;">Have questions? We're here to help you succeed.</p>
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start;">
                    <div>
                      <div style="display: grid; gap: 2rem;">
                        <div style="display: flex; align-items: center; gap: 1rem; padding: 2rem; background: rgba(147,51,234,0.1); border-radius: 15px; border: 1px solid rgba(168,85,247,0.3);">
                          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #9333ea, #a855f7); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">📍</div>
                          <div>
                            <h4 style="font-weight: 600; margin-bottom: 0.5rem; color: #e9d5ff; font-size: 1.2rem;">Address</h4>
                            <p style="color: #c4b5fd;">123 Education Street<br/>Learning City, LC 12345</p>
                          </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 1rem; padding: 2rem; background: rgba(147,51,234,0.1); border-radius: 15px; border: 1px solid rgba(168,85,247,0.3);">
                          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #9333ea, #a855f7); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">📞</div>
                          <div>
                            <h4 style="font-weight: 600; margin-bottom: 0.5rem; color: #e9d5ff; font-size: 1.2rem;">Phone</h4>
                            <p style="color: #c4b5fd;">(555) 123-LEARN<br/>Support: (555) 123-HELP</p>
                          </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 1rem; padding: 2rem; background: rgba(147,51,234,0.1); border-radius: 15px; border: 1px solid rgba(168,85,247,0.3);">
                          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #9333ea, #a855f7); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">✉️</div>
                          <div>
                            <h4 style="font-weight: 600; margin-bottom: 0.5rem; color: #e9d5ff; font-size: 1.2rem;">Email</h4>
                            <p style="color: #c4b5fd;">info@eduplatform.com<br/>support@eduplatform.com</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style="background: rgba(147,51,234,0.1); backdrop-filter: blur(10px); padding: 3rem; border-radius: 20px; border: 1px solid rgba(168,85,247,0.3);">
                      <h3 style="font-size: 1.8rem; font-weight: 600; margin-bottom: 2rem; color: #e9d5ff; text-align: center;">Contact Us</h3>
                      <form onsubmit="event.preventDefault(); alert('Thank you! We will contact you soon.');" style="display: flex; flex-direction: column; gap: 1.5rem;">
                        <input type="text" placeholder="Full Name" required style="padding: 1.2rem; border: 2px solid rgba(168,85,247,0.3); border-radius: 10px; font-size: 1rem; background: rgba(30,27,75,0.5); color: #e9d5ff; transition: border-color 0.3s ease;" onfocus="this.style.borderColor='#9333ea';" onblur="this.style.borderColor='rgba(168,85,247,0.3)';" />
                        <input type="email" placeholder="Email Address" required style="padding: 1.2rem; border: 2px solid rgba(168,85,247,0.3); border-radius: 10px; font-size: 1rem; background: rgba(30,27,75,0.5); color: #e9d5ff; transition: border-color 0.3s ease;" onfocus="this.style.borderColor='#9333ea';" onblur="this.style.borderColor='rgba(168,85,247,0.3)';" />
                        <textarea placeholder="Message" rows="4" style="padding: 1.2rem; border: 2px solid rgba(168,85,247,0.3); border-radius: 10px; font-size: 1rem; background: rgba(30,27,75,0.5); color: #e9d5ff; resize: vertical; transition: border-color 0.3s ease;" onfocus="this.style.borderColor='#9333ea';" onblur="this.style.borderColor='rgba(168,85,247,0.3)';"></textarea>
                        <button type="submit" class="purple-button" style="padding: 1.2rem 2rem; border: none; border-radius: 10px; color: white; font-size: 1.1rem; font-weight: 600; cursor: pointer;">
                          Send Message
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </section>
              <footer style="padding: 3rem 2rem 2rem; background: #1e1b4b; border-top: 1px solid rgba(168,85,247,0.3);">
                <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
                  <div style="font-size: 2rem; font-weight: 700; color: #e9d5ff; margin-bottom: 1rem; letter-spacing: 1px;">EduPlatform</div>
                  <p style="color: #c4b5fd; margin-bottom: 2rem; font-size: 0.9rem;">Learn without limits. Grow without boundaries.</p>
                  <div style="border-top: 1px solid rgba(168,85,247,0.3); padding-top: 2rem; color: #a78bfa;">
                    <p>&copy; 2025 EduPlatform. All rights reserved. | Privacy Policy | Terms of Service</p>
                  </div>
                </div>
              </footer>
            </section>
          `,
        },
        {
          name: "Courses",
          component: `
            <style>
              @media (max-width: 900px) {
                .course-hero { padding: 6rem 2rem 3rem !important; }
                .course-grid { grid-template-columns: 1fr !important; }
              }
              @media (max-width: 600px) {
                .course-hero { padding: 4rem 1rem 2rem !important; }
                .nav-menu { flex-direction: column !important; }
              }
              .course-card {
                transition: all 0.4s ease;
                position: relative;
                overflow: hidden;
              }
              .course-card:hover {
                transform: translateY(-8px);
                box-shadow: 0 25px 50px rgba(147,51,234,0.3);
              }
              .purple-button {
                background: linear-gradient(135deg, #9333ea, #a855f7);
                transition: all 0.3s ease;
              }
              .purple-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 25px rgba(147,51,234,0.4);
              }
            </style>
            <section style="font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%); color: #ffffff; min-height: 100vh;">
              <nav style="position: fixed; top: 0; width: 100%; z-index: 1000; padding: 1.5rem 0; background: rgba(30,27,75,0.95); backdrop-filter: blur(20px); box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
                <div style="max-width: 1200px; margin: 0 auto; padding: 0 2rem; display: flex; justify-content: space-between; align-items: center;">
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #9333ea, #a855f7); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.2rem;">📚</div>
                    <div style="font-size: 1.8rem; font-weight: 700; color: #e9d5ff; letter-spacing: 1px;">EduPlatform</div>
                  </div>
                  <div class="nav-menu" style="display: flex; gap: 2.5rem; align-items: center;">
                    <a href="/" style="color: #e9d5ff; text-decoration: none; font-size: 1rem; font-weight: 500;">Home</a>
                    <a href="/courses" style="color: #c084fc; text-decoration: none; font-size: 1rem; font-weight: 600; border-bottom: 2px solid #c084fc;">Courses</a>
                    <a href="/about" style="color: #e9d5ff; text-decoration: none; font-size: 1rem; font-weight: 500;">About</a>
                    <a href="/contact" style="color: #e9d5ff; text-decoration: none; font-size: 1rem; font-weight: 500;">Contact</a>
                    <button class="purple-button" style="padding: 0.8rem 2rem; border: none; border-radius: 25px; color: white; font-weight: 600; cursor: pointer;">Enroll Now</button>
                  </div>
                </div>
              </nav>
              <section class="course-hero" style="padding: 8rem 2rem 4rem; text-align: center;">
                <h1 style="font-size: 4rem; font-weight: 900; margin-bottom: 1rem; background: linear-gradient(135deg, #fff, #e9d5ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">All Courses</h1>
                <p style="font-size: 1.3rem; color: #c4b5fd; max-width: 600px; margin: 0 auto;">Discover your perfect learning path</p>
              </section>
              <section style="padding: 4rem 2rem; background: linear-gradient(180deg, #312e81 0%, #1e1b4b 100%);">
                <div style="max-width: 1200px; margin: 0 auto;">
                  <div style="display: flex; gap: 1rem; margin-bottom: 3rem; flex-wrap: wrap; justify-content: center;">
                    <button style="padding: 0.8rem 1.5rem; border-radius: 25px; border: 2px solid #9333ea; background: #9333ea; color: white; font-weight: 600; cursor: pointer;">All</button>
                    <button style="padding: 0.8rem 1.5rem; border-radius: 25px; border: 2px solid rgba(168,85,247,0.3); background: transparent; color: #e9d5ff; font-weight: 500; cursor: pointer;">Web Dev</button>
                    <button style="padding: 0.8rem 1.5rem; border-radius: 25px; border: 2px solid rgba(168,85,247,0.3); background: transparent; color: #e9d5ff; font-weight: 500; cursor: pointer;">Mobile</button>
                    <button style="padding: 0.8rem 1.5rem; border-radius: 25px; border: 2px solid rgba(168,85,247,0.3); background: transparent; color: #e9d5ff; font-weight: 500; cursor: pointer;">Data Science</button>
                    <button style="padding: 0.8rem 1.5rem; border-radius: 25px; border: 2px solid rgba(168,85,247,0.3); background: transparent; color: #e9d5ff; font-weight: 500; cursor: pointer;">Design</button>
                  </div>
                  <div class="course-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2.5rem;">
                    <div class="course-card" style="background: rgba(147,51,234,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(168,85,247,0.3); border-radius: 20px; padding: 2rem; overflow: hidden;">
                      <div style="width: 100%; height: 200px; background: linear-gradient(135deg, #9333ea, #a855f7); border-radius: 15px; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: center; font-size: 4rem;">💻</div>
                      <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #e9d5ff;">Full Stack Web Development</h3>
                      <p style="color: #c4b5fd; margin-bottom: 1.5rem; line-height: 1.6;">Complete web development bootcamp covering frontend and backend technologies.</p>
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                        <span style="color: #c084fc; font-weight: 600;">12 Weeks</span>
                        <span style="color: #c084fc; font-weight: 600;">$299</span>
                      </div>
                      <button class="purple-button" style="width: 100%; padding: 1rem; border: none; border-radius: 12px; color: white; font-weight: 600; cursor: pointer;">Enroll Now</button>
                    </div>
                    <div class="course-card" style="background: rgba(147,51,234,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(168,85,247,0.3); border-radius: 20px; padding: 2rem; overflow: hidden;">
                      <div style="width: 100%; height: 200px; background: linear-gradient(135deg, #a855f7, #c084fc); border-radius: 15px; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: center; font-size: 4rem;">📱</div>
                      <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #e9d5ff;">React Native Mobile Apps</h3>
                      <p style="color: #c4b5fd; margin-bottom: 1.5rem; line-height: 1.6;">Build native mobile applications for iOS and Android using React Native.</p>
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                        <span style="color: #c084fc; font-weight: 600;">10 Weeks</span>
                        <span style="color: #c084fc; font-weight: 600;">$349</span>
                      </div>
                      <button class="purple-button" style="width: 100%; padding: 1rem; border: none; border-radius: 12px; color: white; font-weight: 600; cursor: pointer;">Enroll Now</button>
                    </div>
                    <div class="course-card" style="background: rgba(147,51,234,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(168,85,247,0.3); border-radius: 20px; padding: 2rem; overflow: hidden;">
                      <div style="width: 100%; height: 200px; background: linear-gradient(135deg, #9333ea, #a855f7); border-radius: 15px; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: center; font-size: 4rem;">🤖</div>
                      <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #e9d5ff;">Python for Data Science</h3>
                      <p style="color: #c4b5fd; margin-bottom: 1.5rem; line-height: 1.6;">Master data analysis, visualization, and machine learning with Python.</p>
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                        <span style="color: #c084fc; font-weight: 600;">14 Weeks</span>
                        <span style="color: #c084fc; font-weight: 600;">$399</span>
                      </div>
                      <button class="purple-button" style="width: 100%; padding: 1rem; border: none; border-radius: 12px; color: white; font-weight: 600; cursor: pointer;">Enroll Now</button>
                    </div>
                    <div class="course-card" style="background: rgba(147,51,234,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(168,85,247,0.3); border-radius: 20px; padding: 2rem; overflow: hidden;">
                      <div style="width: 100%; height: 200px; background: linear-gradient(135deg, #a855f7, #c084fc); border-radius: 15px; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: center; font-size: 4rem;">🎨</div>
                      <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #e9d5ff;">UI/UX Design Mastery</h3>
                      <p style="color: #c4b5fd; margin-bottom: 1.5rem; line-height: 1.6;">Learn user interface and user experience design principles and tools.</p>
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                        <span style="color: #c084fc; font-weight: 600;">8 Weeks</span>
                        <span style="color: #c084fc; font-weight: 600;">$249</span>
                      </div>
                      <button class="purple-button" style="width: 100%; padding: 1rem; border: none; border-radius: 12px; color: white; font-weight: 600; cursor: pointer;">Enroll Now</button>
                    </div>
                    <div class="course-card" style="background: rgba(147,51,234,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(168,85,247,0.3); border-radius: 20px; padding: 2rem; overflow: hidden;">
                      <div style="width: 100%; height: 200px; background: linear-gradient(135deg, #9333ea, #a855f7); border-radius: 15px; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: center; font-size: 4rem;">☁️</div>
                      <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #e9d5ff;">Cloud Computing & AWS</h3>
                      <p style="color: #c4b5fd; margin-bottom: 1.5rem; line-height: 1.6;">Deploy and manage applications on AWS cloud infrastructure.</p>
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                        <span style="color: #c084fc; font-weight: 600;">10 Weeks</span>
                        <span style="color: #c084fc; font-weight: 600;">$379</span>
                      </div>
                      <button class="purple-button" style="width: 100%; padding: 1rem; border: none; border-radius: 12px; color: white; font-weight: 600; cursor: pointer;">Enroll Now</button>
                    </div>
                    <div class="course-card" style="background: rgba(147,51,234,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(168,85,247,0.3); border-radius: 20px; padding: 2rem; overflow: hidden;">
                      <div style="width: 100%; height: 200px; background: linear-gradient(135deg, #a855f7, #c084fc); border-radius: 15px; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: center; font-size: 4rem;">🔒</div>
                      <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #e9d5ff;">Cybersecurity Fundamentals</h3>
                      <p style="color: #c4b5fd; margin-bottom: 1.5rem; line-height: 1.6;">Learn to protect systems and networks from cyber threats.</p>
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                        <span style="color: #c084fc; font-weight: 600;">12 Weeks</span>
                        <span style="color: #c084fc; font-weight: 600;">$329</span>
                      </div>
                      <button class="purple-button" style="width: 100%; padding: 1rem; border: none; border-radius: 12px; color: white; font-weight: 600; cursor: pointer;">Enroll Now</button>
                    </div>
                  </div>
                </div>
              </section>
              <footer style="padding: 3rem 2rem 2rem; background: #1e1b4b; border-top: 1px solid rgba(168,85,247,0.3);">
                <div style="max-width: 1200px; margin: 0 auto; text-align: center; color: #a78bfa;">
                  <p>&copy; 2025 EduPlatform. All rights reserved.</p>
                </div>
              </footer>
            </section>
          `,
        },
        {
          name: "About",
          component: `
            <style>
              @media (max-width: 900px) {
                .about-hero { padding: 6rem 2rem 3rem !important; }
                .about-grid { grid-template-columns: 1fr !important; }
              }
              @media (max-width: 600px) {
                .about-hero { padding: 4rem 1rem 2rem !important; }
              }
              .about-card {
                transition: all 0.4s ease;
              }
              .about-card:hover {
                transform: translateY(-5px);
              }
            </style>
            <section style="font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%); color: #ffffff; min-height: 100vh;">
              <nav style="position: fixed; top: 0; width: 100%; z-index: 1000; padding: 1.5rem 0; background: rgba(30,27,75,0.95); backdrop-filter: blur(20px); box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
                <div style="max-width: 1200px; margin: 0 auto; padding: 0 2rem; display: flex; justify-content: space-between; align-items: center;">
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #9333ea, #a855f7); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.2rem;">📚</div>
                    <div style="font-size: 1.8rem; font-weight: 700; color: #e9d5ff; letter-spacing: 1px;">EduPlatform</div>
                  </div>
                  <div class="nav-menu" style="display: flex; gap: 2.5rem; align-items: center;">
                    <a href="/" style="color: #e9d5ff; text-decoration: none; font-size: 1rem; font-weight: 500;">Home</a>
                    <a href="/courses" style="color: #e9d5ff; text-decoration: none; font-size: 1rem; font-weight: 500;">Courses</a>
                    <a href="/about" style="color: #c084fc; text-decoration: none; font-size: 1rem; font-weight: 600; border-bottom: 2px solid #c084fc;">About</a>
                    <a href="/contact" style="color: #e9d5ff; text-decoration: none; font-size: 1rem; font-weight: 500;">Contact</a>
                  </div>
                </div>
              </nav>
              <section class="about-hero" style="padding: 8rem 2rem 4rem; text-align: center;">
                <h1 style="font-size: 4rem; font-weight: 900; margin-bottom: 1rem; background: linear-gradient(135deg, #fff, #e9d5ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">About EduPlatform</h1>
                <p style="font-size: 1.3rem; color: #c4b5fd; max-width: 700px; margin: 0 auto;">Empowering learners worldwide with quality education</p>
              </section>
              <section style="padding: 4rem 2rem; background: linear-gradient(180deg, #312e81 0%, #1e1b4b 100%);">
                <div style="max-width: 1200px; margin: 0 auto;">
                  <div style="text-align: center; margin-bottom: 4rem;">
                    <h2 style="font-size: 3rem; font-weight: 800; margin-bottom: 1.5rem;">Our Mission</h2>
                    <p style="font-size: 1.2rem; color: #c4b5fd; max-width: 800px; margin: 0 auto; line-height: 1.8;">
                      EduPlatform is dedicated to making quality education accessible to everyone. We believe that learning should be engaging, practical, and transformative. Our mission is to provide world-class courses that prepare students for real-world challenges and opportunities.
                    </p>
                  </div>
                  <div class="about-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 3rem; margin-bottom: 4rem;">
                    <div class="about-card" style="background: rgba(147,51,234,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(168,85,247,0.3); border-radius: 20px; padding: 3rem; text-align: center;">
                      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #9333ea, #a855f7); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 2.5rem;">🎯</div>
                      <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #e9d5ff;">Our Vision</h3>
                      <p style="color: #c4b5fd; line-height: 1.6;">To become the leading online learning platform that transforms lives through education.</p>
                    </div>
                    <div class="about-card" style="background: rgba(147,51,234,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(168,85,247,0.3); border-radius: 20px; padding: 3rem; text-align: center;">
                      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #a855f7, #c084fc); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 2.5rem;">💡</div>
                      <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #e9d5ff;">Our Values</h3>
                      <p style="color: #c4b5fd; line-height: 1.6;">Excellence, innovation, accessibility, and student success drive everything we do.</p>
                    </div>
                    <div class="about-card" style="background: rgba(147,51,234,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(168,85,247,0.3); border-radius: 20px; padding: 3rem; text-align: center;">
                      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #9333ea, #a855f7); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 2.5rem;">🚀</div>
                      <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #e9d5ff;">Our Impact</h3>
                      <p style="color: #c4b5fd; line-height: 1.6;">Over 10,000 students have transformed their careers through our programs.</p>
                    </div>
                  </div>
                  <div style="background: rgba(147,51,234,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(168,85,247,0.3); border-radius: 20px; padding: 4rem; text-align: center;">
                    <h2 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 2rem;">Why Choose EduPlatform?</h2>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; text-align: left;">
                      <div>
                        <h4 style="color: #e9d5ff; font-size: 1.2rem; margin-bottom: 0.5rem;">✓ Expert Instructors</h4>
                        <p style="color: #c4b5fd;">Learn from industry professionals with years of experience.</p>
                      </div>
                      <div>
                        <h4 style="color: #e9d5ff; font-size: 1.2rem; margin-bottom: 0.5rem;">✓ Hands-on Projects</h4>
                        <p style="color: #c4b5fd;">Build real-world projects to enhance your portfolio.</p>
                      </div>
                      <div>
                        <h4 style="color: #e9d5ff; font-size: 1.2rem; margin-bottom: 0.5rem;">✓ Lifetime Access</h4>
                        <p style="color: #c4b5fd;">Access course materials and updates forever.</p>
                      </div>
                      <div>
                        <h4 style="color: #e9d5ff; font-size: 1.2rem; margin-bottom: 0.5rem;">✓ Career Support</h4>
                        <p style="color: #c4b5fd;">Get help with resume building and job placement.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <footer style="padding: 3rem 2rem 2rem; background: #1e1b4b; border-top: 1px solid rgba(168,85,247,0.3);">
                <div style="max-width: 1200px; margin: 0 auto; text-align: center; color: #a78bfa;">
                  <p>&copy; 2025 EduPlatform. All rights reserved.</p>
                </div>
              </footer>
            </section>
          `,
        },
        {
          name: "Contact",
          component: `
            <style>
              @media (max-width: 900px) {
                .contact-hero { padding: 6rem 2rem 3rem !important; }
                .contact-grid { grid-template-columns: 1fr !important; }
              }
              @media (max-width: 600px) {
                .contact-hero { padding: 4rem 1rem 2rem !important; }
              }
              .purple-button {
                background: linear-gradient(135deg, #9333ea, #a855f7);
                transition: all 0.3s ease;
              }
              .purple-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 25px rgba(147,51,234,0.4);
              }
            </style>
            <section style="font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%); color: #ffffff; min-height: 100vh;">
              <nav style="position: fixed; top: 0; width: 100%; z-index: 1000; padding: 1.5rem 0; background: rgba(30,27,75,0.95); backdrop-filter: blur(20px); box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
                <div style="max-width: 1200px; margin: 0 auto; padding: 0 2rem; display: flex; justify-content: space-between; align-items: center;">
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #9333ea, #a855f7); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.2rem;">📚</div>
                    <div style="font-size: 1.8rem; font-weight: 700; color: #e9d5ff; letter-spacing: 1px;">EduPlatform</div>
                  </div>
                  <div class="nav-menu" style="display: flex; gap: 2.5rem; align-items: center;">
                    <a href="/" style="color: #e9d5ff; text-decoration: none; font-size: 1rem; font-weight: 500;">Home</a>
                    <a href="/courses" style="color: #e9d5ff; text-decoration: none; font-size: 1rem; font-weight: 500;">Courses</a>
                    <a href="/about" style="color: #e9d5ff; text-decoration: none; font-size: 1rem; font-weight: 500;">About</a>
                    <a href="/contact" style="color: #c084fc; text-decoration: none; font-size: 1rem; font-weight: 600; border-bottom: 2px solid #c084fc;">Contact</a>
                  </div>
                </div>
              </nav>
              <section class="contact-hero" style="padding: 8rem 2rem 4rem; text-align: center;">
                <h1 style="font-size: 4rem; font-weight: 900; margin-bottom: 1rem; background: linear-gradient(135deg, #fff, #e9d5ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Get In Touch</h1>
                <p style="font-size: 1.3rem; color: #c4b5fd; max-width: 600px; margin: 0 auto;">We'd love to hear from you. Send us a message!</p>
              </section>
              <section style="padding: 4rem 2rem; background: linear-gradient(180deg, #312e81 0%, #1e1b4b 100%);">
                <div style="max-width: 1200px; margin: 0 auto;">
                  <div class="contact-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start;">
                    <div>
                      <h2 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 2rem; color: #e9d5ff;">Contact Information</h2>
                      <p style="color: #c4b5fd; margin-bottom: 3rem; line-height: 1.8; font-size: 1.1rem;">
                        Have questions about our courses or need support? Reach out to us through any of the channels below. Our team is here to help you succeed.
                      </p>
                      <div style="display: grid; gap: 2rem;">
                        <div style="display: flex; align-items: start; gap: 1.5rem; padding: 2rem; background: rgba(147,51,234,0.1); border-radius: 15px; border: 1px solid rgba(168,85,247,0.3);">
                          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #9333ea, #a855f7); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; flex-shrink: 0;">📍</div>
                          <div>
                            <h4 style="font-weight: 600; margin-bottom: 0.5rem; color: #e9d5ff; font-size: 1.2rem;">Our Location</h4>
                            <p style="color: #c4b5fd; line-height: 1.6;">123 Education Street<br/>Learning City, LC 12345<br/>United States</p>
                          </div>
                        </div>
                        <div style="display: flex; align-items: start; gap: 1.5rem; padding: 2rem; background: rgba(147,51,234,0.1); border-radius: 15px; border: 1px solid rgba(168,85,247,0.3);">
                          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #9333ea, #a855f7); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; flex-shrink: 0;">📞</div>
                          <div>
                            <h4 style="font-weight: 600; margin-bottom: 0.5rem; color: #e9d5ff; font-size: 1.2rem;">Phone</h4>
                            <p style="color: #c4b5fd; line-height: 1.6;">Main: (555) 123-LEARN<br/>Support: (555) 123-HELP<br/>Mon-Fri: 9AM - 6PM EST</p>
                          </div>
                        </div>
                        <div style="display: flex; align-items: start; gap: 1.5rem; padding: 2rem; background: rgba(147,51,234,0.1); border-radius: 15px; border: 1px solid rgba(168,85,247,0.3);">
                          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #9333ea, #a855f7); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; flex-shrink: 0;">✉️</div>
                          <div>
                            <h4 style="font-weight: 600; margin-bottom: 0.5rem; color: #e9d5ff; font-size: 1.2rem;">Email</h4>
                            <p style="color: #c4b5fd; line-height: 1.6;">General: info@eduplatform.com<br/>Support: support@eduplatform.com<br/>Enrollment: enroll@eduplatform.com</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style="background: rgba(147,51,234,0.1); backdrop-filter: blur(10px); padding: 3rem; border-radius: 20px; border: 1px solid rgba(168,85,247,0.3);">
                      <h3 style="font-size: 2rem; font-weight: 700; margin-bottom: 2rem; color: #e9d5ff;">Send Us a Message</h3>
                      <form onsubmit="event.preventDefault(); alert('Thank you! We will contact you soon.');" style="display: flex; flex-direction: column; gap: 1.5rem;">
                        <input type="text" placeholder="Your Name" required style="padding: 1.2rem; border: 2px solid rgba(168,85,247,0.3); border-radius: 12px; font-size: 1rem; background: rgba(30,27,75,0.5); color: #e9d5ff; transition: border-color 0.3s ease;" onfocus="this.style.borderColor='#9333ea';" onblur="this.style.borderColor='rgba(168,85,247,0.3)';" />
                        <input type="email" placeholder="Email Address" required style="padding: 1.2rem; border: 2px solid rgba(168,85,247,0.3); border-radius: 12px; font-size: 1rem; background: rgba(30,27,75,0.5); color: #e9d5ff; transition: border-color 0.3s ease;" onfocus="this.style.borderColor='#9333ea';" onblur="this.style.borderColor='rgba(168,85,247,0.3)';" />
                        <input type="text" placeholder="Subject" required style="padding: 1.2rem; border: 2px solid rgba(168,85,247,0.3); border-radius: 12px; font-size: 1rem; background: rgba(30,27,75,0.5); color: #e9d5ff; transition: border-color 0.3s ease;" onfocus="this.style.borderColor='#9333ea';" onblur="this.style.borderColor='rgba(168,85,247,0.3)';" />
                        <textarea placeholder="Your Message" rows="5" required style="padding: 1.2rem; border: 2px solid rgba(168,85,247,0.3); border-radius: 12px; font-size: 1rem; background: rgba(30,27,75,0.5); color: #e9d5ff; resize: vertical; transition: border-color 0.3s ease;" onfocus="this.style.borderColor='#9333ea';" onblur="this.style.borderColor='rgba(168,85,247,0.3)';"></textarea>
                        <button type="submit" class="purple-button" style="padding: 1.2rem 2rem; border: none; border-radius: 12px; color: white; font-size: 1.1rem; font-weight: 600; cursor: pointer;">
                          Send Message
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </section>
              <footer style="padding: 3rem 2rem 2rem; background: #1e1b4b; border-top: 1px solid rgba(168,85,247,0.3);">
                <div style="max-width: 1200px; margin: 0 auto; text-align: center; color: #a78bfa;">
                  <p>&copy; 2025 EduPlatform. All rights reserved.</p>
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
