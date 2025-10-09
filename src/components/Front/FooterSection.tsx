
const FooterSection = () => {
  return (
    <footer className="text-gray-500 pb-10 pt-20 text-center bg-[#100909] px-20">
      <img src="/images/footer-logo.png" alt="Footer Logo" className="mx-auto mb-6" />
      <div className="flex justify-center space-x-8">
        <a href="/sign-in" className="hover:text-white">Sign In</a>
        <a href="/book-demo" className="hover:text-white">Book a Demo</a>
        <a href="/contact-us" className="hover:text-white">Contact Us</a>
        <a href="/documentation" className="hover:text-white">Documentation</a>
        <a href="/pricing" className="hover:text-white">Pricing</a>
        <a href="/terms" className="hover:text-white">Terms & Condition</a>
      </div>
      <p className="mt-2 text-md p-2">Startup Ninja &copy; 2025 All rights reserved</p>
    </footer>
  );
};

export default FooterSection;