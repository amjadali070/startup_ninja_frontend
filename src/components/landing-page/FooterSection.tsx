const FooterSection = () => {
  return (
    <footer className="text-gray-500 pb-10 pt-20 text-center px-20">
      <div className="footer-logo mb-10 mt-10 flex justify-center"
        onMouseMove={(e) => {
          const container = e.currentTarget.querySelector('.footer-logo-container') as HTMLElement;
          const rect = container.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          container.style.setProperty('--mouse-x', `${x}%`);
          container.style.setProperty('--mouse-y', `${y}%`);
        }}>
        <div className="footer-logo-container">
          <svg className="footer-logo-base" width="700" height="200" viewBox="0 0 1087 216" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="white-path" d="M782.225 118.578L790.329 98.2296L860.241 98.0226C863.444 97.4823 888.548 79.7317 890.302 76.7771C894.161 70.2701 909.226 31.2165 911.116 23.4219C911.523 21.7664 911.897 21.1915 911.376 19.3291C911.105 18.3519 901.054 3.38346 900.16 2.5787C899.323 1.81993 898.711 1.01518 897.444 1.01518L796.135 1.13014L765.734 78.6625H705.714L734.394 0.992188H705.182L674.329 77.4669L687.118 98.0686H758.819L749.617 118.394L703.699 118.693L666.395 215.643H696.671L723.755 146.607H785.371L758.819 215.643H789.627L826.807 118.555H782.191L782.225 118.578ZM819.405 20.4213H881.021L858.181 78.674H798.161L819.405 20.4213Z" fill="white" />
            <path className="red-path" d="M493.192 69.4677C493.305 75.5838 483.255 90.7707 482.666 98.0825H513.474L528.12 59.5922L522.076 50.0731C522.076 48.1992 534.164 42.3589 535.817 40.1171C536.665 38.9675 542.902 23.1138 543.015 21.7572C543.388 17.561 533.123 6.63931 531.074 1.99473L428.973 0.914062L390.242 98.071H421.05L436.092 59.4198L486.413 59.1553C488.054 59.3508 493.147 67.5133 493.181 69.4562L493.192 69.4677ZM450.794 20.4236H512.411L504.443 39.8412H444.422L450.794 20.4236Z" fill="#DE0500" />
            <path className="red-path" d="M1075.2 118.805L993.142 118.645C984.959 124.692 967.121 132.693 962.617 141.58L934.129 215.663H964.937L975.565 186.543H1037.18L1026.55 215.663H1057.36L1086.91 139.338C1087.34 134.556 1076.9 124.002 1075.21 118.805H1075.2ZM1045.67 167.125H984.053L994.681 138.005H1056.3L1045.67 167.125Z" fill="#DE0500" />
            <path className="red-path" d="M393.229 1.23495L311.161 1.0625C308.57 1.55685 282.56 20.1812 281.338 22.561L252.148 98.093H282.425L295.169 68.9723H355.189L344.561 98.093H374.837L405.102 21.9631L393.218 1.23495H393.229ZM363.7 49.5432H302.084C306.521 40.0586 308.581 29.2059 314.297 20.4226H374.317L363.689 49.5432H363.7Z" fill="#DE0500" />
            <path className="red-path" d="M642.006 118.582L603.23 215.67H574.018L599.518 146.634H539.497L510.806 215.67H481.594L519.306 118.582H642.006Z" fill="#DE0500" />
            <path className="red-path" d="M136.635 57.4326C137.869 60.5252 131.746 77.0687 129.675 79.4254C124.559 85.2312 108.102 91.9221 101.843 98.0843H0.398438L27.7092 78.8966L98.5157 78.5287L106.619 59.2606H34.3869C32.4289 51.5119 21.2352 44.7865 23.2046 36.601C23.7026 34.5201 29.1353 21.1497 30.1879 19.9425C35.4282 13.9299 51.3528 8.05517 57.227 1.00781H159.736L132.425 20.1955L61.6411 20.5978L53.5033 39.843H124.151C127.615 44.4186 134.632 52.3972 136.635 57.4326Z" fill="#DE0500" />
            <path className="red-path" d="M233.543 21.4716L202.769 98.0958H172.493L202.237 20.4254H152.312L179.397 1.00781H291.469C291.345 2.19195 290.089 2.90474 289.251 3.61752C286.965 5.56043 266.592 19.7931 265.189 20.1725C259.224 21.782 236.282 18.609 233.543 21.4716Z" fill="#DE0500" />
            <path className="red-path" d="M602.694 20.4254H552.77L579.854 1.00781H691.926L665.646 20.161L634.521 20.9198L603.226 98.0958H574.014L602.694 20.4254Z" fill="#DE0500" />
            <path className="red-path" d="M955.386 118.582L926.548 194.482L897.482 215.67H805.602L833.795 196.298L894.879 195.758L924.578 118.582H955.386Z" fill="#DE0500" />
            <path className="red-path" d="M688.74 118.582L649.964 215.67H619.688L658.464 118.582H688.74Z" fill="#DE0500" />
          </svg>
          <div className="footer-logo-overlay"></div>
        </div>
      </div>
      <div className="flex justify-center space-x-8">
        <a href="#" className="hover:text-white">Sign In</a>
        <a href="#" className="hover:text-white">Book a Demo</a>
        <a href="#" className="hover:text-white">Contact Us</a>
        <a href="#" className="hover:text-white">Documentation</a>
        <a href="#" className="hover:text-white">Pricing</a>
        <a href="#" className="hover:text-white">Terms & Condition</a>
      </div>
      <p className="mt-2 text-md p-2">Startup Ninja &copy; 2025 All rights reserved</p>
    </footer>
  );
};

export default FooterSection;