---
title: Deploy Your First App on AWS: EC2, S3 and the Free Tier Explained
slug: deploy-first-app-on-aws-ec2-s3-free-tier
category: aws
date: 2026-06-05
excerpt: A beginner's roadmap to Amazon Web Services — what EC2, S3, and the Free Tier actually are, how they fit together, and how to deploy your first app without a surprise bill.
cover_image:
---

# Deploy Your First App on AWS

Amazon Web Services can feel overwhelming. There are over two hundred services with cryptic names, a pricing model that scares beginners, and documentation written for experts. But you only need to understand a handful of core services to deploy a real application. This guide demystifies the essentials — EC2, S3, regions, and the Free Tier — and walks you through the mental model you need to deploy your first app with confidence and without a surprise bill.

## What "the cloud" really is

When you use AWS, you are renting Amazon's computers, storage, and networking by the hour or by usage, instead of buying your own servers. The advantage is that you can start with almost nothing, scale up instantly when you need to, and pay only for what you use. The risk is the flip side: if you leave expensive resources running, the meter keeps ticking. Understanding what costs money is therefore the first survival skill.

## Regions and availability zones

AWS runs data centres all over the world, grouped into **regions** (such as `us-east-1` in Virginia or `ap-south-1` in Mumbai). Each region contains multiple isolated **availability zones**. When you create a resource, you choose a region — usually the one closest to your users for lower latency.

Two practical tips for beginners: pick one region and stick to it, because resources in different regions do not see each other by default and it is easy to "lose" a server by looking in the wrong region. And remember that some prices vary slightly between regions.

## The Free Tier, explained honestly

The AWS Free Tier is how most people start. It comes in three flavours, and knowing the difference saves you money:

- **Always free:** services with a permanent free allowance, like a generous amount of Lambda invocations each month.
- **12-month free:** the headline offers — for example, 750 hours per month of a small EC2 instance and a fixed amount of S3 storage — available only for your first year.
- **Trials:** short-term free access to specific services.

The most common beginner mistake is assuming everything is free. It is not. The Free Tier covers specific resource sizes and quantities; go beyond them, or use a service not included, and you are billed. Always set up a **billing alarm** before you do anything else so you get an email if your spend crosses, say, one dollar.

## EC2: renting a virtual computer

EC2 (Elastic Compute Cloud) gives you a virtual server — called an *instance* — that you can log into and run anything on, just like a computer in the cloud. This is the most flexible way to host an application, and the `t2.micro` or `t3.micro` instance size is included in the 12-month Free Tier.

Here is the conceptual flow for launching one:

1. Open the EC2 console and choose **Launch instance**.
2. Pick an operating system image (Amazon Linux or Ubuntu are good defaults).
3. Choose the `t2.micro` (or `t3.micro`) instance type to stay in the Free Tier.
4. Create a **key pair** — this is the SSH key you will use to log in. Download it and keep it safe; you cannot download it again.
5. Configure the **security group**, which is a firewall. Allow SSH (port 22) from your IP, and HTTP (port 80) if you are serving a website.
6. Launch, then connect over SSH.

```bash
# Connect to your instance (replace with your key file and public IP)
chmod 400 my-key.pem
ssh -i my-key.pem ubuntu@<your-instance-public-ip>
```

Once connected, you install your runtime and run your app just as you would on any Linux machine:

```bash
# Example: install Node and run a simple server
sudo apt update && sudo apt install -y nodejs npm
node server.js
```

For production you would put a process manager and a reverse proxy in front, but for your first deployment, getting the app reachable on its public IP is a real milestone.

## S3: storing files and hosting static sites

S3 (Simple Storage Service) stores files — called *objects* — in containers called *buckets*. It is durable, cheap, and scales infinitely, which makes it perfect for images, backups, user uploads, and even hosting an entire static website.

If your project is a static site (plain HTML, or a built React/Next.js export), you may not need EC2 at all. You can upload the files to a bucket, enable static website hosting, and serve them directly. Pair it with CloudFront, Amazon's content delivery network, and your site is fast worldwide for pennies.

A crucial security note: by default, new S3 buckets are private, and that is correct. Only make objects public if you genuinely intend them to be on the open internet. A misconfigured public bucket is one of the most common ways companies accidentally leak data.

## Choosing between EC2 and managed services

EC2 gives you a blank server and total control, but you are responsible for everything: patching the OS, configuring the web server, and keeping it running. For many apps, a managed service is easier:

- **AWS Amplify** or **Elastic Beanstalk** deploy your app from a Git repository and handle the servers for you.
- **Lambda** runs your code without any server at all, billed per request — ideal for APIs with spiky traffic.
- **S3 + CloudFront** is the simplest path for static sites.

A good rule for beginners: start with the most managed option that fits your app. Reach for raw EC2 only when you need the control it provides.

## Avoiding a surprise bill

Cost control is part of using AWS responsibly. Build these habits from day one:

- Set up a **billing alarm** and a monthly **budget** immediately.
- Stop or terminate EC2 instances you are not using — a running instance bills even when idle.
- Delete unused resources entirely. Stopped instances still incur charges for attached storage.
- Watch out for data transfer and resources outside the Free Tier sizes.

When experimenting, terminating everything at the end of a session is the safest habit. You can always recreate it next time.

## Common pitfalls

**Losing your key pair.** Without the private key you cannot SSH into your instance. Store it securely.

**Working in the wrong region.** If your resources seem to have vanished, check the region selector in the top-right of the console.

**Open security groups.** Never open SSH to the whole internet (`0.0.0.0/0`) unless you understand the risk. Restrict it to your own IP.

**Forgetting to clean up.** The number one cause of unexpected bills is leaving resources running after you finish learning.

## Key takeaways

You do not need to master all of AWS to deploy your first app — you need EC2 (a rented virtual server), S3 (file and static-site storage), an understanding of regions, and respect for the Free Tier's limits. Start with the most managed service that fits your project, set a billing alarm before anything else, lock down your security groups and buckets, and always clean up when you are done. With those fundamentals, the rest of AWS becomes far less intimidating.
