# Graph Visualiser — remaining work (G2 Step 4 → G4)

> **Mentor-mode spec:** this plan deliberately contains **no TypeScript answers** — behaviour is specified in prose and pseudocode, and the implementer writes the code. Reference implementations to imitate are named where they exist.

Supersedes [archive/2026-09-08-graph-visualiser-g2-g4.md](./archive/2026-09-08-graph-visualiser-g2-g4.md). Re-verified against the working tree on branch `graph-stubs`, 2026-09-18.

**Goal:** a working, unweighted, undirected graph visualiser at `/visualiser/graphs` — four operations (`insert`, `delete`, `addEdge`, `deleteEdge`) animating on a circular layout, code panel tracking, scrubbable timeline. No traversals, no tests, no decoupling refactors, no C-debugger.

**Note on these docs:** `docs/superpowers/` is gitignored (`.gitignore:4`), so this plan lives on disk only and does not travel with the branch. Existing repo convention, not a mistake.

---

## Done since the last plan (verified 2026-09-18)

| Step | File | Commit | What landed |
|---|---|---|---|
| G1 | `data-structure/Graph.ts`, `util/codeSnippets.ts` | 9831457b…fb21b525 | Model + committed snippets (default export). |
| Registration | `common/typedefs.ts`, `GraphicalDataStructureFactory.ts`, `components/Topics/TopicCard.tsx` | earlier | `GRAPH = 'Graphs'`, factory `case`, TopicCard arrays extended to length 5. `/visualiser/graphs` already loads (with the broken stub panel — see G3). |
| G2.1 | `util/constants.ts` | 095e95f8 | `CENTRE_X/Y`, `NODE_GAP = 50`, `MIN_NODE_SPACING = actualNodeDiameter + NODE_GAP` (=102), four colours. **Deviation from the old plan:** `shapeAttributes`/`textAttributes`/`pathAttributes` are *imported from* `linked-list-visualiser/util/constants` and re-exported, not duplicated. TODO in file: promote to `common/` later. |
| G2.2 | `util/util.ts` | 490278c0, afb4f77e | `Point` (exported), `circularPositions`, `getEdgePath`. Both return-type-annotated. |
| G2.3 | `data-structure/GraphicalGraphNode.ts` | 7d28da26 | `readonly index`, `placed`, private ctor, static `from()`, `boxTarget`/`numberTarget` getters. |

### Consequence of the constants deviation

Importing the LLV bundles means `textAttributes` carries the linked list's baked-in `x: actualNodeDiameter / 2, y: topOffset`. Harmless today because `applyLayout` calls `center()` before the label ever becomes visible — but it is a silent dependency on a row-layout constant. If a graph label ever appears at `y = 150` before snapping into place, this is why. The "refactor later" cost is identical to the duplicate-now cost (same files touched), so it can be done whenever convenient.

### Bugs caught in G2 and why they matter for what's next

All four passed `tsc`. Only the last tripped lint.

- **`n === 1` guard without `return`** fell through to the radius formula. `Math.sin(Math.PI)` is `1.22e-16`, not 0, so the radius became ~4×10¹⁷ rather than `NaN` — node placed astronomically off-canvas, no error.
- **Angle used `/` where it needed `*`** → rank 0 became `Infinity` → `cos(Infinity)` is `NaN` → invisible node.
- **Map keyed by rank `i` instead of `indices[i]`** → every `positions.get(vertex)` in G3 would return `undefined`.
- **No final `return`** — lint's `consistent-return` caught this one only.

Lesson carried forward: **annotate return types** (turned two of the above into compile errors), and accept that `tsc`/lint catch none of the positional bugs. G4 does.

---

## Still-true facts (carried from the 09-08 plan, re-verified)

- `common/constants.ts`: `nodeDiameter = 50`, `strokeWidth = 2`, `actualNodeDiameter = 52`, `markerLength = 15`, `VISUALISER_CANVAS = '#visualiser-canvas'`, `CODE_CANVAS = '#code-canvas'`. `CODE_CONTAINER = 'code-container'` has **no `#`** — bare id, not a selector.
- `AnimationProducer` API: `renderCode`, `highlightCode` (1-based, indexes `codeTargets[line - 1]`), `doAnimation`, `doAnimationAndHighlight`, `doAnimationWithoutTimestamp`, `addSequenceAnimation`, `finishSequence`.
- `VisualiserController`: dispatch via `this.dataStructure[command](...)` behind `@ts-ignore` (`VisualiserController.ts:198`); args validated `/^\d+$/`; arg names ending in `s` split into `number[]`; an arg named `value`/`values` gets a 0–99 range check. `index`, `nodeA`, `nodeB` trigger neither.
- Every operation must return an `AnimationProducer` even on no-op paths — `constructTimeline` dereferences `.allRunners`.
- `GraphicalDataStructure` base: constructor clears **both** canvases (`VISUALISER_CANVAS`, `CODE_CANVAS`); `data` defaults to `[1, 2, 3]` and `load` to a `console.log` — both must be overridden.
- Fade-don't-remove precedent: `LinkedListDeleteAnimationProducer.deleteNode` animates `opacity: 0`, never `.remove()`.
- `codeSnippets.ts` highlight lines are the committed file's comments, not the old plan's drafts (table in G3 Step 1).
- `GraphicalGraph.ts` exists as a **broken stub** (keys with spaces, `value` args). G3 rewrites it wholesale.
- The four per-op producers exist as empty stubs; `GraphAnimationProducer.ts` is an empty class body.
- ESLint 9 flat config — never pass `--ext`. `npm run tsc` and `npm run lint` from `client/`. `npx eslint --fix <path>` handles blank-line and import-order errors.
- `Graph.ts` is a **default** export.
- Node: `client/package.json` engines `>=22.19.0` (Vite 8). nvm still has only 18.20.8 / 20.17.0 / 20.19.5 → `nvm install 22` before G4.
- Ignore branch `graphs-master-vibecoded` (does not compile).

## Kept from the archives (still relevant)

- **Topic registration is automatic** beyond the three (done) edits — `getTopics()` derives from the enum, `titleToUrl('Graphs') === 'graphs'` round-trips into the factory. Nothing else to edit.
- **One scrubber stop per timestamped animation** — bulk colour resets go through `doAnimationWithoutTimestamp` or every node gets its own stop.
- **Canvas is a pannable/zoomable `ZoomableSvg`** (`components/Visualiser/VisualiserCanvas.tsx`); r ≈ 325 at n=20 degrades rather than breaks. No vertex cap.
- **Save/load carries only `number[]`** — length-prefixed encoding (G3 Step 4); `load` tolerates garbage by doing nothing.
- **Use the `@/visualiser-src/…` alias** for cross-directory imports.
- **`common/helpers.ts` `getPointerStartEndCoordinates` trims asymmetrically** and uses `Math.abs` + four branches — the cautionary example for why `getEdgePath` keeps signed `dx`/`dy`.
- **Code panel is 450px wide** — snippets are already committed and fit.
- Optional hardening: an `OperationsOf<T>` mapped type turns a `documentation` key/method mismatch into a compile error.
- The arg-input UI is `OperationDetails.tsx` — one TextField per documented arg, automatic.

---

## Task G2 Step 4: `animation-producer/GraphAnimationProducer.ts`  ← **you are here**

Currently an empty `extends AnimationProducer`. **Nothing renders after this step either** — no code path reaches it until G3. Expected.

**Read first:** `common/AnimationProducer.ts` end to end (~150 lines; it *is* the machinery). Then skim `LinkedListAnimationProducer.ts` for the *pattern* of queueing runners, ignoring its row-layout math. SVG.js animating docs (`svgjs.dev/docs/3.2/animating/`) for `animate()`, runner `.attr()`, `.center()`, `.plot()`.

Each method only **queues runners via `addSequenceAnimation`**; the caller sequences them with `doAnimation*` in G3. Eight methods:

| Method | Args | Behaviour (pseudocode) |
|---|---|---|
| `applyLayout` | `nodes[]`, `positions: Map<index, Point>` | for each node: look its target up in the map; if **not** `placed` → set centre **instantly** (no animation) on box and number, queue opacity→1 on both, set `placed = true`; else → queue animated `center(x, y)` glides on both |
| `drawEdge` | `edge: Path`, `from`, `to` | `plot()` the path **instantly** (it's invisible), then queue opacity→1 |
| `moveEdge` | `edge`, `from`, `to` | queue an **animated** `plot()` to the new path |
| `highlightNode` | `node`, `colour` | queue an animated `fill` change on the box |
| `highlightEdge` | `edge`, `colour` | queue an animated `stroke` change |
| `fadeOutNode` | `node` | queue opacity→0 on box and number |
| `fadeOutEdges` | `edges[]` | queue opacity→0 on each, in the **same** sequence so they fade together |
| `resetColours` | `nodes[]`, `edges[]` | queue every box → `NODE_FILL`, every edge → `EDGE_STROKE`, one sequence |

Imports needed: `Path` from svg.js, `AnimationProducer` from common, `GraphicalGraphNode`, `Point` + `getEdgePath` from `../util/util`, `NODE_FILL` + `EDGE_STROKE` from `../util/constants`.

⚠️ **Position before you fade.** In `applyLayout`'s not-placed branch, the instant `center()` must come *before* the queued opacity runner. Same contract as `createNodeAt`: the element already exists at opacity 0, so teleporting it is invisible — but if the fade is queued first, it fades in at the origin and then jumps.

⚠️ **Never call `.remove()`** on a deleted node or edge — the timeline is scrubbable and reversible; a removed element cannot be faded back in on step-back. Hidden elements accumulate until `super()` clears the canvas on the next reset. Accepted.

⚠️ **Positions come from the `Map`, never from the SVG.** `boxTarget.attr('cx')` holds the **old** value while a `center()` runner is queued. One computed `Map<number, Point>` is the single source of truth for nodes *and* edges.

- [ ] Write the eight methods
- [ ] Return-type-annotate each (`: void`)
- [ ] `npm run tsc` clean, `npm run lint` clean (from `client/`)
- [ ] Commit, e.g. `feat(graph): animation producer for layout, edges and highlights`

---

## Task G3: `GraphicalGraph` rewrite, per-op producers, verify registration

**First pixels appear the moment `insert` is wired** — don't wait for all four operations before looking. Do `nvm install 22` first (see G4).

- [ ] **Step 1: highlight lines come from the committed `util/codeSnippets.ts`** — do not write new snippets. From the comments in that file:

| Snippet | Highlight |
|---|---|
| `insertCodeSnippet` | **3** — vertex exists, relayout the circle |
| `deleteCodeSnippet` | **2** mark target red · **3** fade incident edges · **5** fade vertex · **7** relayout |
| `addEdgeCodeSnippet` | **3** — draw the edge |
| `deleteEdgeCodeSnippet` | **2** mark the edge red · **3** fade it out |

- [ ] **Step 2: fill in the four per-op producers** (empty stubs exist). Each extends `GraphAnimationProducer` and adds exactly one method — `render<Op>Code()` calling `this.renderCode(<op>CodeSnippet)`. Mirror `LinkedListInsertAnimationProducer.renderInsertCode`.

- [ ] **Step 3: rewrite `data-structure/GraphicalGraph.ts`.** The stub's `documentation` is wrong two ways: keys with spaces can never match a method name (runtime crash on dispatch), and `value` args trigger the 0–99 range check. Replace wholesale.

Why it's called `documentation`: it genuinely is the UI text (`args`, `description`) the operations panel renders — *and* the controller uses its keys to dispatch. Double duty, hence the byte-identical rule.

**Shape** (reference for the getter: `GraphicalLinkedList` / `GraphicalAVL`):

- extends `GraphicalDataStructure`; constructor calls `super()` (clears both canvases)
- static `documentation` via `injectIds`, keys **byte-identical to method names**: `insert` (`['index']`), `delete` (`['index']`), `addEdge` (`['nodeA', 'nodeB']`), `deleteEdge` (`['nodeA', 'nodeB']`)
- private state: the `Graph` model (**default import**, composition), `svgNodes: Map<index → GraphicalGraphNode>`, `svgEdges: Map<"min-max" → Path>`, `positions: Map<index → Point>`
- private `edgeKey(a, b)` → canonical `"min-max"`
- private `point(v)` → `positions.get(v)!`
- private `relayout(producer, line)`:

```
positions ← circularPositions(model.vertices)
doAnimationAndHighlight(line, applyLayout, all svgNodes, positions)
for each model edge [a,b]: doAnimation(moveEdge, svgEdges[key(a,b)], point(a), point(b))
```

**The four operations.** Each asks the model first and returns an empty-but-valid producer on rejection:

```
insert(index):
    producer ← new GraphInsertAnimationProducer; renderInsertCode()
    if model.insert(index) failed → return producer          // duplicate → visual no-op
    svgNodes[index] ← GraphicalGraphNode.from(index)         // overwrite, never reuse
    relayout(producer, line 3)
    doAnimation(highlightNode, the new node, INSERT_COLOUR)
    doAnimationWithoutTimestamp(resetColours, all nodes, all edges)   // no extra scrubber stop
    return producer

delete(index):
    producer ← new GraphDeleteAnimationProducer; renderDeleteCode()
    if model doesn't have index → return producer
    incidentKeys ← model.neighbours(index) mapped through edgeKey     // capture BEFORE mutating
    doAnimationAndHighlight(line 2, highlightNode, the node, DELETE_COLOUR)
    if any incident edges: doAnimationAndHighlight(line 3, fadeOutEdges, those Paths)
    doAnimationAndHighlight(line 5, fadeOutNode, the node)
    NOW mutate: model.delete(index); drop svgNodes[index]; drop each incidentKey from svgEdges
    relayout(producer, line 7)
    return producer

addEdge(nodeA, nodeB):
    producer ← new GraphAddEdgeAnimationProducer; renderAddEdgeCode()
    if model.addEdge failed → return producer                // self-loop / duplicate / missing
    create a fresh Path on the canvas with pathAttributes    // no marker → undirected
    svgEdges[edgeKey(nodeA, nodeB)] ← it
    doAnimationAndHighlight(line 3, drawEdge, it, point(nodeA), point(nodeB))
    return producer                                          // NO relayout — n unchanged

deleteEdge(nodeA, nodeB):
    producer ← new GraphDeleteEdgeAnimationProducer; renderDeleteEdgeCode()
    if model.deleteEdge failed → return producer
    edge ← svgEdges[edgeKey(nodeA, nodeB)]
    doAnimationAndHighlight(line 2, highlightEdge, edge, DELETE_COLOUR)
    doAnimationAndHighlight(line 3, fadeOutEdges, [edge])
    drop the key from svgEdges
    return producer                                          // NO relayout — n unchanged
```

⚠️ **Order matters in `delete`.** Queue animations *before* mutating the model — `neighbours(index)` and the `svgEdges` lookups need the edges to still exist. Queuing records runners, it doesn't run them.

⚠️ **Only `insert`/`delete` relayout.** The layout depends solely on the vertex count; `addEdge`/`deleteEdge` leave n unchanged, so recomputing would return identical positions.

⚠️ **Re-inserting a deleted index** creates a fresh node, leaving the old faded circle at opacity 0. Harmless; it's why `svgNodes.set` must overwrite.

- [ ] **Step 4: `generate` and `data`/`load`.**
  - `generate()` — what **Create New** calls: vertices 0–3 in a square (`0-1, 1-2, 2-3, 3-0`), built via your own `insert`/`addEdge`.
  - `get data(): number[]` — length-prefixed `[V, v1..vV, a1, b1, a2, b2, ...]`.
  - `load(data)` — read count, slice vertices, insert them, walk the rest in pairs as edges. Malformed → **load nothing rather than throw**.
  - ⚠️ Override **both** — base defaults are `[1, 2, 3]` and `console.log`.

- [ ] **Step 5: verify registration (already done — confirm by eye, don't re-edit).** `GRAPH = 'Graphs'` in `typedefs.ts`; factory `case`; `TopicCard.tsx` arrays length 5. (No `buttonN` rules exist in `TopicCard.module.scss` — that old check is obsolete.)

- [ ] **Step 6: `npm run tsc`, `npm run lint`. Commit.**

---

## Task G4: Browser verification — the acceptance gate

Dev server needs **Node ≥ 22.19.0**. nvm has only 18/20:

```bash
source ~/.nvm/nvm.sh && nvm install 22 && npm --prefix client run start
```

With no automated tests this checklist is the **only** thing between a bug and a merge. Work through every item.

**Debugging map** — when something is wrong, DevTools → Elements panel distinguishes the three failure modes in seconds:

| Symptom in the DOM | Points at |
|---|---|
| element missing entirely | `from()` never called → `GraphicalGraph` op path |
| present, `opacity="0"` | a fade runner never queued/played → producer or `doAnimation*` sequencing |
| present, `cx`/`cy`/`d` contain `NaN` or absurd values | `circularPositions` / `getEdgePath` geometry |

Offer stands: Claude can drive this checklist in the Browser pane and report failures with screenshots once G3 lands.

**Registration**
- [ ] **1.** Landing page shows a fifth **Graphs** card with image and gradient.
- [ ] **2. Graphs** in the navbar dropdown; `/visualiser/graphs` loads without "Invalid Topic Title".
- [ ] **3.** Four operations with the right field counts (`insert` 1, `delete` 1, `addEdge` 2, `deleteEdge` 2). Missing op ⇒ a `documentation` key doesn't byte-match its method.

**Building up**
- [ ] **4. Create New** draws four numbered nodes in a square; edges meet the circles symmetrically, no arrowheads.
- [ ] **5. Single vertex** — **Reset All**, `insert 0`: one visible node at the centre. *Invisible ⇒ `n === 1` guard broken.*
- [ ] **6.** From Create New, `insert 4` → pentagon: nodes glide, edges follow, new node fades in and briefly marks green.
- [ ] **7.** `addEdge 0 2` draws a diagonal; `insert 5` confirms it still tracks its endpoints.

**Tearing down — the half most likely to be broken**
- [ ] **8.** From Create New, `delete 1`: marks red, **both** edges fade, vertex fades, remaining three re-lay as a triangle with `0-3`/`2-3` following. No stub left.
- [ ] **9. Delete down to one, then zero.** Last vertex sits at centre, visible (`n === 1` via deletion). Then empty canvas, no crash.
- [ ] **10.** `delete 4` on an isolated vertex: fades with no edge animation; rest re-lays.
- [ ] **11.** `deleteEdge 0 1`: marks red, fades, endpoints stay. `addEdge 0 1` again: fresh path, no hidden duplicate reappears.
- [ ] **12. Re-insert a deleted index** — `delete 2`, `insert 2`: exactly one visible circle labelled 2.

**Timeline controls**
- [ ] **13.** Through a `delete` on a connected vertex: pause, play, scrub both ways, step forward/back, change speed. Step-back must bring the vertex and edges *back* — gone for good ⇒ something called `.remove()`.

**Invalid input — each a no-op, never a crash**
- [ ] **14.** `insert abc`, empty input → argument error, no animation.
- [ ] **15.** `insert 0` twice → second no-op. `delete 99` → no-op.
- [ ] **16.** `addEdge 0 0`, duplicate `addEdge 0 1`, reversed `addEdge 1 0`, `addEdge 0 99` → no-ops, no stray path.
- [ ] **17.** `deleteEdge 0 2` (no such edge), `deleteEdge 0 99` → no-ops. *Crash on 14–17 ⇒ an op returned `undefined`.*

**Persistence and hygiene**
- [ ] **18. Save** then **Load** restores vertices *and* edges. Save after a `delete`; deleted vertex stays gone.
- [ ] **19.** Console clean.
- [ ] **20.** `npm run tsc`, `npm run lint`, `npm run build` pass. Screenshot mid-delete for the PR. Commit.

---

## Known limitations (accepted, not oversights)

- **No traversals.** BFS/DFS deferred; that's when a step log arrives. Don't add traversal logic to `GraphicalGraph`.
- **No automated regression net.** G4 is the gate; the G1 behaviour table in `archive/2026-08-17-graph-visualiser-functional.md` is the spec if `Graph.ts` changes.
- **Deleted SVG elements accumulate** at opacity 0 until the next reset. Deliberate.
- **Layout grows with vertex count** (r ≈ 325 at n=20); `ZoomableSvg` makes this degrade, not break.
- **No directed or weighted graphs.**
- **`documentation` keys are stringly-typed** — typo = runtime crash; G4 step 3 is the check.
- **Attribute bundles are imported from the linked list** — a sibling refactor can break graphs until they're promoted to `common/`. Tracked by the TODO in `util/constants.ts`.
- **Save data is not interchangeable between structures.**
