# Nimbus Curriculum

The lesson roadmap. Nimbus teaches cloud computing from absolute zero, like a game. Nim guides
the learner, every concept is tied to something real, and each lesson ends in an interactive
stage the learner actually plays with.

The curriculum is split into two parts, in order:

1. **Part 1, Core Concepts (provider neutral).** Understand how everything works first. What a
   load balancer is and how it routes, what a reverse proxy does, how scaling and caching work,
   and so on. No vendor product names yet, just the ideas, made concrete with real examples.
2. **Part 2, Provider Tracks.** Only after the concepts are clear do we get specific: a dedicated
   AWS track, a Google Cloud track, an Azure track. Each re-applies the same concepts using that
   provider's actual services and shows how they differ.

The rule: do not jump to a provider's services before the underlying concept is clear.

Legend: [x] shipped, [ ] planned, (opt) optional or advanced.

## The lesson pattern (every lesson follows this)

- One clear concept per lesson. If it needs two ideas, split it into two lessons.
- A real world tie. No empty jargon. Always answer "what is this in reality?"
- Nim narrates in short paginated beats (`intro: string[]`), then reacts to what the learner
  does on the stage (`reactions` via `onstate`).
- An interactive stage that reacts in real time. The learner does something and sees the
  consequence, not just reads about it.
- Bilingual (Indonesian and English), with language separated from content per lesson
  (`index.ts` config, `id.ts` and `en.ts` text). See AGENTS.md for the recipe and design rules.

# Part 1: Konsep Inti (Core Concepts)

Provider neutral. The "why and how" that everything else builds on. **All shipped and playable.**

## Chapter 1: Client & Server (Client & Server) [shipped]

The physical reality under the word "cloud".

- [x] **Server**. A website is served by a computer somewhere; the client asks, the server
      answers. Stage: open a site and watch the request and response travel between phone and server.
- [x] **Request journey**. A request hops through phone, router, ISP, and the global network, and
      all the way back. Stage: follow the packet station by station.
- [x] **Port**. A server has one address but many numbered doors (ports), one per service, like
      web on 80 and 443, SSH on 22, RDP on 3389. Stage: a building with numbered doors, tap each to
      meet the service waiting behind it, so SSH and RDP ports are known before the cloud chapter.
- [x] **Virtual machine**. One physical server sliced into many isolated virtual computers. Stage:
      split a host into VMs, allocate CPU and RAM, and feel the contention when you over allocate.
- [x] **Laptop as a server**. Your laptop can serve a site, but the home IP changes, it must stay
      on, and uploads are slow. Stage: serve from a laptop and hit each problem.
- [x] **Tunneling**. A borrowed public door (like ngrok) through a third party, fine for demos,
      not production. Stage: open a tunnel and reach the laptop from outside.
- [x] **CLI vs GUI**. Two ways to command a computer, pointing and clicking through a graphical
      interface versus typing a command in a terminal (Linux and Mac Terminal, Windows cmd or
      PowerShell). Stage: one task done both ways, open the Documents folder and see the files.
      In the GUI you click the folder in a file explorer, in the CLI you type into a real terminal
      (cd documents then ls), with friendly errors on a typo. Next unlocks once you do it both ways.

## Chapter 2: The Cloud (Cloud) [shipped]

What the cloud actually is, and what data crosses to reach it.

- [x] **Cloud**. On premise versus cloud; the cloud is just servers in a company's data center.
      Stage: compare a server at home (dies on a power cut) with one rented in the cloud.
- [x] **Remote access**. The rented server sits far away in a data center, so you log in over the
      network, through SSH (a terminal for Linux) or RDP (a desktop for Windows). Stage: connect to
      your server both ways and watch each one open.
- [x] **Cloud services**. The rented server is the core service, a virtual server (a VPS, called
      EC2 on AWS, Compute Engine on Google, Virtual Machines on Azure), and a provider offers a
      whole catalog beyond it. Stage: power on a screen and a marquee of real AWS, Azure, and
      Google Cloud service logos (EC2, S3, Lambda, BigQuery, Cosmos DB, and more) streams past.
      Sets up the chapters that follow.
- [x] **Cable**. Data crosses oceans through real undersea cables, not satellites. Stage: send
      data to a near and a far destination and follow it along the real cable route.
- [x] **Region**. Distance creates latency, so pick the region nearest your users, and each
      provider spreads its regions differently. Stage: pick a provider (AWS, Azure, Google), place a
      server in different cities, and compare a near region with a far one.

## Chapter 3: Resilience & Data (Ketahanan & Data) [shipped]

One copy in one place is fragile. Survive failures, and store data well.

- [x] **Availability Zone**. A region is not one building; it holds several isolated AZs. Opens
      with a real data center strike intro. Stage: spread servers across a region's AZs, trigger an
      outage, and watch the site survive (multiple AZs) or fall (a single AZ).
- [x] **Failover**. A whole region can be lost; keep a standby region and switch automatically.
      Stage: kill the primary with no standby (site down), add a standby, kill again, and traffic
      fails over so the site stays up.
- [x] **Storage types**. Object, block, and file storage, and when to use each. Stage: match each
      shape to the right use case.
- [x] **Databases (SQL versus NoSQL)**. Structured tables with relations versus flexible key or
      document stores, and the trade offs. Stage: model a use case in each and see which fits.

## Chapter 4: Data Flow (Aliran Data) [shipped]

How traffic flows in and out, and where it gets stuck. The primer for the Traffic chapter.

- [x] **Ingress and egress**. Data coming into a server is ingress, data leaving is egress. In the
      cloud, ingress is usually free and egress is usually billed (so downloads drive the bill).
      Stage: visitors upload photos (ingress, free) then download photos (egress, billed) while a
      live egress bill climbs, motivating caching and a CDN later.
- [x] **Bandwidth and throughput**. Bandwidth is the road's maximum capacity (the ceiling),
      throughput is what actually gets through per second. Stage: a video that goes viral; add
      viewers one by one until throughput hits the bandwidth ceiling and some buffer, then upgrade
      bandwidth so every viewer plays HD again. The wrap-up also names RPS, concurrency, and jitter.
      Latency is covered earlier in Region.
- [x] **Bottleneck**. The one point that limits everyone; under heavy traffic a queue piles up and
      the site slows or falls over. Real case of an online shop under load, shown from both sides.
      Stage: add visitors until the single database is overwhelmed (customer side shows the pages
      spinning, developer side shows the queue piling at the one database), then scale the database
      up to flow again, with a nod that widening one point has a ceiling (handled next in Traffic).

## Chapter 5: Traffic (Lalu Lintas) [shipped]

Serve many users at once without falling over.

- [x] **Reverse proxy**. A single front door that receives every request and forwards it to the
      right backend, hiding them. Stage: requests hit the proxy, which routes by path.
- [x] **Load balancer**. Spread requests across identical servers, skipping unhealthy ones. Stage:
      overload one server, add a balancer plus servers, then kill one and watch it route around.
- [x] **Scaling**. Vertical (a bigger machine) versus horizontal (more machines), and the trade
      offs. Stage: a growing workload; upgrade one box versus add more boxes.
- [x] **Auto scaling**. Add and remove capacity automatically as demand rises and falls. Stage: a
      day and night traffic curve, with capacity and the cost meter following it.
- [x] **Caching and CDN**. Keep a copy close to users to skip the long trip. Stage: a far origin
      versus a nearby edge, toggled on a world map, tying back to latency.

## Chapter 6: Networking & Security (Jaringan & Keamanan) [shipped]

How everything connects, is addressed, isolated, and kept safe.

- [x] **IP and DNS**. Every server has an address (IP); DNS turns a name into that address. Stage:
      type a domain and watch it resolve to an IP, then connect.
- [x] **Private networks and subnets**. Public (internet facing) and private (internal only) areas
      of your own network. Stage: put a web server public and a database private, then test what is
      reachable.
- [x] **Firewalls**. Rules that allow or deny traffic by port and source. Stage: toggle rules and
      watch connections pass or get blocked.
- [x] **Identity and Access**. Authentication (who you are) versus authorization (what you may
      do), and least privilege. Stage: assign scoped permissions and try an allowed versus a denied
      action.
- [x] **Encryption**. Scramble data at rest and in transit so only key holders can read it. Stage:
      send data readable versus encrypted, tying back to the Cable lesson.
- [x] **Shared responsibility**. The provider secures the cloud, you secure what you put in it.
      Stage: sort responsibilities into the "provider" and "you" buckets.

## Chapter 7: Compute & Operations (Komputasi & Operasi) [shipped]

The ways to run code, and running it well without overpaying.

- [x] **Containers**. Package an app with everything it needs so it runs the same anywhere, and
      lighter than a VM. Stage: build an image and run the same container in several places.
- [x] **Serverless**. Write a function; the platform runs it on demand and scales to zero, you pay
      per call. Stage: compare an always on server with serverless for rare, bursty traffic.
- [x] **Monitoring**. Metrics, logs, and alarms so you know what is happening. Stage: watch the
      gauges and set an alarm.
- [x] **Cost**. Pay as you go, and right sizing to save. Stage: a live bill; turn off an idle
      server and shrink an oversized one, and watch the number drop.

## Gateway: Provider Tracks (Jalur Provider) [shipped]

- [x] **Pick your track**. With Part 1's concepts in hand, choose the provider to learn next, AWS,
      Google Cloud, or Azure. This is the handoff from Part 1 into Part 2.

# Part 2: Jalur Provider (Provider Tracks) [planned]

Only after Part 1. Each track re-applies the concepts above using that provider's real services,
side by side so the learner sees the same idea wearing different names, plus what is unique to
each. Lessons will be detailed as each track is built.

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
- An end to end capstone build (assemble a full architecture, then pass a traffic spike, a zone
  outage, and a far away user).
- A sandbox mode to freely build an architecture without a lesson.
