import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="section-dark">
      <div className="container">
        {/* Logo and Address Section */}
        <div className="row gx-5 justify-content-center">
          <div className="col-lg-8">
            <div className="text-center">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <Image
                  src="/images/logo.webp"
                  alt="4best Logo"
                  width={200}
                  height={67}
                  style={{ width: "auto", height: "auto" }}
                />
              </div>
              <div className="spacer-single"></div>
              <div className="fs-16">
                712 Jefferson Ave, Brooklyn
                <br />
                New York 11221
              </div>
            </div>
          </div>
        </div>

        <div className="spacer-double"></div>

        {/* Contact Info Grid */}
        <div className="row g-4">
          {/* Phone */}
          <div className="col-lg-4 col-md-6 mb-sm-30">
            <div className="d-flex justify-content-center">
              <i className="fs-60 id-color icon_phone"></i>
              <div className="ms-3">
                <h4 className="mb-0">Call Us</h4>
                <p>Call: +1 123 456 789</p>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="col-lg-4 col-md-6 mb-sm-30">
            <div className="d-flex justify-content-center">
              <i className="fs-60 id-color icon_clock"></i>
              <div className="ms-3">
                <h4 className="mb-0">Opening Hours</h4>
                <p>Mon to Sat 08:00 - 20:00</p>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="col-lg-4 col-md-6 mb-sm-30">
            <div className="d-flex justify-content-center">
              <i className="fs-60 id-color icon_mail"></i>
              <div className="ms-3">
                <h4 className="mb-0">Email Us</h4>
                <p>contact@4best.id</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subfooter */}
      <div className="subfooter">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              Copyright {currentYear} - 4best by Designesia
            </div>
            <div className="col-md-6 text-md-end">
              <div className="social-icons mb-sm-30 text-center">
                <Link href="#" aria-label="Facebook">
                  <i className="fa-brands fa-facebook-f"></i>
                </Link>
                <Link href="#" aria-label="Twitter">
                  <i className="fa-brands fa-x-twitter"></i>
                </Link>
                <Link href="#" aria-label="Instagram">
                  <i className="fa-brands fa-instagram"></i>
                </Link>
                <Link href="#" aria-label="YouTube">
                  <i className="fa-brands fa-youtube"></i>
                </Link>
                <Link href="#" aria-label="WhatsApp">
                  <i className="fa-brands fa-whatsapp"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
