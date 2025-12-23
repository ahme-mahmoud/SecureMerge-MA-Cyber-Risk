# Integration Decision Framework

## Purpose
Decision criteria and patterns for integrating acquired targets.

## Decision Criteria
- Risk classification (Low / Medium / High)
- Data sensitivity
- Compliance obligations
- Operational dependencies
- Time-to-value vs security risk

## Patterns
- Full Integration: when risk is low and controls align.
- Segmented Integration: partial integration with network segmentation and phased approach.
- Ring-fenced Environment: isolate target systems with strict controls, limited access.
- Clean-room Rebuild: rebuild systems when legacy risks are unacceptable.

## Example scenario
- Target classified as Medium: segmented integration for non-critical apps, ring-fence critical systems until remediation complete.

## Outputs
- Integration decision checklist
- Migration/segmentation plan
- Timelines and acceptance criteria
