'use client';

import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, Send } from 'lucide-react';

interface ContactFormProps {
  whatsappNumber?: string;
}

export function ContactForm({ whatsappNumber = '+62 812-3456-7890' }: ContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cleanWa = whatsappNumber.replace(/[^0-9]/g, '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const waText = encodeURIComponent(
      `Halo Do'amandeh Tours and Travel,\n\nSaya menghubungi melalui formulir kontak website:\n\n` +
        `• *Nama*: ${name.trim()}\n` +
        `• *Email*: ${email.trim()}\n` +
        `• *No. WhatsApp*: ${phone.trim()}\n` +
        (serviceCategory ? `• *Layanan*: ${serviceCategory.trim()}\n` : '') +
        `• *Pesan*: ${message.trim()}\n\n` +
        `Mohon konfirmasi dan informasinya. Terima kasih!`
    );

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.open(`https://wa.me/${cleanWa}?text=${waText}`, '_blank');
    }, 400);
  };

  if (isSubmitted) {
    return (
      <Card className="bg-foam p-8 sm:p-10 border border-line rounded-none shadow-none text-ink text-center font-sans">
        <CardContent className="p-0">
          <div className="mx-auto flex size-12 items-center justify-center rounded-none bg-sun text-ink mb-4 border border-line">
            <CheckCircle2 className="size-6" strokeWidth={1.5} />
          </div>
          <p className="text-[10px] uppercase tracking-widest font-mono text-ocean mb-1">
            // PESAN TERKIRIM
          </p>
          <CardTitle className="text-2xl sm:text-3xl font-medium tracking-tight text-ink mb-2">
            Terima Kasih, {name}!
          </CardTitle>
          <CardDescription className="text-xs text-ink/75 font-light leading-relaxed max-w-md mx-auto mb-6">
            Pesan Anda telah diteruskan ke WhatsApp tim operasional Do&apos;amandeh. Tim kami akan segera menanggapi konsultasi Anda.
          </CardDescription>
          <Button
            type="button"
            onClick={() => {
              setName('');
              setEmail('');
              setPhone('');
              setServiceCategory('');
              setMessage('');
              setIsSubmitted(false);
            }}
            className="rounded-none bg-ink text-paper hover:bg-ocean text-xs uppercase tracking-widest font-medium py-3 px-6 h-auto cursor-pointer"
          >
            Kirim Pesan Lain
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-foam border border-line rounded-none shadow-none text-ink font-sans p-0 overflow-hidden">
      <CardHeader className="border-b border-line p-6 sm:p-8">
        <p className="text-[10px] uppercase tracking-widest font-mono text-ocean mb-1">
          // PESAN ONLINE
        </p>
        <CardTitle className="text-2xl sm:text-3xl font-medium tracking-tight text-ink">
          Kirim Pertanyaan atau Rencana
        </CardTitle>
        <CardDescription className="text-xs text-ink/70 font-light mt-1">
          Sampaikan rencana kunjungan, kebutuhan sewa, atau pertanyaan seputar Bali kepada tim kami.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <Label htmlFor="contact-name" className="block text-xs uppercase tracking-wider font-medium text-ink mb-1.5">
              Nama Lengkap <span className="text-red-500">*</span>
            </Label>
            <Input
              id="contact-name"
              required
              type="text"
              placeholder="Contoh: Budi Santoso"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-none border-line bg-paper text-ink placeholder:text-ink/40 shadow-none text-xs focus-visible:ring-1 focus-visible:ring-ocean h-10"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact-email" className="block text-xs uppercase tracking-wider font-medium text-ink mb-1.5">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contact-email"
                required
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-none border-line bg-paper text-ink placeholder:text-ink/40 shadow-none text-xs focus-visible:ring-1 focus-visible:ring-ocean h-10"
              />
            </div>

            <div>
              <Label htmlFor="contact-phone" className="block text-xs uppercase tracking-wider font-medium text-ink mb-1.5">
                No. WhatsApp / HP <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contact-phone"
                required
                type="tel"
                placeholder="081234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-none border-line bg-paper text-ink placeholder:text-ink/40 shadow-none text-xs focus-visible:ring-1 focus-visible:ring-ocean h-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="contact-category" className="block text-xs uppercase tracking-wider font-medium text-ink mb-1.5">
              Layanan yang Diminati <span className="text-ink/40 text-[10px] font-mono lowercase">(opsional)</span>
            </Label>
            <Input
              id="contact-category"
              type="text"
              placeholder="Contoh: Sewa NMAX, Tato Custom, Villa Canggu, Tour Nusa Penida"
              value={serviceCategory}
              onChange={(e) => setServiceCategory(e.target.value)}
              className="rounded-none border-line bg-paper text-ink placeholder:text-ink/40 shadow-none text-xs focus-visible:ring-1 focus-visible:ring-ocean h-10"
            />
          </div>

          <div>
            <Label htmlFor="contact-message" className="block text-xs uppercase tracking-wider font-medium text-ink mb-1.5">
              Pesan / Rencana Liburan <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="contact-message"
              required
              rows={4}
              placeholder="Tuliskan jadwal kedatangan, durasi liburan, atau pertanyaan apa pun yang ingin Anda tanyakan..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="rounded-none border-line bg-paper text-ink placeholder:text-ink/40 shadow-none text-xs focus-visible:ring-1 focus-visible:ring-ocean resize-y min-h-[90px]"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-none bg-ink text-paper hover:bg-ocean text-xs uppercase tracking-widest font-medium py-3.5 mt-2 flex items-center justify-center gap-2 border-0 shadow-none cursor-pointer h-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" strokeWidth={1.5} />
                <span>Mengirim Pesan...</span>
              </>
            ) : (
              <>
                <span>Kirim Pesan Sekarang</span>
                <Send className="size-3.5" strokeWidth={1.5} />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
