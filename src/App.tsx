/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { SelectedWorkSection } from './components/SelectedWorkSection';
import { CapabilitiesSection } from './components/CapabilitiesSection';
import { ProcessSection } from './components/ProcessSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ScheduleModal } from './components/ScheduleModal';

export default function App() {
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F4F1ED] font-['IBM_Plex_Sans'] antialiased selection:bg-[#7A2E84] selection:text-[#F4F1ED]">
      {/* Top sticky navigation bar */}
      <Navbar onOpenSchedule={() => setScheduleModalOpen(true)} />

      {/* Main Content Area */}
      <main className="w-full pt-20">
        {/* 00. Hero Section (Dark) */}
        <HeroSection onOpenSchedule={() => setScheduleModalOpen(true)} />

        {/* 01. What I Build (Light #FAF8F5) */}
        <ServicesSection />

        {/* 02. Selected Work (Dark #0D0D0F) */}
        <SelectedWorkSection />

        {/* 03. Capabilities (Light #FAF8F5) */}
        <CapabilitiesSection />

        {/* 04. Process (Dark #0D0D0F) */}
        <ProcessSection onOpenSchedule={() => setScheduleModalOpen(true)} />

        {/* 05. About & Credibility (Light #FAF8F5) */}
        <AboutSection />

        {/* 06. Contact & Scheduling (Dark #0D0D0F) */}
        <ContactSection onOpenSchedule={() => setScheduleModalOpen(true)} />
      </main>

      {/* Footer */}
      <Footer />

      {/* 30-min Technical Discovery Call Modal */}
      <ScheduleModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
      />
    </div>
  );
}

