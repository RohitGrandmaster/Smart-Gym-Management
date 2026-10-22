// RESPONSIBILITY: Encapsulates logic, UI, or types for this module.
// DATA FLOW: Standard component data flow.
"use client";
// RESPONSIBILITY: Renders the Facility Gallery section with 3 hover-reveal image cards.
// Section id is "gallery" to match LandingUrlConfig.ANCHORS.GALLERY and navbar links.
import Image from 'next/image';

const GALLERY_ITEMS = [
  { src: '/gym_gallery_cardio.png',  alt: 'Cardio Section',     label: 'Advanced Cardio' },
  { src: '/gym_gallery_weights.png', alt: 'Free Weights',        label: 'Free Weights Area' },
  { src: '/gym_gallery_studio.png',  alt: 'Yoga & Group Studio', label: 'Yoga & Group Studio' },
] as const;

export default function LandingGallery() {
  return (
    <section id="gallery" className="py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block text-xs font-bold tracking-widest uppercase text-warning bg-warning/10 border border-warning/20 rounded-full px-4 py-2 mb-5">
            Our Facility
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            World-Class{' '}
            <span style={{ background: 'var(--landing-text-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Equipment
            </span>
          </h2>
          <p className="text-secondary max-w-xl mx-auto">
            Train in an environment designed for champions.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GALLERY_ITEMS.map((item) => (
            <div key={item.label} className="rounded-2xl overflow-hidden aspect-video md:aspect-square relative group">
              <Image src={item.src} alt={item.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <span className="font-bold text-lg text-white">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

