---
layout: project
title: FoodShala
description: A food-ordering site where restaurants list their dishes and customers order them, built in under a week in PHP and MySQL.
img: assets/img/projects/foodshala/logo.png
importance: 1
category: work
keywords: FoodShala, food ordering website, PHP, CodeIgniter 4, MySQL, MVC, bcrypt, Bootstrap, jQuery, AWS Elastic Beanstalk, Amazon RDS, web developer assignment
og_image: https://shubhamd13.github.io/assets/img/projects/foodshala/logo.png
toc:
  sidebar: left
---

<div class="row justify-content-center">
  <div class="col-sm-3 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/foodshala/logo.png" title="FoodShala logo" alt="FoodShala logo: a crossed spoon and fork on a pink circle" class="img-fluid rounded" %}
  </div>
</div>

**Hiring assignment, June–July 2020** · built on my own · web developer role at Internshala

## Background

After I was shortlisted for a web developer role at Internshala, the next round was a take-home assignment: build **FoodShala**, a small food-ordering website, host it online, and submit both the live link and the code. I had about six days. I built the whole thing myself, from the database schema to the deployment, and it got me through to the HR interview.

## What it does

There are two kinds of accounts, and each one sees a different site.

**Restaurants**

- Register with the restaurant's name, address, and **FSSAI licence number**.
- Add dishes to the menu, each with a name, a short description, a price in rupees, and a veg or non-veg tag.
- See their own menu, and a list of incoming orders showing who ordered which dish and when.

**Customers**

- Register with their name, address, and a veg or non-veg preference.
- Browse one shared menu with every restaurant's dishes, and hide non-veg dishes with a single **Veg-Only** toggle.
- Order a dish with **Buy Now**, then check their order history.

Anyone can browse the menu without an account. Clicking Buy Now while signed out sends you to the sign-in page.

## How it's built

The backend is **PHP** on **CodeIgniter 4**, which had come out only a few months earlier. It follows CodeIgniter's model-view-controller layout:

- **Controllers** for login, registration, the menu, restaurant pages, and orders.
- **Models** that hold the validation rules for each table, so bad input is rejected on the server and the form comes back with the errors and the user's input filled in.
- **Entities** that hash passwords on the way in and check them at sign-in.
- **Views** in **Bootstrap 4** and **jQuery**, with the jQuery Validation plugin giving quick feedback in the browser before a form is sent.

The data sits in **MySQL**, in four tables:

```text
restaurants (id, restaurantname, email, password, fssain, address)
customers   (id, firstname, lastname, email, password, address, preference)
item        (id, dishname, description, price, preference, restaurant_id → restaurants)
orders      (id, cust_id → customers, restaurant_id → restaurants, item_id → item, created_at)
```

Foreign keys tie each dish to its restaurant and each order to its customer, restaurant, and dish. They cascade on delete, so removing a restaurant also removes its dishes and their orders. The menu page is a single join of `item` and `restaurants`. The order pages join all four tables and filter by whoever is signed in.

## Security basics

- Passwords are stored as **bcrypt** hashes, never as plain text.
- Sign-in puts the account's ID and type in the session, and every restaurant-only or customer-only page checks both before doing anything. A customer can't add dishes, and a restaurant can't place orders.
- Form input is sanitised on the way in, and everything shown back on a page is HTML-escaped, which guards against cross-site scripting.
- Emails must be unique within each account type, and passwords must be at least six characters.

## Deployment

I hosted it on **AWS**: the app ran on **Elastic Beanstalk** (which runs on EC2) and the database on **Amazon RDS** for MySQL, with the database credentials kept in an environment file rather than in the code. The AWS deployment has since been shut down.

## What I'd add next

- A cart, so one order can contain several dishes and quantities.
- Order status that the restaurant can update (accepted, being prepared, delivered).
- Using the customer's veg preference to set the menu filter by default, rather than only storing it.
- CSRF protection on forms, and automated tests.

## References

1. [CodeIgniter 4 user guide](https://codeigniter.com/user_guide/), in particular [Using CodeIgniter's Model](https://codeigniter.com/user_guide/models/model.html) and [Entity classes](https://codeigniter.com/user_guide/models/entities.html).
2. [password_hash](https://www.php.net/manual/en/function.password-hash.php), PHP manual.
3. [Bootstrap 4.5 cards](https://getbootstrap.com/docs/4.5/components/card/), used for the menu grid.
4. [AWS Elastic Beanstalk](https://docs.aws.amazon.com/elasticbeanstalk/) and [Amazon RDS for MySQL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_MySQL.html).
