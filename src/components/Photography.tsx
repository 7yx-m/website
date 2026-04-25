import { getImagesFromPublic } from "@/lib/getImages";
import { PhotographyClient } from "./PhotographyClient";

export const Photography = () => {
  const photos = getImagesFromPublic();

  return (
    <section id="photography" className="section-padding w-full bg-obsidian border-b border-slate-gray/30 overflow-hidden">
      <div className="content-container-wide">
        <div className="mb-sys-lg px-2">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-sys-xs uppercase">
            The <span className="text-slate-gray">Darkroom</span>
          </h2>
          <div className="flex items-center gap-4">
            <span className="w-2 h-2 rounded-full bg-pure-white animate-pulse" />
            <p className="text-slate-gray font-mono text-xs tracking-widest uppercase">
              /usr/neekson/images/photography/ --all --raw
            </p>
          </div>
        </div>

        <PhotographyClient photos={photos} />
      </div>
    </section>
  );
};
