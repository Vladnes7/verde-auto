# Asset provenance

- arrival.mp4: supplied by user, optimized H.264, no audio, retained original on Desktop.
- arrival-poster.jpg: extracted from supplied video at 4.8 seconds.
- bmw.jpg, mercedes.jpg, porsche.jpg: original generated images, built-in imagegen, 24 October 2026. Source PNGs remain in Codex generated_images, copied/encoded into project. These are illustrative generated campaign images, not documentary stock inventory photos.

## Prompt set

Shared direction: photorealistic automotive editorial photography; complete car in three-quarter front view pointing left; warm pale concrete courtyard; large forest-green curved wall and limestone wall; low 50mm eye-level camera; soft overcast daylight; real metallic reflections and contact shadow; off-white, forest and graphite; generous safe margins; no people, lettering, labels or watermark.

BMW: metallic graphite BMW 5 Series G60 sedan. Mercedes: pearl-silver Mercedes-Benz E-Class W214 sedan. Porsche: dark olive-green Porsche Cayenne SUV.

Generated model badges/details may vary; model information is illustrative and explicitly marked as demo in the interface.

## Expanded catalogue

User subsequently requested eight models per brand and multiple angles per model. 24 additional imagegen calls each produced one portrait contact sheet of three equal wide photographic rows: front three-quarter, side profile, rear three-quarter. The identical model, color, trim and wheel design were requested across all three photographs. Each row was exported into its own JPEG with ffmpeg. This is extraction/encoding of generated frames, not reuse of one angle under different filenames.

Final count: 72 JPEGs in `public/media/catalog/`, approximately 6.1 MB total. All runtime references are project-local. `lab/generated-manifest.json` records exact source sheet paths and IDs. `src/cars.js` records model identity and its three view paths. `lab/prepare-media.py` reproduces the export from the retained source sheets. Source sheets remain in Codex generated_images; the portable website already contains all final requested images.

Additional Porsche cutout: built-in imagegen edit of the original olive Cayenne photograph, removing architecture/plants/ground while retaining car and subtle contact shadow on real alpha. Used as decorative initial pass and contact focal image. Selected pass switches to the selected model's actual photograph.

Typography: local Fontsource Manrope Variable and Cormorant Garamond. SIL Open Font License texts included in public/licenses and production package.

## Revision 2 — current production assets

The catalogue now contains 144 separate JPEGs for 48 models/configurations. The additional 24 imagegen sheets each contain three matching angles. `lab/revision-2-manifest.json` retains their source paths and `lab/prepare-revision-2.py` reproduces the extraction. The full visual contact sheet is `lab/revision-2-all-cars.jpg`. All final photos were visually reviewed together; generated badges, equipment and model details remain illustrative.

Three new imagegen architectural visualizations show the fictional reception/parking base, inspection bay and showroom. They are `public/media/hub-exterior.jpg`, `hub-inspection.jpg`, `hub-showroom.jpg`. The site labels them as visualizations, not a real facility. Shared direction: sunlit automotive architecture, forest-green volumes, limestone, lime accents, varied cars, credible contact shadows, no written signage or invented staff.

`arrival-short.mp4` is the user's arrival footage shortened to 4.95 seconds, muted and encoded H.264. The site has no playback or replay buttons and does not loop the clip. The original optimized `arrival.mp4` remains available as a source asset.

Brand artwork: BMW and Porsche SVGs from Simple Icons; Mercedes star from https://www.mercedes-benz.com/logos/mb-star-white.svg; Li Auto from https://upload.wikimedia.org/wikipedia/commons/9/93/Li_Auto_logo.svg; Zeekr from https://upload.wikimedia.org/wikipedia/commons/1/1e/Zeekr_logo.svg; Voyah from the official https://www.voyah.com.cn/sitelogo/pc/brand.png embedded in an SVG wrapper. These remain their respective owners' marks and are used to identify the illustrative car catalogue. There is no claim of dealership affiliation.

Geography: `world-atlas` countries-110m, derived from public-domain Natural Earth data; converted through `topojson-client` and projected with `d3-geo`. Stops use geographic longitude and latitude. The route is an explanatory land-route schematic, not a live shipment track.

Additional type: local Unbounded Variable and Caveat Variable from Fontsource; SIL OFL license texts included alongside the original two families. Four fonts all have Cyrillic coverage. No runtime media/font CDN requests are required.

## Revision 3 — current assets

There are now 216 vehicle photographs: 72 catalogue models/configurations, three separate exterior angles each. The 24 additions use 24 new three-row imagegen contact sheets, extracted to individual JPEGs. Final source paths and exact prompts are in `lab/revision-3-manifest.json`; `lab/prepare-revision-3.py` reproduces the exports. The whole new collection was visually reviewed in `lab/revision-3-new-cars.jpg`. A discarded initial generation had missing model identity in its prompt; all 24 initial sheets were replaced with explicit model/color/body requests before delivery. Only the corrected images are used by the site.

The GLS already present in the initial collection keeps its original gallery. The new light-interior GLS configuration has a different ID (`mercedes-gls-ivory`), URL and image set. Catalogue import now rejects duplicate IDs to prevent overwriting pages and media.

Three further architectural imagegen photographs: `salon-facade.jpg`, `salon-lounge.jpg`, `salon-handover.jpg`. Each includes integrated VERDE AUTO signage. Their prompts describe the same forest-green/limestone/lime architecture and identify the showroom as fictional; the site labels the results as visualizations. These supplement, rather than represent evidence of, a real business location. All six final architectural images are project-local.
