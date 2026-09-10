import { Link } from "react-router-dom";

const FooterSection = () => {
  return (
    <footer className="text-gray-500 pb-10 pt-10 md:pt-20 text-center px-4 md:px-20">
      <div
        className="footer-logo mb-6 md:mb-10 mt-4 md:mt-10 flex justify-center w-full overflow-hidden"
        onMouseMove={(e) => {
          const container = e.currentTarget.querySelector(
            ".footer-logo-container"
          ) as HTMLElement;
          const rect = container.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          container.style.setProperty("--mouse-x", `${x}%`);
          container.style.setProperty("--mouse-y", `${y}%`);
        }}
      >
        <div className="footer-logo-container w-full max-w-[300px] md:max-w-[700px] lg:max-w-[1000px]">
          <svg
            className="footer-logo-base w-full h-auto"
            viewBox="0 0 1087 313"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="white-path"
              d="M782.225 215.578L790.329 195.229L860.241 195.022C863.444 194.482 888.548 176.731 890.302 173.777C894.161 167.27 909.226 128.216 911.116 120.421C911.523 118.766 911.897 118.191 911.376 116.329C911.105 115.351 901.054 100.383 900.16 99.5782C899.323 98.8194 898.711 98.0147 897.444 98.0147L796.135 98.1297L765.734 175.662H705.714L734.394 97.9917H705.182L674.329 174.466L687.118 195.068H758.819L749.617 215.394L703.699 215.693L666.395 312.643H696.671L723.755 243.606H785.371L758.819 312.643H789.627L826.807 215.555H782.191L782.225 215.578ZM819.405 117.421H881.021L858.181 175.674H798.161L819.405 117.421Z"
              fill="white"
            />
            <path
              className="red-path"
              d="M493.192 166.466C493.305 172.582 483.255 187.769 482.666 195.081H513.474L528.12 156.591L522.076 147.072C522.076 145.198 534.164 139.357 535.817 137.116C536.665 135.966 542.902 120.112 543.015 118.756C543.388 114.56 533.123 103.638 531.074 98.9933L428.973 97.9126L390.242 195.07H421.05L436.092 156.418L486.413 156.154C488.054 156.349 493.147 164.512 493.181 166.455L493.192 166.466ZM450.794 117.422H512.411L504.443 136.84H444.422L450.794 117.422Z"
              fill="#DE0500"
            />
            <path
              className="red-path"
              d="M1075.2 215.806L993.142 215.645C984.959 221.692 967.121 229.694 962.617 238.581L934.129 312.664H964.937L975.565 283.543H1037.18L1026.55 312.664H1057.36L1086.91 236.339C1087.34 231.556 1076.9 221.002 1075.21 215.806H1075.2ZM1045.67 264.126H984.053L994.681 235.005H1056.3L1045.67 264.126Z"
              fill="#DE0500"
            />
            <path
              className="red-path"
              d="M393.229 98.2354L311.161 98.063C308.57 98.5573 282.56 117.182 281.338 119.561L252.148 195.093H282.425L295.169 165.973H355.189L344.561 195.093H374.837L405.102 118.964L393.218 98.2354H393.229ZM363.7 146.544H302.084C306.521 137.059 308.581 126.206 314.297 117.423H374.317L363.689 146.544H363.7Z"
              fill="#DE0500"
            />
            <path
              className="red-path"
              d="M642.006 215.582L603.23 312.669H574.018L599.518 243.633H539.497L510.806 312.669H481.594L519.306 215.582H642.006Z"
              fill="#DE0500"
            />
            <path
              className="red-path"
              d="M136.635 154.432C137.869 157.525 131.746 174.068 129.675 176.425C124.559 182.231 108.102 188.922 101.843 195.084H0.398438L27.7092 175.896L98.5157 175.528L106.619 156.26H34.3869C32.4289 148.511 21.2352 141.786 23.2046 133.6C23.7026 131.52 29.1353 118.149 30.1879 116.942C35.4282 110.929 51.3528 105.055 57.227 98.0073H159.736L132.425 117.195L61.6411 117.597L53.5033 136.843H124.151C127.615 141.418 134.632 149.397 136.635 154.432Z"
              fill="#DE0500"
            />
            <path
              className="red-path"
              d="M809.322 88.2888C876.801 95.1752 894.061 -8.55771 818.082 1.20282C771.383 7.20399 758.503 83.1039 809.322 88.2888ZM783.98 35.6118L861.408 40.7968L865.064 42.4523C846.162 66.227 795.581 69.0322 782.373 37.9456L783.98 35.6118Z"
              fill="white"
            />
            <path
              className="red-path"
              d="M233.543 118.471L202.769 195.095H172.493L202.237 117.425H152.312L179.397 98.0073H291.469C291.345 99.1915 290.089 99.9043 289.251 100.617C286.965 102.56 266.592 116.793 265.189 117.172C259.224 118.782 236.282 115.608 233.543 118.471Z"
              fill="#DE0500"
            />
            <path
              className="red-path"
              d="M602.694 117.425H552.77L579.854 98.0073H691.926L665.646 117.16L634.521 117.919L603.226 195.095H574.014L602.694 117.425Z"
              fill="#DE0500"
            />
            <path
              className="red-path"
              d="M955.386 215.582L926.548 291.481L897.482 312.669H805.602L833.795 293.298L894.879 292.758L924.578 215.582H955.386Z"
              fill="#DE0500"
            />
            <path
              className="red-path"
              d="M688.74 215.582L649.964 312.669H619.688L658.464 215.582H688.74Z"
              fill="#DE0500"
            />
            <path
              className="red-path"
              d="M831.109 47.802C830.724 46.0775 832.489 45.5717 833.644 45.0543C835.919 44.0311 853.518 42.9045 854.447 44.0771C856.144 46.25 833.451 57.2176 831.097 47.802H831.109Z"
              fill="white"
            />
            <path
              className="red-path"
              d="M789.695 40.2948C789.548 38.099 792.762 39.536 793.486 39.628C799.757 40.4558 805.812 42.7896 811.969 44.0772C810.622 55.9301 789.91 43.6863 789.684 40.2948H789.695Z"
              fill="white"
            />
          </svg>

          <div className="footer-logo-overlay"></div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-8">
        <Link to="/login" className="hover:text-white">
          Sign In
        </Link>
        <Link to="/book-demo" className="hover:text-white">
          Book a Demo
        </Link>
        <Link to="/contact" className="hover:text-white">
          Contact Us
        </Link>
        <Link to="/documentation" className="hover:text-white">
          Documentation
        </Link>
        <Link to="/pricing" className="hover:text-white">
          Pricing
        </Link>
        <Link to="/faq" className="hover:text-white">
          FAQ
        </Link>
        <Link to="/about" className="hover:text-white">
          About
        </Link>
        <Link to="/terms" className="hover:text-white">
          Terms & Condition
        </Link>
        <Link to="/privacy" className="hover:text-white">
          Privacy Policy
        </Link>
        <Link to="/refund-policy" className="hover:text-white">
          Refund Policy
        </Link>
      </div>
      <p className="mt-2 text-md p-2">
        Startup Ninja &copy; {new Date().getFullYear()} All rights reserved
      </p>
    </footer>
  );
};

export default FooterSection;
