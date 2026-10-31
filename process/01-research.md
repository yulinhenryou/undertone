# 1 · Research

## Where it started

Before Undertone, I designed **Chorus Cue**: a shared tablet and room display that let the lead singer invite other people into her song. A critique of that concept pointed to the gap: it said little about the person deciding *whether* to join, and a shared screen made joining public.

Undertone keeps the same problem and looks at it from the other side, on the joiner’s own watch instead of a shared screen.

## Online ethnography

The evidence comes from my online ethnography of public karaoke discussions: **120 records**, each coded for how people join, hold back or take over a song. Most accounts come from six threads, so they guided decisions rather than proved them.

| Record | What people said | What it led to |
|---|---|---|
| E119 | “If they have not asked, you can sing along without a microphone.” | A level where you’re heard inside the chorus, without a microphone in hand |
| E107 | “I sing out of tune and need others to cover my voice a little.” | The first step sits well under the lead |
| E32, E37 | Loud joining spoiled the mood; “I can’t hear anyone when EVERYONE is singing!” | Nobody goes above the lead, and room noise holds everyone soft |
| E60 | Harmony “is a nice addition” if it sounds good | A second, clearer step: Harmony |
| E112, E116 | Some singers want their song to themselves | The lead can keep a song solo before she sings |

**What they had in common:** people wanted in, just not all at once, and not at the singer’s expense.

## Who it’s for

- **The person deciding whether to join.** Likes singing, avoids the microphone, and doesn’t want to be the main act. The design is built around their control.
- **The lead singer.** It’s their song. Their voice stays on top, and they can keep a song solo.
- **Everyone else in the room.** People who haven’t chosen to join should not be picked up. The proposed system listens to one seat only; whether neighbouring voices can really be separated is an **untested technical assumption**.

## The one rule

> **Only you can turn yourself up.** The system may turn you down or switch your mic off, never up.

- Room gets loud → anything above Undertone drops to Undertone. When the noise clears you stay where you are, and may turn up.
- The lead keeps a song solo → joining closes before the song starts, and the watch says why.
- Connection drops → the mic switches off and stays off. Reconnecting never reopens it.
- Wrist down → turning up only wakes the screen; turning down still works.
- Song ends → mic off. Every song starts with a fresh choice.
