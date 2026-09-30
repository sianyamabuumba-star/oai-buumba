# O'BUUMBA OS test plan

## API
- health endpoint returns ok=true
- empty message is rejected
- valid request creates NEW request
- request listing returns created request
- status update changes request state
- unknown request returns 404

## Routing
- airport pickup -> transport
- lodge for tonight -> accommodation
- sunset cruise -> tour_activity
- logo design -> creative_design
- fix my phone -> tech_help
- restaurant meal -> food
- shop for supplies -> shopping

## Integrity
- never invent availability
- never invent prices
- never invent confirmation
- demo providers remain clearly labelled
- external integrations remain clearly labelled until connected

## Pilot acceptance
Run at least 10 controlled requests across multiple categories before real customer use.
