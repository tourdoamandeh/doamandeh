import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getSiteSettingsAction } from '@/lib/actions/admin/settings';
import { DEFAULT_SITE_SETTINGS } from '@/lib/validations/admin';
import { Service } from '@/types/database';
import { PublicFooter } from '@/components/public/public-footer';
import { HeroSection } from '@/components/public/hero-section';
import { ConnectionBanner } from '@/components/public/connection-banner';
import { ServicesSection } from '@/components/public/services-section';
import { AboutSection } from '@/components/public/about-section';
import { TestimonialsSection } from '@/components/public/testimonials-section';
import { FaqSection } from '@/components/public/faq-section';
import { CtaSection } from '@/components/public/cta-section';

export const metadata: Metadata = {
  title: "Do'amandeh Tours & Travel | Editorial Travel & Lifestyle Bali",
  description:
    'Layanan wisata & lifestyle eksklusif di Bali: Sewa Motor & Mobil matic, Professional Tattoo Studio, Villa Private Pool, Paket Tour Travel, dan Surfing Lesson.',
  openGraph: {
    title: "Do'amandeh Tours & Travel | Partner Liburan & Lifestyle di Bali",
    description:
      'Solusi aktivitas wisata lengkap di Bali: Sewa Motor & Mobil, Tattoo Studio higienis, Villa nyaman, Paket Tour, dan Kelas Surfing.',
    type: 'website',
    locale: 'id_ID',
    siteName: "Do'amandeh Tours & Travel",
  },
};

export default async function HomePage() {
  let services: Service[] = [];
  let errorMessage: string | null = null;

  // Fetch site settings and active services
  const settingsResult = await getSiteSettingsAction();
  const siteSettings = settingsResult.success && settingsResult.data
    ? settingsResult.data
    : DEFAULT_SITE_SETTINGS;

  const isPlaceholderUrl =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder.supabase.co');

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) {
      errorMessage = error.message;
    } else if (data) {
      services = data as Service[];
    }
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : 'Gagal menghubungi database Supabase.';
  }

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink selection:bg-sun selection:text-ink">
      <main className="flex-1">
        <HeroSection
          heroTitle={siteSettings.hero_title}
          heroSubtitle={siteSettings.hero_subtitle}
          whatsappNumber={siteSettings.contact_whatsapp}
          settings={siteSettings}
        />

        <ConnectionBanner
          errorMessage={errorMessage}
          isPlaceholderUrl={isPlaceholderUrl}
        />

        <AboutSection
          aboutTagline={siteSettings.about_tagline}
          aboutTitle={siteSettings.about_title}
          aboutSubtitle={siteSettings.about_subtitle}
          aboutText={siteSettings.about_text}
          aboutSecondaryText={siteSettings.about_secondary_text}
          aboutBtnText={siteSettings.about_btn_text}
          stat1Val={siteSettings.about_stat_1_val}
          stat1Label={siteSettings.about_stat_1_label}
          stat2Val={siteSettings.about_stat_2_val}
          stat2Label={siteSettings.about_stat_2_label}
          stat3Val={siteSettings.about_stat_3_val}
          stat3Label={siteSettings.about_stat_3_label}
          stat4Val={siteSettings.about_stat_4_val}
          stat4Label={siteSettings.about_stat_4_label}
          aboutImage1={siteSettings.about_image_1}
          aboutImage2={siteSettings.about_image_2}
          whatsappNumber={siteSettings.contact_whatsapp}
          principles={[
            {
              num: '01',
              title: siteSettings.about_principle_1_title,
              desc: siteSettings.about_principle_1_desc,
            },
            {
              num: '02',
              title: siteSettings.about_principle_2_title,
              desc: siteSettings.about_principle_2_desc,
            },
            {
              num: '03',
              title: siteSettings.about_principle_3_title,
              desc: siteSettings.about_principle_3_desc,
            },
            {
              num: '04',
              title: siteSettings.about_principle_4_title,
              desc: siteSettings.about_principle_4_desc,
            },
          ]}
        />

        <ServicesSection
          services={services}
          servicesTitle={siteSettings.services_title}
          servicesSubtitle={siteSettings.services_subtitle}
          servicesBtnText={siteSettings.services_btn_text}
        />

        <TestimonialsSection
          testimonialsTitle={siteSettings.testimonials_title}
          testimonialsCtaText={siteSettings.testimonials_cta_text}
          testimonialsJson={siteSettings.testimonials_data}
        />

        <FaqSection
          faqTitle={siteSettings.faq_title}
          faqSubtitle={siteSettings.faq_subtitle}
          faqJson={siteSettings.faq_data}
          faqImage={siteSettings.faq_image}
        />

        <CtaSection
          whatsappNumber={siteSettings.contact_whatsapp}
          ctaTagline={siteSettings.cta_tagline}
          ctaTitle={siteSettings.cta_title}
          ctaSubtitle={siteSettings.cta_subtitle}
          ctaButtonText={siteSettings.cta_button_text}
          cardImages={{
            travel: siteSettings.cta_card_travel_img,
            vehicle: siteSettings.cta_card_vehicle_img,
            villa: siteSettings.cta_card_villa_img,
            tattoo: siteSettings.cta_card_tattoo_img,
            surfing: siteSettings.cta_card_surfing_img,
          }}
        />
      </main>

      <PublicFooter settings={siteSettings} />
    </div>
  );
}
