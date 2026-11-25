import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CatalogSection } from './components/CatalogSection';
import { PetQuizSection } from './components/PetQuizSection';
import { RationCalculatorSection } from './components/RationCalculatorSection';
import { ShowcaseFooter } from './components/ShowcaseFooter';
import { CartDrawer } from './components/CartDrawer';
import { WhatsAppModal } from './components/WhatsAppModal';
import { HowItWorksSection } from './components/HowItWorksSection';
import { StoreInfoSection } from './components/StoreInfoSection';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AddedToast } from './components/AddedToast';

interface WhatsAppPreviewState {
  isOpen: boolean;
  title: string;
  message: string;
}

export default function App() {
  const [waModal, setWaModal] = useState<WhatsAppPreviewState>({
    isOpen: false,
    title: '',
    message: '',
  });

  const openWhatsAppPreview = (title: string, message: string) => {
    setWaModal({ isOpen: true, title, message });
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-canvas text-ink">
        <Navbar />
        <main>
          <HeroSection />
          <HowItWorksSection />
          <CatalogSection />
          <PetQuizSection onOpenWhatsApp={openWhatsAppPreview} />
          <RationCalculatorSection onOpenWhatsApp={openWhatsAppPreview} />
          <StoreInfoSection onOpenWhatsApp={openWhatsAppPreview} />
        </main>
        <ShowcaseFooter />
        <CartDrawer onCheckoutWhatsApp={openWhatsAppPreview} />
        <AddedToast />
        <FloatingWhatsApp onOpenWhatsApp={openWhatsAppPreview} />
        <WhatsAppModal
          isOpen={waModal.isOpen}
          title={waModal.title}
          message={waModal.message}
          onClose={() => setWaModal((prev) => ({ ...prev, isOpen: false }))}
        />
      </div>
    </CartProvider>
  );
}
