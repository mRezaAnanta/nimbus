# Nimbus Curriculum

The lesson roadmap. Nimbus teaches cloud computing from absolute zero, like a game. Nim guides
the learner, every concept is tied to something real, and each lesson ends in an interactive
stage the learner actually plays with.

The curriculum is split into two parts, in order:

1. **Part 1, Core Concepts (provider neutral).** Understand how everything works first. What a
   load balancer is and how it routes, what a reverse proxy does, how scaling and caching work,
   and so on. No vendor product names yet, just the ideas, made concrete with real examples.
2. **Part 2, Provider Tracks.** Only after the concepts are clear do we get specific: a dedicated
   AWS track, a GCP track, an Azure track. Each one re-applies the same concepts using that
   provider's actual services and shows how they differ.

The rule: do not jump to a provider's services before the underlying concept is clear.

Use this file to see what each chapter contains and what is left to build. When a lesson ships,
tick its box.

## The lesson pattern (every lesson follows this)

- One clear concept per lesson. If it needs two ideas, split it into two lessons.
- A real world tie. No empty jargon. Always answer "what is this in reality?"
- Nim narrates in short paginated beats (`intro: string[]`), then reacts to what the learner
  does on the stage (`reactions` via `onstate`).
- An interactive stage that reacts in real time. The learner does something and sees the
  consequence, not just reads about it.
- Concepts first. Part 1 stays provider neutral, using concrete examples (often AWS, since it is
  the most common) only to stay tangible. Vendor specific products live in Part 2.
- Bilingual (Indonesian and English), with language separated from content per lesson
  (`index.ts` config, `id.ts` and `en.ts` text). See AGENTS.md for the recipe.
- Minimalist and clean. No dashes as separators, no emoji spam, no purple gradients.

Legend: [x] shipped, [ ] planned, (opt) optional or advanced.

# Part 1: Konsep Inti (Core Concepts)

Provider neutral. The "why and how" that everything else builds on.

## Chapter 1: Fondasi (Foundations) [shipped]

The physical reality under the word "cloud".

- [x] **Server**. A website is served by a computer somewhere. Stage: click "Open website" and
  watch the request and response between your phone and the server.
- [x] **Cloud**. On premise versus cloud. The cloud is just servers in someone else's data
  center. Stage: compare keeping the server at home (dies on a power cut) versus renting it.
- [x] **Region**. Distance creates latency, so pick the location nearest your users. Stage:
  place your server in different cities and measure the latency.
- [x] **Cable**. Data crosses oceans through real undersea cables, not satellites. Stage: send
  data from Argentina to a far data center and follow it along the real cable route.

## Chapter 2: Ketahanan (Resilience) [shipped]

One copy in one place is fragile. Survive failures.

- [x] **Availability Zone**. Opens with a real 2026 event: a drone-strike animation on a data
  center plus news popups (drones struck AWS data centers in the UAE and Bahrain), with Next
  locked until it plays, to show physical threats are real. Then teaches that a region holds
  several isolated AZs, and (on entering a region) that the a/b/c naming is shuffled per account
  and kept secret. Stage: a world map with two clickable regions (Virginia, Singapore); click to
  open a close-up of that region's real boundary and AZs, spread servers across them, trigger an
  outage, and watch the site go down (single AZ) or survive (multiple AZs).
- [x] **Failover**. Escalates from one AZ to a whole region being lost (tied to the same
  Middle East data center strikes): keep a standby region and switch to it automatically. Stage:
  on the world map a primary region (Virginia) serves; kill it with no standby and the site goes
  down; click another region (Singapore) to make it a standby, kill the primary again, and a
  drone strike on the primary triggers failover so the site stays up.

## Chapter 3: Lalu Lintas (Traffic) [next]

Serve many users at once without falling over.

- [ ] **Reverse Proxy**. A single front door that receives every request and forwards it to the
  right server behind it, hiding the backends. Stage: requests hit the proxy, which routes by
  path (the site versus the API) and keeps the real servers hidden. Reality tie: a receptionist.
- [ ] **Load Balancer**. Spread requests across many identical servers, skipping any that are
  unhealthy. Stage: traffic overloads one server (red), add a balancer plus servers so it splits
  evenly, then kill one server and watch the balancer route around it. Reality tie: a greeter
  sending each customer to the shortest checkout line.
- [ ] **Scaling**. Vertical (a bigger machine) versus horizontal (more machines), and the trade
  offs. Stage: a growing workload; try a bigger box (hits a ceiling, costly) versus more boxes.
- [ ] **Auto Scaling**. Add and remove capacity automatically as demand rises and falls. Stage:
  a day and night traffic graph; capacity follows the curve, and so does the cost meter.
- [ ] **Caching and CDN**. Keep a ready copy close to where it is needed to avoid repeating work
  and long trips. Stage: the first request travels far, then a nearby cache answers instantly;
  a CDN puts caches near users worldwide. Reuses the world map and ties back to latency.

## Chapter 4: Komputasi (Compute) [planned]

The different ways to run code.

- [ ] **Virtual Machine**. One physical server sliced into many isolated virtual computers.
  Reality tie: an apartment building, one structure with many independent units. Stage: split a
  host into VMs, allocate CPU and RAM, over allocate and feel the contention.
- [ ] **Container**. Package an app with everything it needs so it runs the same anywhere, and
  lighter than a VM. Reality tie: a standard shipping container. Stage: ship an app as a
  container and run it identically on different hosts; compare size and startup with a VM.
- [ ] **Serverless**. Write a function, the platform runs it on demand and scales to zero, you
  pay per call. Reality tie: motion sensor lights. Stage: compare an always on server with
  serverless for rare, bursty traffic (idle cost versus per call cost).

## Chapter 5: Penyimpanan (Storage) [planned]

Where data lives and how it stays safe.

- [ ] **Storage types**. Object (whole files by key), block (a raw disk), and file (a shared
  folder). Reality tie: a parcel locker, a hard drive, a shared drive. Stage: pick the right one
  for a use case (photos versus a database disk versus shared documents).
- [ ] **Databases (SQL versus NoSQL)**. Structured tables with relations and queries versus
  flexible key or document stores, and the trade offs. Stage: model a use case in each and see
  which fits (bank transactions versus a huge simple lookup).
- [ ] **Replication and Backups**. Keep copies for durability and recovery; replicas versus
  backups. Reality tie: photocopies kept in different buildings. Stage: lose a copy and recover.
- [ ] (opt) **In memory cache**. A fast scratchpad in front of the database for hot data.

## Chapter 6: Jaringan (Networking) [planned]

How everything connects, addressed, and isolated.

- [ ] **IP and DNS**. Every server has an address (IP); DNS turns a name into that address.
  Reality tie: phone numbers and a phonebook. Stage: type a domain and watch it resolve to an IP
  then connect (callback to the Server lesson).
- [ ] **Private networks and subnets**. Your own isolated network with public (internet facing)
  and private (internal only) areas. Reality tie: a building with a public lobby and staff only
  floors. Stage: put a web server public and a database private, then test what is reachable.
- [ ] **Firewall**. Rules that allow or deny traffic by port and source. Reality tie: a bouncer
  with a guest list. Stage: toggle rules and watch connections succeed or get blocked.
- [ ] (opt) **NAT and gateways**. How private machines reach out without being reachable.

## Chapter 7: Keamanan (Security) [planned]

Keeping it safe and private.

- [ ] **Identity and Access**. Authentication (who you are) versus authorization (what you may
  do), and least privilege. Reality tie: an ID badge and which doors it opens. Stage: assign
  scoped permissions and try an allowed action versus a denied one.
- [ ] **Encryption**. Scramble data at rest and in transit so only key holders can read it.
  Reality tie: a locked box. Stage: send data over a cable readable versus encrypted, tying back
  to the Cable lesson.
- [ ] **Shared responsibility**. The provider secures the cloud, you secure what you put in it.
  Stage: sort responsibilities into the "provider" and "you" buckets.

## Chapter 8: Operasi (Operations) [planned]

Running it well, and not overpaying.

- [ ] **Monitoring and Observability**. Metrics, logs, and alarms so you know what is happening.
  Reality tie: a car dashboard. Stage: watch the gauges and set an alarm that triggers scaling.
- [ ] **Cost model**. Pay as you go, no big upfront cost, and right sizing to save. Reality tie:
  a utility bill versus buying your own generator. Stage: a live cost meter as you add and remove
  resources; trim an over provisioned setup.
- [ ] (opt) **Infrastructure as Code**. Define the whole setup in code so it is reproducible.

## Chapter 9: Proyek Akhir (Capstone) [planned]

- [ ] **Design the architecture**. With concepts only (no vendor names), assemble a resilient,
  scalable design for a sample app: DNS, then a CDN, then a reverse proxy and load balancer, then
  auto scaled compute across zones, then a database with replication and backups. Pass challenges:
  a traffic spike, a zone outage, and a far away user.

# Part 2: Jalur Provider (Provider Tracks) [later]

Only after Part 1. Each track re-applies the concepts above using that provider's real services,
side by side so the learner sees the same idea wearing different names, plus what is unique to
each. Lessons will be detailed when Part 1 is close to done.

## Track A: AWS [planned]

- [ ] Compute: EC2, Auto Scaling, Lambda, ECS and Fargate
- [ ] Storage and data: S3, EBS, RDS, DynamoDB
- [ ] Networking: VPC and subnets, Security Groups, Route 53, CloudFront, Elastic Load Balancing
- [ ] Security and ops: IAM, KMS, CloudWatch
- [ ] AWS capstone: build the Part 1 architecture with real AWS services

## Track B: Google Cloud (GCP) [planned]

- [ ] Map the same concepts to Compute Engine, Cloud Storage, Cloud SQL and Firestore, VPC,
  Cloud Load Balancing, Cloud CDN, Cloud DNS, IAM, Cloud Functions, Cloud Monitoring
- [ ] GCP capstone

## Track C: Microsoft Azure [planned]

- [ ] Map the same concepts to Virtual Machines, Blob Storage, Azure SQL and Cosmos DB, VNet,
  Azure Load Balancer and Front Door, Azure DNS, Entra ID, Functions, Azure Monitor
- [ ] Azure capstone

## Ideas parked for later

- A side by side "same concept, three providers" comparison view.
- Achievements or a progress map screen (the Clash of Clans base view).
- A sandbox mode to freely build an architecture without a lesson.
