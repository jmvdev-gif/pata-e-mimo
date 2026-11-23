import { useState } from 'react';
import { Check, Copy, ExternalLink, X } from 'lucide-react';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface WhatsAppModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export function WhatsAppModal({
  isOpen,
  title,
  message,
  onClose,
}: WhatsAppModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const whatsappUrl = buildWhatsAppUrl(message);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback ignored if clipboard permissions denied
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-surface p-6 sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-[0.14em] text-ink-muted uppercase">
              Automação WhatsApp
            </p>
            <h3 className="mt-1 font-serif text-2xl font-medium text-ink">{title}</h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar prévia"
            className="cursor-pointer rounded-full p-1 text-ink-muted hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <pre className="mt-4 max-h-64 overflow-y-auto rounded-xl border border-border bg-canvas p-4 font-sans text-sm leading-relaxed whitespace-pre-wrap text-ink">
          {message}
        </pre>

        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-canvas px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-sage"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-sage" />
                <span>Mensagem copiada</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copiar mensagem</span>
              </>
            )}
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-sage px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sage-hover"
          >
            <span>Abrir no WhatsApp</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
