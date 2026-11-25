import { Clock, CreditCard, MapPin, MessageCircle, Truck } from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { buildContactWhatsAppMessage } from '../utils/whatsapp';

interface StoreInfoSectionProps {
  onOpenWhatsApp: (title: string, message: string) => void;
}

export function StoreInfoSection({ onOpenWhatsApp }: StoreInfoSectionProps) {
  const { store } = BRAND_CONFIG;

  return (
    <section id="loja" className="border-t border-border bg-studio/60 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-10">
          <p className="text-xs font-medium tracking-[0.16em] text-ink-muted uppercase">Loja e entrega</p>
          <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Passe aqui ou receba em casa
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Endereço + mapa ilustrativo */}
          <div className="overflow-hidden rounded-2xl border border-border bg-surface lg:col-span-5">
            <div
              className="relative h-44 bg-[#E4E8DF]"
              aria-hidden="true"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, rgba(255,255,255,.65) 2px, transparent 2px), linear-gradient(0deg, rgba(255,255,255,.65) 2px, transparent 2px), linear-gradient(35deg, transparent 46%, rgba(255,255,255,.9) 46%, rgba(255,255,255,.9) 54%, transparent 54%)',
                backgroundSize: '56px 56px, 56px 56px, 100% 100%',
              }}
            >
              <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-full flex-col items-center">
                <span className="rounded-full bg-ink px-3 py-1 text-xs font-medium text-white shadow">
                  {BRAND_CONFIG.petStoreName}
                </span>
                <MapPin className="mt-1 h-7 w-7 fill-sage text-white" />
              </div>
            </div>
            <div className="p-6">
              <p className="text-base font-semibold text-ink">{store.street}</p>
              <p className="text-sm text-ink-muted">
                {store.district} · {store.city}
              </p>
              <p className="mt-3 text-xs text-ink-muted">Endereço fictício — projeto conceito.</p>
            </div>
          </div>

          {/* Horários, entrega e pagamento */}
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <Clock className="h-5 w-5 text-sage" aria-hidden="true" />
              <h3 className="mt-3 text-base font-semibold text-ink">Horário</h3>
              <dl className="mt-3 space-y-1.5 text-sm">
                {store.hours.map((row) => (
                  <div key={row.days} className="flex justify-between gap-3">
                    <dt className="text-ink-muted">{row.days}</dt>
                    <dd className="font-medium text-ink tabular-nums">{row.time}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6">
              <Truck className="h-5 w-5 text-sage" aria-hidden="true" />
              <h3 className="mt-3 text-base font-semibold text-ink">Entrega no bairro</h3>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {store.delivery.neighborhoods.map((name) => (
                  <li key={name} className="rounded-full bg-canvas px-2.5 py-1 text-xs text-ink">
                    {name}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-ink-muted">{store.delivery.sameDayCutoff}.</p>
              <p className="mt-1 text-sm text-ink-muted">{store.delivery.fee}.</p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6">
              <CreditCard className="h-5 w-5 text-sage" aria-hidden="true" />
              <h3 className="mt-3 text-base font-semibold text-ink">Pagamento</h3>
              <p className="mt-3 text-sm text-ink-muted">
                {store.delivery.payment}. Sem pagamento online.
              </p>
            </div>

            <div className="flex flex-col justify-between rounded-2xl bg-sage p-6 text-white">
              <div>
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                <h3 className="mt-3 text-base font-semibold">Ficou com dúvida?</h3>
                <p className="mt-1 text-sm text-white/80">
                  WhatsApp {BRAND_CONFIG.whatsappDisplay}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenWhatsApp('Falar com a loja', buildContactWhatsAppMessage())}
                className="mt-4 w-full cursor-pointer rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-sage transition-colors hover:bg-white/90"
              >
                Chamar no WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
