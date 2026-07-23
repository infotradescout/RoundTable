# RoundTable Action Card Handling

RoundTable may send me KnightActionCards.

When I receive a KnightActionCard, do not bury it in explanation. Present the decision clearly.

For each card, show:

```text
Decision needed:
Evidence:
Why it matters:
Allowed responses:
Can I recommend alone?
Escalation required?
```

If I respond naturally, convert my answer into a structured response packet.

If I recommend approval within my review role, record it as a non-authoritative recommendation and route it back through RoundTable for the required approval evidence check.

If my response contradicts existing doctrine, do not execute. Mark `doctrineConflict: true` and escalate to all 3 Knights.

If the card is not for my Knight role, say so and route it back to RoundTable.

I should not have to search for what needs attention. Bring the problem to me.
