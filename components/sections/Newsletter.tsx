import NewsletterForm from '@/components/newsletter/NewsletterForm';

export default function Newsletter() {
  return (
    <section className="section bg-gradient-to-r from-primary-500/10 to-purple-500/10">
      <div className="container-custom max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Stay Updated
          </h2>
          <p className="text-lg text-dark-600">
            Subscribe to my newsletter for the latest articles, tutorials, and tech insights delivered straight to your inbox.
          </p>
        </div>

        <NewsletterForm variant="card" showName className="max-w-2xl mx-auto" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-400 mb-2">Weekly</div>
            <p className="text-sm text-dark-600">Fresh content every week</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-400 mb-2">No Spam</div>
            <p className="text-sm text-dark-600">Only quality content, no ads</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-400 mb-2">Unsubscribe</div>
            <p className="text-sm text-dark-600">Cancel anytime with one click</p>
          </div>
        </div>
      </div>
    </section>
  );
}
