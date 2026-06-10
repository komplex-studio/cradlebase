---
title: The OWASP Top 10 Explained: Web Security Basics Every Developer Should Know
slug: owasp-top-10-explained-for-developers
category: cyber-security
date: 2026-06-07
excerpt: A plain-English tour of the OWASP Top 10 web application risks, with real examples and concrete fixes you can apply today. Written for students and developers who want to ship safer code.
cover_image:
---

# The OWASP Top 10 Explained

Most security breaches do not come from exotic, movie-style hacking. They come from a small set of well-known mistakes that developers make over and over. The Open Worldwide Application Security Project (OWASP) tracks the most critical of these in a famous list called the **OWASP Top 10**. If you learn this list and how to defend against each item, you will avoid the majority of real-world web vulnerabilities. This guide explains each risk in plain language with practical fixes.

## Why this matters even for small projects

A common myth is that only big companies get attacked. In reality, automated bots scan the entire internet constantly, probing every site for known weaknesses. A personal blog, a student project, or a side business can all be compromised within hours of going live if it has an obvious hole. Security is not something you bolt on at the end — it is a set of habits you build in from the first line of code.

## 1. Broken access control

Access control decides *who can do what*. It is broken when a user can act outside their intended permissions — for example, viewing another user's invoice by changing an ID in the URL from `/invoice/123` to `/invoice/124`.

**Fix:** Always check authorisation on the server for every request, not just by hiding buttons in the UI. Deny by default, and verify that the logged-in user actually owns the resource they are requesting.

```js
// Bad: trusts the client to ask only for its own data
const order = await db.orders.findById(req.params.id);

// Good: scope the query to the authenticated user
const order = await db.orders.findOne({
  id: req.params.id,
  userId: req.user.id,
});
```

## 2. Cryptographic failures

This covers sensitive data that is exposed because it was not encrypted properly — passwords stored in plain text, traffic sent over plain HTTP, or weak hashing.

**Fix:** Serve everything over HTTPS. Never store passwords directly; hash them with a slow, salted algorithm like bcrypt or Argon2. Encrypt sensitive data at rest, and never invent your own cryptography — use vetted libraries.

## 3. Injection

Injection happens when untrusted input is mixed into a command or query, letting an attacker change its meaning. The classic is SQL injection, where input like `' OR '1'='1` turns a login check into one that always passes.

**Fix:** Never build queries by string concatenation. Use parameterised queries or an ORM that escapes input automatically.

```js
// Dangerous: user input becomes part of the SQL
db.query("SELECT * FROM users WHERE email = '" + email + "'");

// Safe: the value is sent separately and never interpreted as code
db.query("SELECT * FROM users WHERE email = $1", [email]);
```

## 4. Insecure design

Some flaws are not bugs in the code but flaws in the plan — for example, a password reset flow that lets anyone reset any account, or a checkout that trusts a price sent from the browser.

**Fix:** Think about how a feature can be abused *before* you build it. This is called threat modelling. Ask "what is the worst thing someone could do here?" and design guardrails for it. Never trust values that come from the client for anything important, like prices or roles.

## 5. Security misconfiguration

This is the catch-all for insecure defaults: leaving debug mode on in production, exposing detailed error messages, using default admin passwords, or leaving cloud storage buckets publicly readable.

**Fix:** Harden your configuration. Turn off verbose errors in production, change all default credentials, remove unused features, and review the permissions on any cloud resources. Automate this with a checklist so it is not forgotten under deadline pressure.

## 6. Vulnerable and outdated components

Modern apps are built on hundreds of third-party libraries. When one of them has a known vulnerability and you do not update it, you inherit that hole.

**Fix:** Keep dependencies current. Run `npm audit` (or your ecosystem's equivalent) regularly, and use automated tools like Dependabot to flag outdated packages. Remove libraries you no longer use.

```bash
# See known vulnerabilities in your Node project
npm audit

# Apply safe automatic fixes
npm audit fix
```

## 7. Identification and authentication failures

These are weaknesses in how you confirm *who* a user is: allowing weak passwords, not limiting login attempts, exposing session tokens, or never expiring sessions.

**Fix:** Enforce reasonable password strength, rate-limit login attempts to slow down brute-force attacks, offer multi-factor authentication, and store session tokens in secure, `httpOnly` cookies so they cannot be read by JavaScript.

## 8. Software and data integrity failures

This covers trusting code or data without verifying it — for instance, loading a script from a third-party CDN that could be tampered with, or an auto-update mechanism that does not check signatures.

**Fix:** Verify the integrity of external resources using Subresource Integrity (SRI) hashes, pin and review your dependencies, and ensure your build and deployment pipeline cannot be silently modified.

## 9. Security logging and monitoring failures

If you are not logging important events, you cannot detect an attack while it is happening — or even afterward. Many breaches go unnoticed for months.

**Fix:** Log authentication attempts, access-control failures, and server errors. Make sure logs are stored safely and reviewed. Set up alerts for suspicious patterns, like a spike in failed logins. Never log sensitive data such as passwords or full card numbers.

## 10. Server-side request forgery (SSRF)

SSRF happens when your server fetches a URL supplied by a user, and an attacker points it at internal systems the public should never reach — like a cloud metadata endpoint that hands out credentials.

**Fix:** Validate and restrict any URL the server fetches on behalf of users. Use an allowlist of permitted domains, block requests to internal IP ranges, and avoid following redirects blindly.

## How to put this into practice

You do not need to memorise all ten perfectly today. Start with the habits that prevent the most damage: validate and parameterise all input, check authorisation on every request on the server, hash passwords, keep dependencies updated, and serve everything over HTTPS. These five habits alone close the door on a huge fraction of attacks.

Then make security part of your normal workflow rather than a final scramble. Add a short security checklist to your code review process, run dependency audits in your CI pipeline, and revisit the OWASP Top 10 every few months — the list is updated as threats evolve.

## Key takeaways

The OWASP Top 10 is a map of the most common ways web applications get broken, and almost all of them trace back to the same root cause: trusting input or actors that should not be trusted. Deny by default, verify on the server, never mix untrusted data into commands, keep your components patched, and log what matters. Build these habits early and security stops being a scary afterthought and becomes a natural part of how you write code.

---

*This article is for educational and defensive purposes — to help you protect the applications you build.*
