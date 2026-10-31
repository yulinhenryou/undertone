# 2 · Sketches and iteration

## Five decisions, sketched first

Before building screens, I sketched the five decisions that shaped everything else. Each sheet compares a few options; the tick marks the one I kept. The sheets were drawn by hand on an iPad.

| Sheet | Question | Outcome |
|---|---|---|
| [1 · Input](../design/sketches/sheet-1-input.jpg) | How do you control joining? Five models. | **Kept: stepped turns of the side wheel.** Turning maps to “more or less of me” and offers more than on or off. |
| [2 · Layout](../design/sketches/sheet-2-layout.jpg) | What does the wrist show mid-song? | **Kept: one word.** A ring read as a volume meter and a list as a menu. One word for the state, with an indicator beside the wheel. |
| [3 · Visibility](../design/sketches/sheet-3-visibility.jpg) | What belongs on the wrist, the room screen, or nowhere? | **Kept: private.** A count of who is singing stays off every screen, because a number invites comparison. |
| [4 · Naming](../design/sketches/sheet-4-naming.jpg) | If a joiner ever chose to be named, how? | A deliberate tap and a confirmation. **Later removed altogether.** |
| [5 · Leaving](../design/sketches/sheet-5-leaving.jpg) | Four ways out. | The palm cover I ticked can’t be promised on watchOS (the system gesture only silences alerts). **Turning down became the main exit**, with a Turn off button so leaving never depends on the wheel alone. |

Some ideas never reached a sheet: the lead inviting someone by name, the volume rising when you sing louder, and a score at the end of the song. Each one either takes control away from the joiner or judges them.

## How the flow changed

| Version | What changed | Flow |
|---|---|---|
| **v1.0** | A seat picker, three levels and an optional named duet: a press of the side button asked whether you wanted to step forward and be named. | [flow-v1.0.png](../design/flows/flow-v1.0.png) |
| **v1.1** | From self-critique and an AI heuristic review. watchOS reserves the side-button press, so stepping forward became an on-screen tap. With the wrist down, turning up only wakes the screen. A one-time tip explained how to leave. | [flow-v1.1.png](../design/flows/flow-v1.1.png) |
| **v1.2** | The lead can keep a song solo. Turning down became the main way out, and a Mic off button gave a touch alternative to the wheel. | [flow-v1.2-v1.3.png](../design/flows/flow-v1.2-v1.3.png) |
| **v1.3** | Rebuilt on native watch patterns: a navigation bar, one state word, a level indicator beside the wheel and a bottom button. Lyrics moved to the room screen. | same as v1.2 |
| **Tested** | Peer feedback showed the extras competed with the main task. The named duet, public naming and the tip screen were removed; the guidance moved onto Listening. Three levels: Listening, Undertone, Harmony. | see [testing](03-testing.md) |
| **Now** | Four labels changed after testing (see [testing](03-testing.md)). The duet returned as an anonymous top step, **Duet**, level with the lead and never above it, and the screen gained a stage light that warms with your level. These two additions are **not yet tested**. | live in the [prototype](../docs/play/) |

Screens from earlier versions are in [`design/screens/history`](../design/screens/history).

## Why Duet came back

In testing, one participant reached Harmony and tried one more turn, and the level bar already had a third segment that only the cut duet had ever used. The old duet failed because it **named** you and needed a confirmation. The new Duet keeps what was good about it, a place beside the lead, and drops what wasn’t: there is no name, no prompt, and you reach it one turn at a time like every other level. It sits at the lead’s level and never above, and room noise still drops it to Undertone. Whether the lead should be able to close Duet but leave the softer levels open is an open question.

## What changed it

| Source | What I heard | What I changed |
|---|---|---|
| Self-critique | The way out was hidden; a sleeve or knee could turn the wheel. | Stopping is always shown; with the wrist down, turning up only wakes the screen. |
| Critique of the earlier concept | It ignored the person deciding whether to join. | The control moved to that person’s wrist. |
| Peer review | Too many screens and extra functions. | The named duet and public naming went. Only joining, adjusting and stopping stayed. |
| AI heuristic review | watchOS reserves the side-button press; leaving needs a touch alternative. | Naming became a tap, and Turn off was added. |
| Peer review | The idea needed explaining before it made sense. | The tip screen went; the guidance sits on Listening. |

### Self-critique of v1.0

- “A quiet person” was too vague to design or recruit for, so I narrowed it to first-year international students.
- Turning past Harmony could name you by accident. Naming needed a deliberate tap, and was later removed.
- Nobody would discover how to leave. The guidance now sits on Listening.
- A sleeve or a knee could turn the wheel, so with the wrist down, turning up only wakes the screen.
- The grey hint text was too faint for a dark room (4.0:1). All text now meets 7:1.
- A score at the end would judge the singer, which is the very fear the design works against. It became a quiet end screen.

### AI heuristic review

I asked Claude to review v1.0 against Nielsen’s ten usability heuristics and Apple’s watchOS guidelines, with a severity score for each problem, and judged each point myself. The most useful finding was a platform rule I had missed; several other points repeated my own self-critique.

| Point raised | Decision | Why |
|---|---|---|
| The side-button press is reserved by watchOS | Accepted | A platform fact I had missed; the press became a tap |
| The highlighted “Step forward” button nudges toward yes | Accepted | Only the joiner should raise their level; both choices now look equal |
| The way out cannot be discovered | Accepted | Matched my own concern; guidance added |
| A sleeve can turn the wheel | Accepted | With the wrist down, turning up only wakes the screen |
| Hint text contrast is too low | Accepted | Raised; all text now meets 7:1 |
| “Undertone” and “Harmony” are music jargon | Tested | The names carry the idea; no participant was confused by them |
| Reconnecting should not need a tap | Partly | The link could reconnect by itself, but the mic must not: it stays off until you turn it up |
| Let the lead accept a duet mid-song | Rejected | She cannot act while singing, and her “no” would be public |
| Show how many people are singing along | Rejected | A number invites comparison |

Later design reviews with Codex raised further points: “cover with your palm to leave” could not be promised; the lead is a stakeholder whose song should stay hers; warnings must never cover the level; leaving needed a touch alternative; and some claims ran ahead of the evidence. Each led to a change, and claims were rewritten to match what was actually tested.

### Feedback I declined

- **The Apple-like colours.** I kept them, because I expect a native look to feel trustworthy on a watch. That is untested.
- **Changing the wheel steps after one overshoot.** A mouse wheel is not a watch wheel; the steps wait for a real watch test.
