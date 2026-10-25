# Delivery and verification, 24 October 2026

Preview: http://127.0.0.1:4173/ . Development: http://127.0.0.1:5173/ . Production package: `dist/`.

## Delivered

Interview-led Russian automotive portfolio concept. Milk/lime/forest palette, local Cyrillic Manrope and Cormorant Garamond, original wordmark, supplied cinematic MP4, full-screen contour menu, color aperture interaction, functional collection, delivery pass/route, photographic fan, shaped contact desk and moving lines/marquees.

24 models: BMW 8, Mercedes-Benz 8, Porsche 8. 72 independently served photographic views, three per car. Original generated sheets maintain a consistent car across front, profile and rear. Individual photographs are in `public/media/catalog/`; all 72 were visually inspected on `lab/catalog-contact-sheet.jpg` and loaded through model galleries in browser checks. Model descriptions are individually authored. Prices/specifications are illustrative, clearly labeled; no claim of real inventory availability.

## Structure and signature

Grammar: automotive editorial showroom, defined in the plan. Catalogue selection and service story are both essential. Other seven standard grammars lose for the concrete reasons recorded in the plan, rather than because of a default cinematic template.

Signature: selected vehicle becomes the image and model line on a perforated CN→RU delivery pass and remains selected in the email invitation. The route is physically drawn during a bounded pinned stage. Three service stages become active along its progress. On mobile it becomes natural flow with full readable steps.

Score: actual video + independent text/frame movement → kinetic editorial statement → catalogue aperture → pinned route/pass → fan → sculpted contact and line. Six scenes, approximately 9.3 desktop viewport heights at default six visible models, approximately 8.4 phone viewport heights. No unbroken camera flight or extra filler pinning. The Scrollcraft JS and CSS are byte-identical to the supplied engine, confirmed with cmp.

Fingerprint gate: registry was empty, therefore first build has no existing rows against which to compare. Dimensions recorded in FINGERPRINTS.md.

## Evidence

- `npm run check`: passed.
- `npm run build`: passed. Fonts, images and engine included in production. No external runtime/API required.
- `lab/verification-final/report.json`: 151/151 browser checks passed on production at 1440×900, 390×844, 360×640, and desktop reduced-motion. All 24 descriptions and 72 gallery views checked, filters return eight models per brand, more button adds six, keyboard dialog dismissal and menu focus return work, model selection persists, mailto draft carries model and clipboard feedback is truthful. No page errors, failed requests or horizontal overflow. 39 screenshots.
- `lab/release/report.json`: targeted verification after final route positioning, chosen-photo and motion-off-control changes. Route stage top 0 at 5/50/95% progress; heading top 125px clears header bottom 85.5px. Route stroke offset changes 1633→859→86px and card bounds change. Correct chosen BMW photo is used in desktop, phone and reduced-motion. No errors/overflow. Reduced-motion playback controls hidden.
- Final subsequent source change replaces visible em dashes with colons and adds font license files. Syntax and production build rerun successfully; these changes do not alter interactions or geometry.
- Scrollcraft harness: `lab/desktop-final/`, `lab/mobile-final/`, `lab/reduced-final/`. 22 desktop, 17 mobile and 17 reduced-motion samples. Contact sheets read visually, not merely generated. These precede the final heading offset and selection-photo refinement; `lab/release/` supersedes those affected states.

## Findings and resolution

1. Initial desktop green route scene scrolled away, leaving blank area. Cause: page CSS position:relative overrode the engine's sticky class. Fixed explicit sticky positioning; mobile/motion-off override remains natural flow. First harness did not catch the real issue; visual sheet did.
2. Gallery object-fit:cover cropped complete cars. Changed to contain, including a stronger selector to override mobile rule. Final phone gallery screenshot shows complete car.
3. Hero video began at a visible horizontal edge on mobile. Added mask transition into the forest background.
4. Route heading sat under fixed header and pass inherited a duplicate vertical transform. Added 125px stage inset and explicit GSAP y:0. Final bounds in release report confirm clearance.
5. Initial clipboard assertions checked before async clipboard resolved. Test now waits for actual status text; all four variants passed. No fake success message added.
6. Selected car's pass originally retained a decorative Porsche image. It now changes to the actual selected car photograph; dedicated release checks pass.

Harness caveat: desktop-final reports three 'dead scroll' intervals in the pinned route. This is a bounded detector limitation: the scene uses page-local GSAP rather than engine cues/scrub clips. Actual images in the sheet and release screenshots show route drawing and pass travel; measured stroke offset and bounds change. This warning is retained, not suppressed. Mobile and reduced reports show no dead-scroll warning.

## Feel check

Intended: anticipation → confidence → desire → wonder → delight → resolve.
First visual pass: anticipation → confidence → desire → emptiness → delight → resolve. The actual mismatch was the green route blank area, corrected above.
Second visual pass: anticipation → clarity → interest → route progression → playful collection → invitation. These are visual communication judgments, not measured human emotions. The route is the longest authored held scene, with the calm catalogue note immediately before it. The final contact plate resolves and remains complete, rather than fading to blank. Spectacle in buttons/menu/fan supplements this primary sequence as requested.

## Limits

No physical iPhone/Android device was available for testing. Emulated phone screenshots cannot prove real-device autoplay/decoder/Low Power Mode behavior. A full poster, bounded reveal fallback, playsinline/muted video and reduced-motion composition are implemented. No paid fonts or proprietary source assets extracted from references. No actual email sent, live quote retrieved, production backend configured or public deployment created. The `.example` email is explicitly a demonstration destination to replace before real business use.
