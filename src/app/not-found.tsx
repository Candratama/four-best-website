'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { fadeInUp, staggerContainer } from '@/lib/animations';

export default function NotFound() {
  return (
    <section
      className="section-dark text-light no-top no-bottom relative overflow-hidden"
      style={{
        backgroundColor: '#162d50',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Background Pattern */}
      <div
        className="abs w-100 h-100 d-flex align-items-center justify-content-center"
        style={{ zIndex: 1 }}
      >
        <span
          style={{
            fontSize: '25rem',
            fontWeight: '700',
            color: 'rgba(255, 255, 255, 0.03)',
            letterSpacing: '0.2em',
            lineHeight: 1,
          }}
        >
          404
        </span>
      </div>

      <div className="container relative" style={{ zIndex: 2 }}>
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <motion.div
              variants={staggerContainer(0.2)}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fadeInUp}>
                <h1
                  className="mb-4"
                  style={{
                    fontSize: '8rem',
                    fontWeight: '700',
                    lineHeight: 1,
                    color: '#ffffff',
                  }}
                >
                  404
                </h1>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <h2 className="mb-4" style={{ color: '#ffffff' }}>
                  Halaman Tidak Ditemukan
                </h2>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <p
                  className="lead mb-5"
                  style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                >
                  Maaf, halaman yang Anda cari tidak dapat ditemukan. Halaman
                  mungkin telah dipindahkan atau tidak tersedia.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Link
                    href="/"
                    className="btn-main fx-slide"
                    data-hover="Kembali ke Beranda"
                  >
                    <span>Kembali ke Beranda</span>
                  </Link>
                  <Link
                    href="/partners"
                    className="btn-main btn-outline fx-slide"
                    data-hover="Lihat Partner"
                    style={{
                      backgroundColor: 'transparent',
                      border: '2px solid #ffffff',
                      color: '#ffffff',
                    }}
                  >
                    <span>Lihat Partner</span>
                  </Link>
                </div>
              </motion.div>

              <div className="spacer-double"></div>

              <motion.div variants={fadeInUp}>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
                  Butuh bantuan?{' '}
                  <Link href="/contact" className="id-color">
                    Hubungi kami
                  </Link>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="sw-overlay op-5"></div>
    </section>
  );
}
