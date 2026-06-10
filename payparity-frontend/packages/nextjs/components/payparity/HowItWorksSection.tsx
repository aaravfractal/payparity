import { HOW_IT_WORKS } from "~~/components/payparity/constants";
import { card } from "~~/components/payparity/styles";

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="scroll-mt-20">
      <div className={card}>
        <p className="text-xs font-medium uppercase tracking-wider text-[#7E938B] mb-4">How it works</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {HOW_IT_WORKS.map(item => (
            <div key={item.step} className="rounded-xl border border-[#1F2A25] bg-[#0A0F0D]/60 p-4">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#34E5B0]/15 text-[#34E5B0] text-xs font-bold mb-2">
                {item.step}
              </span>
              <p className="text-sm font-semibold text-[#EAF2EE] mb-1">{item.title}</p>
              <p className="text-xs text-[#7E938B] leading-relaxed !m-0">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
