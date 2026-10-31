# 4 · Accessibility and design system

## Design system

The screens follow watchOS conventions so they feel native: black background, white for the state, grey for secondary text, and one accent. **Amber is used only for your own sound and actions.** Words and icons always carry the meaning; colour only supports it.

| Element | Specification |
|---|---|
| Screen | 45 mm watch, 198 × 242 pt, black background, no blur or glass effects |
| Colour | Amber `#FFB547` · white `#FFFFFF` · grey `#C7C7CC` · buttons `#2C2C2E` · notices `#1C1C1E` · warning icon `#FFD60A` |
| Type | Inter standing in for SF Compact. State 30 Bold · status 15 Regular · hint 14 · button 16 Semibold · footnote 13 |
| Components | Navigation bar · status row · level indicator (three segments, one per singing level) · stage light · Turn off button · primary button · notice |
| Touch | Buttons 40 pt tall; a 44 pt touch area is intended |

**Stage light (added after testing, not yet tested).** Behind the content, the bottom of the screen warms as you turn up: amber at Undertone, coral at Harmony, a pink-and-cream wash at Duet. It is there so your level reads from the corner of your eye. Every state is still written in words, so the light only supports them.

At true watch size, the v1.2 screens felt crowded, with a sentence, a pill and a ladder all competing. That led to the native layout of v1.3. In the final check I shortened four lines that wrapped and moved the song title out of the navigation bar.

Every screen is exported in [`design/screens`](../design/screens) and rendered live from [`docs/assets/watchkit.js`](../docs/assets/watchkit.js).

## Accessibility

The target is WCAG 2.2 AA, read for a watch with WCAG2ICT.

### Contrast

| Colour pair | Contrast |
|---|---|
| White text on black | 21.0:1 |
| Grey `#C7C7CC` on black | 12.5:1 |
| Grey `#C7C7CC` on notice `#1C1C1E` | 10.1:1 |
| Amber `#FFB547` on black | 11.9:1 |
| White on button `#2C2C2E` | 13.9:1 |
| Seat marker `#8E8E93` on sofa `#2C2C2E` (graphic) | 4.3:1 |

### Status

| Check | Result | Evidence or next step |
|---|---|---|
| Text contrast (1.4.3, 1.4.6) | Met | All text at 7:1 or above |
| Graphics contrast (1.4.11) | Met | Level indicator and seat marker above 3:1 |
| Colour not the only cue (1.4.1) | Met | Every state is written in words; greyscale check |
| Text size | Design choice | Smallest text 13 pt; state word 30 pt |
| Touch target size (2.5.8) | Intended | Buttons drawn 40 pt tall; 44 pt touch areas intended but not measured |
| Touch alternative to the wheel | Designed | Touch version: Join softly, Softer, Louder and Turn off; not yet tested with users |
| Keyboard (2.1.1) | Not checked | Arrow keys drive the web prototype, but keyboard and switch access on a watch build are not checked |
| Screen reader (1.3.1, 4.1.2) | Proposed | Labels, values and reading order below; not checked with VoiceOver |
| Larger text (1.4.4) | Not complete | An example at about 125% reflows without clipping; key screens at 200% are not checked |
| Status messages (4.1.3) | Proposed | Announcements for level changes, noise limits and lost connection |

### Touch version

Testing and the AI review both pointed out that joining depended on the wheel. In the touch version, Listening has a **Join softly** button and every singing level has **Softer** and **Louder**; Turn off returns to the touch version of Listening. It is kept separate from the default screens so they stay one word and one button. In the [web prototype](../docs/play/), choose *Touch version* (or press **T**).

### Proposed VoiceOver labels

The level indicator is one adjustable element, so the wheel and VoiceOver swipes do the same thing.

| Element | Read as |
|---|---|
| State and status | “Undertone. Mic on, softly.” |
| Level indicator | “Level, 1 of 3. Adjustable. Swipe up or down to change.” |
| Turn off | “Turn off. Button. Mutes your mic.” |
| Noise notice | Announced once: “Room noise is high. Staying soft.” |
| Lost connection | Announced: “Lost Room 7. Your mic turned off.” |
| Reading order | Room and time, state, status, notice, buttons |
