# VERDE AUTO. Design and implementation plan

Goal: a working Russian-language portfolio site for a fictional China-to-Russia car import studio, faithfully adapting the user's chosen Lando Norris interactions to automotive content. User requested planning and immediate construction; proceed in the current chat without another approval round.

## Visual contract

Milk #F5F4EB, acid lime #D5FF00, forest #262C1E, black-green #151A12, olive #AABB39. Two font families supporting Russian: Manrope for bold sans-serif and Cormorant Garamond for editorial serif. Signature marks are original vector lettering, not a third body font. Confirm fonts in rendered browser; self-host assets where available.

## Structure / grammar

Custom grammar: automotive editorial showroom. Fixed restrained wordmark/menu header; independent scenes with hard surface changes and one bounded pinned route; catalogue is real selectable product content. Close is a contact desk remembering the car. This differs from filmic one-shot (jump navigation and catalogue), chaptered editorial (video first and fixed nav), live surface (photographic marketing), continuous world (distinct sections), typographic poster (substantial imagery), gallery/catalog (delivery story is essential), split stage (no persistent split) and rhythmic cutlist (readable holds and one pin).

Navigation: Главная, Автомобили, Как это работает, Детали, Контакты. Full-screen green contour menu, staged text entry, active-line mark, close/reopen interruptibility, Escape and focus restoration.

## Scroll score

| Beat | Device | Result |
|---|---|---|
| Arrival | Actual video playback + independent text/frame planes | Supplied car enters, headline appears from media time, replay and pause work |
| Offer | Kinetic phrase + natural flow | Clear complete service proposition |
| Collection | Image aperture hover + actual brand filter | BMW and Mercedes models open accessible dialogs with demo prices |
| Delivery peak | Pinned route drawing and delivery pass | Selection becomes a travel pass; step text stays readable |
| Details | Fan / scroll-driven transforms | Original generated photographs spread and can select the shown model |
| Contact | Sculpted reveal, line marquee, semantic contact desk | Selected model included in email draft; copy action reports real clipboard outcome |

At least four device families, no adjacent repetition. Hero video does not scrub. No fake counters or section progress meters. No audio. No forced scroll indicator. Mobile native flow replaces desktop pin.

## Implementation tasks

1. Research: inspect supplied MP4 and both references in browser, record observed vs inferred effects in REFERENCE-AUDIT.md. Keep selected scope explicit; do not claim a full clone.
2. Media: encode supplied clip without audio, derive posters, generate original editorial BMW, Mercedes and Porsche catalogue imagery. Save prompts and actual asset identities. Never display a generated car as documentary photography.
3. Build: Vite, plain semantic HTML/CSS/modules, GSAP for coordinated local choreography, original Scrollcraft engine unchanged for flow/progress. Separate car data, menu/dialog behavior and scene motion.
4. Interaction: brand filters, car detail dialogs with specs/pricing, previous/next navigation, hash state, model-to-contact persistence, email draft and clipboard copy. All must work by keyboard and touch.
5. Verification: production build; desktop, 390px and 360px screenshots including intermediate scroll; reduced motion; menu and dialog closure/focus; image/media requests and console; no overflow. Run Scrollcraft screenshot harness with native pointer capture/lock disabled. Inspect screenshot contact sheets. Record limits honestly.

## Files

- index.html: semantic page, menu and car detail dialog.
- src/styles.css: tokens, page compositions and responsive/motion-off states.
- src/main.js: startup, filtering, dialog and contact logic.
- src/motion.js: page-local motion using GSAP and Scrollcraft.
- src/cars.js: explicitly fictional catalogue data.
- public/media/: optimized original imagery, supplied footage and posters.
- public/vendor/: unmodified Scrollcraft runtime and CSS.
- lab/: verification scripts, screenshots and results.
- scrollcraft/builds/verde/: interview, score, media prompts, reference audit and verification.

## First-build assumptions

VERDE AUTO is a working name. Prices are illustrative and never represented as live quotes. Email hello@verde-auto.example is reserved demonstration contact, visibly marked as such. No external form backend, tracking or paid integration. Ready for later brand/email/content replacement.
