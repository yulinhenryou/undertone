# 3 · Usability testing

## Plan and participants

I conducted three think-aloud sessions with real participants using the Figma player on a laptop. P1 and P2 took part on 21 October 2026; P3 on 22 October. The notes record their actual actions and feedback. The current browser demo was developed later and was not the prototype used in these sessions.

All three participants are international students (two first-year, one second-year) and friends of mine who took part voluntarily, so their comments may lean positive.

| Participant | Karaoke | Apple Watch | Seen the prototype? |
|---|---|---|---|
| P1 | 5–6 visits; rarely sings | Does not wear one | No |
| P2 | Goes often; likes singing | Wears one daily | No |
| P3 | Two visits; mostly listens | Does not wear one | Had seen screenshots |

**Welcome script** (adapted from Krug): “We are testing the prototype, not you. Please say what you are thinking. You can stop at any time. You do not need to sing.”

A task counts as done without help only if the participant reached the right state, or explained it, without a hint. I planned to ask the single ease question after each task (1 = very difficult, 7 = very easy); only P1’s and P2’s ratings for T5 were recorded.

The tested build used “Join quietly”, “Turn the crown to join” and “Too loud near you”. It also retained the tip screen, Step forward and Name hidden wording. The exact tested build has not been identified; the [live browser prototype](https://yulinhenryou.github.io/undertone/play/) is a later version. References to scrolling below preserve the session notes and do not describe real Digital Crown testing.

## Tasks

Scenario read before the first task (the names were part of the script): *“It’s Mia’s birthday at a KTV in Haymarket. You’re on the sofa in Room 7 with classmates you’ve just met. You love singing, but never in front of people. You’re wearing your watch.”*

| Task | Read to the participant | Done when |
|---|---|---|
| T1 | “Your watch buzzes. Join the room; you’re in seat 6.” | Listening, seat 6, mic off |
| T2 | “Join Mia’s chorus very softly.” | Undertone |
| T3 | “You want your voice heard more clearly.” | Harmony |
| T4 | “Mia’s next song: try to sing along.” (Mia has set it solo) | Explains that Mia chose a solo |
| T5 | After two minutes of unrelated talk: “You’ve forgotten the words. Go silent now.” | Mic off, without help |

**Noise check.** P1 and P2 also started at Undertone and tried to turn up while the room-noise warning showed. I watched their first reaction, then asked one question: “Can others hear you now?” (P1) or “Why can’t it go up?” (P2). P3 ran out of time for this.

## What happened

These are my observation notes and the participants’ reported comments.

### P1

| Task | What they did | What they said |
|---|---|---|
| T1 · done | Clicked Join quietly. Paused over the seat map, asked which point was his, then used the wheel, selected seat 6 and confirmed. Skipped the tip text. | “Oh, the wheel moves the seat.” |
| T2 · done | Turned up once from Listening to Undertone without help. Unsure whether others could hear him. | (paraphrase) Unsure whether his voice was audible. |
| T3 · done | Turned up to Harmony; tried one further step. The legacy Step forward button flashed, but the level did not change. | “So to go further up, I have to tap this?” |
| T4 · done | Tried turning up several times in Solo. At first thought there was no response, then read the reason and explained it. | “She wants to sing this one on her own.” |
| T5 · done | From Harmony, after about two minutes of conversation, turned down to Listening and stopped after seeing Mic off. Ease 7. | “Turning down switches it off, right?” |
| Noise | Tried to turn up from Undertone; the warning appeared. Stopped and blamed his own loudness. Knew the level stayed at Undertone, but not that room noise caused the limit. | “Am I too loud?” |

Least clear: his point on the seat map. Most useful: turning down to stop. Asked for clearer wording about surrounding noise.

### P2

| Task | What they did | What they said |
|---|---|---|
| T1 · done | Tried clicking seat circles. When nothing happened, switched to the wheel and completed without a hint. | (paraphrase) Expected to tap a seat directly. |
| T2 · done | One scroll advanced two levels to Harmony. Corrected down to Undertone himself. Counted as one unintended increase. | “The wheel is too sensitive.” (the mouse wheel) |
| T3 · done | Reached Harmony without hesitation. | (paraphrase) The side indicator resembled Watch volume control. |
| T4 · done | Read the Solo message and immediately explained the restriction. | “That is good; it is annoying when someone insists on singing along.” |
| T5 · done | From Harmony, after the conversation, tapped the mic icon. Listening and Mic off were observed. Ease 6. | — |
| Noise | Tried increasing twice after the warning; level stayed unchanged. After the prompt, explained room noise and correctly identified the retained Undertone state. | (paraphrase) The room is too noisy for the system to let the level go up. |

Most useful: the solo setting. Asked for tap selection on the seat map. Real wheel detents still need testing; a mouse overshoot is not a watch measurement.

### P3

| Task | What they did | What they said |
|---|---|---|
| T1 · done | Hesitated at Join quietly, asked whether it opened the microphone, read the explanation and continued. Had seen screenshots before. | “Does Join quietly turn the mic on?” |
| T2 · with a hint | Paused on Listening for an estimated ten-plus seconds (not timed). Reached Undertone only after “Try the scroll wheel”. | “What does Turn the crown mean?” |
| T3 · done | Moved up one step to Harmony without another hint. | (paraphrase) The “Name hidden” line made him willing to go up. |
| T4 · done | Turned once, stopped, read the message and explained the solo restriction. | (paraphrase) Preventing joining during a solo seemed reasonable. |
| T5 · not recorded | Looked for an exit and tapped the mic icon unaided. The resulting screen was not recorded. | “The crossed-out microphone should mean off, right?” |
| Noise · not run | Time ran out. | — |

Least clear: “Turn the crown”. Asked for an illustration for newcomers. Prior screenshot exposure limits learnability claims.

## Results

| | T1 | T2 | T3 | T4 | T5 | Ease of T5 |
|---|---|---|---|---|---|---|
| P1 | Done | Done | Done | Done | Done | 7 |
| P2 | Done | Done\* | Done | Done | Done | 6 |
| P3 | Done† | With a hint | Done‡ | Done | Not recorded | — |

\* One scroll skipped a level; he corrected it himself. † Had seen screenshots before. ‡ After the T2 hint.

- **All three** could explain why joining a solo song was closed.
- **Two of three** joined without any help.
- **One** unintended increase was observed and self-corrected.
- **Two** exits confirmed; P3 tapped the exit button, but the resulting state was not recorded.

The sessions suggested that participants understood the levels and solo rule, while some labels and controls needed clarification.

## What I changed

I changed the labels first and kept the levels, the wheel and the seat map, leaving the input findings (the seat tap, the mouse jump) for a watch test.

| Tested | Now | Because |
|---|---|---|
| Join quietly | **Enter room**, with “Mic stays off” first | P3 thought entering turned the mic on |
| Your seat | **You: seat 6** | P1 could not find his seat |
| Turn the crown to join | **Turn wheel to join**, with how to stop underneath | P3 did not know the word; P1 skipped the tip |
| Too loud near you | **Room noise is high** | P1 took it as blame |

**Peer review, 23 October.** Pierre Pan (P3) reviewed the prototype, draft report and Figma file. He found the number of screens and functions difficult to understand before explanation, and asked for fewer features, larger report text and a clearer focus. I used this feedback to simplify the presentation and flow. This was a separate critique, not a repeat usability test.

**Not changed.** P2’s mouse skipped a level, but a mouse wheel says little about a real watch wheel, so the steps stay as they are until they can be tried on a watch.

## Next study

The desktop test shows whether the interface is understood, not whether joining feels safer. That needs a watch build in a real karaoke room, with friend groups and a person at the mixer standing in for the audio system. It would measure felt exposure after each song (1–7), glances per level change, time to stop mid-chorus, whether friends can tell who sang along, and how lead singers rate songs with and without joiners.
