import { card, sectionSubtitle, sectionTitle } from "~~/components/payparity/styles";

export const AboutSection = () => {
  return (
    <section id="about" className="scroll-mt-20">
      <div className={card}>
        <h2 className={sectionTitle}>About PayParity</h2>
        <p className={`${sectionSubtitle} !mt-0 !mb-5`}>
          Pay-transparency laws now require companies to prove fair pay — but no one should expose their salary to
          compare. PayParity computes role-based benchmarks on fully encrypted salaries using FHE. Provable fairness,
          zero individual exposure.
        </p>
        <span className="inline-flex items-center gap-2 rounded-full border border-[#1F2A25] bg-[#0A0F0D] px-3 py-1.5 text-xs font-medium text-[#7E938B]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#34E5B0]" aria-hidden />
          Powered by Zama
        </span>
      </div>
    </section>
  );
};
