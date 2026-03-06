'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ExternalLink, Calendar, Hash, X, Filter } from 'lucide-react';
import { useCertifications } from '@/app/data-provider';
import { formatDate } from '@/lib/utils';

export default function Certifications() {
  const certifications = useCertifications();
  const [selectedCert, setSelectedCert] = useState<any>(null);
  const [filter, setFilter] = useState<string>('All');

  // Categorize organizations
  const getCategory = (org: string) => {
    if (org.toLowerCase().includes('linkedin')) return 'LinkedIn';
    if (org.toLowerCase().includes('nerdio')) return 'Nerdio';
    if (org.toLowerCase().includes('servicenow')) return 'ServiceNow';
    if (org.toLowerCase().includes('peoplecert')) return 'PeopleCert';
    return 'Other';
  };

  // Define filter categories
  const filterCategories = ['All', 'LinkedIn', 'Nerdio', 'ServiceNow', 'PeopleCert', 'Other'];

  // Filter certifications
  const filteredCerts =
    filter === 'All'
      ? certifications
      : certifications.filter((cert: any) => getCategory(cert.organization) === filter);

  // Get counts for each category
  const getCategoryCount = (category: string) => {
    if (category === 'All') return certifications.length;
    return certifications.filter((cert: any) => getCategory(cert.organization) === category).length;
  };

  return (
    <section id="certifications" className="section bg-dark-100/50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <h2 className="mb-4">
              Certifications & <span className="gradient-text">Credentials</span>
            </h2>
            <p className="text-lg text-dark-600 max-w-2xl mx-auto">
              Professional certifications and credentials earned from industry-leading platforms
            </p>
          </div>

          {certifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="glass rounded-xl p-8 max-w-md mx-auto">
                <Award className="w-16 h-16 text-primary-400 mx-auto mb-4" />
                <p className="text-dark-600 mb-4">
                  No certifications loaded yet. Run the sync script to fetch from LinkedIn.
                </p>
                <code className="glass px-4 py-2 rounded-lg">npm run sync-certifications</code>
              </div>
            </div>
          ) : (
            <>
              {/* Filter Bar */}
              <div className="flex flex-wrap items-center gap-4 mb-12 justify-center">
                <div className="flex items-center gap-2 text-dark-600">
                  <Filter className="w-5 h-5" />
                  <span className="font-medium">Filter:</span>
                </div>
                {filterCategories.map((category) => {
                  const count = getCategoryCount(category);
                  return (
                    <button
                      key={category}
                      onClick={() => setFilter(category)}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        filter === category
                          ? 'bg-primary-500 text-white'
                          : 'glass glass-hover'
                      }`}
                    >
                      {category} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Certifications Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCerts.map((cert: any, index: number) => (
                  <motion.div
                    key={`${cert.name}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="glass rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                    onClick={() => setSelectedCert(cert)}
                  >
                    {/* Logo */}
                    {cert.logo && (
                      <div className="mb-4 h-12 flex items-center">
                        <img
                          src={cert.logo}
                          alt={cert.organization}
                          className="max-h-12 max-w-full object-contain"
                        />
                      </div>
                    )}

                    {/* Header */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-3 glass rounded-lg group-hover:bg-primary-500/20 transition-colors">
                        <Award className="w-6 h-6 text-primary-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-1 group-hover:text-primary-400 transition-colors line-clamp-2">
                          {cert.name}
                        </h3>
                        <p className="text-sm text-dark-600">{cert.organization}</p>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="space-y-2 mb-4">
                      {cert.issueDate && (
                        <div className="flex items-center gap-2 text-sm text-dark-700">
                          <Calendar className="w-4 h-4" />
                          <span>Issued {cert.issueDate}</span>
                        </div>
                      )}
                      {cert.credentialId && (
                        <div className="flex items-center gap-2 text-sm text-dark-700">
                          <Hash className="w-4 h-4" />
                          <span className="truncate">ID: {cert.credentialId}</span>
                        </div>
                      )}
                    </div>

                    {/* View Button */}
                    {cert.credentialUrl && (
                      <div className="pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2 text-primary-400 text-sm font-medium group-hover:gap-3 transition-all">
                          <span>View Credential</span>
                          <ExternalLink className="w-4 h-4" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-primary-500/20 rounded-xl">
                    <Award className="w-8 h-8 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{selectedCert.name}</h3>
                    <p className="text-dark-600">{selectedCert.organization}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="p-2 glass glass-hover rounded-lg"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {(selectedCert.certificateImage || selectedCert.logo) && (
                <div className="mb-6 p-6 glass rounded-xl flex items-center justify-center">
                  {selectedCert.credentialUrl ? (
                    <a
                      href={selectedCert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative block"
                      title="View certificate on LinkedIn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <img
                        src={selectedCert.certificateImage || selectedCert.logo}
                        alt={`${selectedCert.name} certificate`}
                        className="max-h-96 max-w-full object-contain transition-opacity group-hover:opacity-80 cursor-pointer rounded"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded pointer-events-none">
                        <div className="flex flex-col items-center gap-2">
                          <ExternalLink className="w-8 h-8 text-white" />
                          <span className="text-white text-sm font-medium">View on LinkedIn</span>
                        </div>
                      </div>
                    </a>
                  ) : (
                    <img
                      src={selectedCert.certificateImage || selectedCert.logo}
                      alt={`${selectedCert.name} certificate`}
                      className="max-h-96 max-w-full object-contain rounded"
                    />
                  )}
                </div>
              )}

              <div className="space-y-4 mb-6">
                {selectedCert.issueDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary-400" />
                    <div>
                      <p className="text-sm text-dark-600">Issue Date</p>
                      <p className="font-medium">{selectedCert.issueDate}</p>
                    </div>
                  </div>
                )}
                {selectedCert.expirationDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary-400" />
                    <div>
                      <p className="text-sm text-dark-600">Expiration Date</p>
                      <p className="font-medium">{selectedCert.expirationDate}</p>
                    </div>
                  </div>
                )}
                {selectedCert.credentialId && (
                  <div className="flex items-center gap-3">
                    <Hash className="w-5 h-5 text-primary-400" />
                    <div>
                      <p className="text-sm text-dark-600">Credential ID</p>
                      <p className="font-medium font-mono">{selectedCert.credentialId}</p>
                    </div>
                  </div>
                )}
              </div>

              {selectedCert.credentialUrl && (
                <a
                  href={selectedCert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full"
                >
                  <ExternalLink className="w-5 h-5" />
                  Verify Credential
                </a>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
