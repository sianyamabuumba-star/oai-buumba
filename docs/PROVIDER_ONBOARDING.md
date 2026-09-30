# Provider onboarding

A provider enters the directory only after identity/contact verification and service confirmation.

Minimum record:
- provider name
- category
- contact channel
- location/service area
- services offered
- operating hours
- booking method
- verification status
- last verified timestamp

Never expose a provider as verified until verification is complete.

Pilot workflow:
1. Contact provider.
2. Confirm business/service details.
3. Confirm how availability is checked.
4. Record response time and booking method.
5. Add provider with verified=false.
6. Complete verification.
7. Test one controlled request.
8. Mark verified=true only after successful validation.
