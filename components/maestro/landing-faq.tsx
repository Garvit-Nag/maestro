"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { faqContent } from "@/lib/content/landing"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function LandingFaq() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section
      id="faq"
      className="relative px-8 lg:px-16 py-24 lg:py-32"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      {/* Subtle vertical glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 opacity-30"
        style={{ background: "linear-gradient(to bottom, rgba(201,168,76,0.4), transparent)" }}
      />

      <div ref={ref} className="max-w-screen-xl">
        <div className="lg:grid lg:grid-cols-[1fr_2fr] lg:gap-24 lg:items-start">
          {/* Left */}
          <div className="mb-14 lg:mb-0 flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-block text-[10px] uppercase tracking-[4px] text-[#C9A84C] mb-5"
            >
              {faqContent.label}
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.07 }}
              className="text-[clamp(28px,4vw,44px)] font-black tracking-tight leading-tight text-white"
            >
              {faqContent.heading}
            </motion.h2>
          </div>

          {/* Right: accordion */}
          <Accordion type="single" collapsible className="w-full h-[460px]">
            {faqContent.items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.45,
                  ease: "easeOut",
                  delay: 0.1 + index * 0.06,
                }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="border-white/[0.07]"
                >
                  <AccordionTrigger className="text-[15px] font-medium text-white/70 hover:text-white hover:no-underline py-5 [&>svg]:text-[#C9A84C]/50 [&>svg]:transition-colors [&[data-state=open]]:text-white">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[14px] text-white/40 leading-relaxed font-light pb-5">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
