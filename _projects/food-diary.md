---
layout: page
title: Food Diary
description: A personal health log I built to find my IBS triggers, by keeping meals, bowel movements, mood, and medication on one timeline.
img: assets/img/projects/food-diary/login.png
importance: 1
category: fun
keywords: food diary app, IBS tracker, symptom tracker, health log, React, Firebase, Cloud Firestore, Firebase Authentication, Firestore security rules, progressive web app
og_image: https://shubhamd13.github.io/assets/img/projects/food-diary/login.png
---

<div class="row justify-content-center">
  <div class="col-sm-6 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/food-diary/login.png" title="Food Diary login" alt="Food Diary login screen with email, password, and Sign in with Google" class="img-fluid rounded z-depth-1" caption="The live app's sign-in screen." %}
  </div>
</div>

**Side project, 2023** · built on my own · [Live app](https://food-diary-9ddf1.web.app/) · [Source on GitHub](https://github.com/Shubhamd13/Food-Diary)

## Why I built it

I have IBS. Working out what sets it off means connecting what I ate with how my gut and mood responded hours later, and with any medication I took in between. So I built a small app that puts all four on the same timeline for each day.

## What it does

- **Calendar home.** Pick any day up to today to open that day's log.
- **Four kinds of entries:** **Meal** (with calories), **Poo**, **Feel**, and **Meds**, each with a short description.
- **Timestamps that fit how I actually log.** Entries made today get the current time automatically. When backfilling an earlier day, I pick the time myself.
- **Day view.** Entries are listed in time order, and arrow controls step through days and months without going back to the calendar.
- **Private accounts.** Sign in with Google or with email and password. Each user only ever sees their own entries.
- **Installs like an app.** It's small and loads fast, and on an iPhone you can add it to the home screen from Safari (Share → Add to Home Screen). It then opens full-screen with its own icon, like a native app.

## How it's built

It's a single-page **React 18** app bundled with **webpack** and Babel, styled with **Bootstrap**, and hosted on **Firebase Hosting**. **React Router** guards the calendar and day pages behind a private route that redirects to the sign-in screen. **Firebase Authentication** handles Google and email/password sign-in, and **Cloud Firestore** stores the entries.

Each user's entries live under their own user ID:

```text
users/{uid}/logs/{logId}
    type:        "Meal" | "Poo" | "Feel" | "Meds"
    description: string
    calories:    number      (meals only)
    logDate:     Timestamp
```

Opening a day runs a single range query on `logDate`, from midnight to the next midnight, so a day loads with one request no matter how long the history gets. Dates are handled with **date-fns**, and the calendar uses **react-calendar**.

## Keeping health data private

Since this is health data, Firestore's security rules make sure each signed-in user can read and write only the documents under their own user ID. Everything else is denied by default:

```text
match /users/{userId}/{document=**} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

## Status and next steps

This is a working prototype. Planned next steps:

- Save edits and support deleting entries. The edit form currently only changes the entry on screen.
- Highlight days on the calendar that already have entries.
- The part I built it for: look for patterns between meals and symptoms over time, and export the history to share with a doctor.

## References

1. [Get started with Cloud Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started) and [Writing conditions for Security Rules](https://firebase.google.com/docs/firestore/security/rules-conditions), Firebase documentation.
2. [Firebase Authentication](https://firebase.google.com/docs/auth), Firebase documentation.
3. [React](https://react.dev/) and [react-calendar](https://github.com/wojtekmaj/react-calendar).
4. [Web app manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest), MDN, which makes the home-screen install work.
