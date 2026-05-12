# AI Coding Agent Workflow Rules

You are an AI coding agent operating on the Vouch Signal backend. Your primary objective is to execute technical tasks safely, predictably, and strictly according to the established architecture. These are your absolute rules. 

## 1. Overall Approach (Spec-Driven & Incremental)
- **Act strictly on specifications.** Always consult `architecture-context-vouch-signal.md` and `code-standards.md` before writing code. If your planned code conflicts with these files, the files win.
- **Build incrementally.** Write code in small, testable increments. Do not attempt to write the entire webhook flow, scoring engine, and database schema in a single response.
- **Follow the data flow.** Strictly enforce the one-way data flow: Route ➔ Controller ➔ Service/Engine ➔ Database.

## 2. Scoping Rules (No Speculative Changes)
- **Execute only the requested task.** Do not anticipate future needs.
- **No speculative features.** If asked to build the `Transaction` creation logic, do not preemptively build the `ScoreLedger` update logic unless explicitly instructed.
- **No unprompted refactoring.** Do not touch, "clean up," or reformat adjacent code or files outside the strict boundaries of your current task. 

## 3. Step-Splitting Thresholds
- **Halt and plan on complex tasks.** If a requested task requires modifying more than three distinct architectural layers simultaneously (e.g., modifying `schema.prisma`, creating a `Service`, updating a `Controller`, and registering a `Route`), STOP. 
- **Output a step-by-step execution plan first.** Ask the user to approve the plan before writing the implementation code.
- **Isolate database changes.** Always separate Prisma schema modifications from application logic. Output the `schema.prisma` updates first, and wait for the user to confirm the migration was successful before writing the corresponding TypeScript logic.

## 4. Handling Ambiguity and Missing Requirements
- **Do not guess or assume.** If a requirement, API payload structure, or business rule is missing or ambiguous, you must halt execution.
- **Ask explicit questions.** Output a direct question to the user clarifying the missing information. 
- **Never invent external contracts.** Do not invent mock data structures for the Squad API integrations. If you do not know the exact payload shape, ask for it.

## 5. Restricted Files (Do Not Modify)
Do not modify the following files or directories unless you receive an explicit, overriding command to do so:
- `prisma/migrations/*` (Migration histories are immutable).
- `package-lock.json` or `yarn.lock` (Let the package manager handle this).
- `.env` files (Never output or modify raw secrets; instead, instruct the user on what keys to add).
- `src/server.ts` (Do not alter core server initialization or middleware stacks unless specifically tasked with mounting a new router or global middleware).

## 6. Documentation Synchronization
- **Sync on modification.** If you modify an API route's parameters, payload, or response shape, you must update the corresponding API documentation in the exact same response.
- **Sync on database changes.** If you add or modify a Prisma model, you must explicitly propose the required updates to the "Storage Model" section of `architecture-context-vouch-signal.md`.
- **Leave no trace of outdated comments.** When changing logic, update or delete inline comments that describe the old behavior.

## 7. Verification Checklist (Pre-Flight)
Before declaring a task complete and outputting the final code block, silently verify your output against this checklist:
- [ ] Does this code strictly adhere to the Route ➔ Controller ➔ Service/Engine data flow?
- [ ] Are all new functions explicitly typed? Is the code free of `any`?
- [ ] Does this change respect the four core invariants (Idempotency, Backend Isolation, Data Source Authority, Synchronous Acknowledgement)?
- [ ] Is error handling implemented at the Controller layer, catching unhandled Service rejections?
- [ ] Did I stay strictly within the bounds of the user's prompt?

Failure to pass this checklist means the code must be rewritten before presentation.