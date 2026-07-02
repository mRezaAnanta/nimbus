# References

The sources behind Nimbus lessons, so the material is accountable and easy to keep accurate. For
each concept we lean on one primary, vendor neutral source, then compare it against the three
providers (AWS, Google Cloud, Azure). Nim always explains in his own words. We paraphrase and cite,
we never copy text or images.

Links verified June 2026.

## Primary sources (the backbone)

- **NIST SP 800-145, The NIST Definition of Cloud Computing** (public domain). The authoritative,
  vendor neutral definition with the five essential characteristics, the service models
  (IaaS, PaaS, SaaS), and the deployment models.
  [csrc.nist.gov](https://csrc.nist.gov/pubs/sp/800/145/final)
- **AWS Well-Architected Framework**. Best practices and shared vocabulary across six pillars. See
  the [framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html) and
  [the six pillars](https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html).
- **Google Cloud Well-Architected Framework**. See the
  [framework](https://docs.cloud.google.com/architecture/framework) and the
  [Architecture Center](https://docs.cloud.google.com/architecture).
- **Microsoft Azure Well-Architected Framework**, plus the free Azure Fundamentals (AZ-900)
  training whose beginner structure is a good model. See the
  [framework](https://learn.microsoft.com/en-us/azure/well-architected/) and the
  [AZ-900 cloud concepts path](https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/).
- **Cloudflare Learning Center**. Plain language, vendor neutral explanations of networking, CDN,
  DNS, latency, and security. [cloudflare.com/learning](https://www.cloudflare.com/learning/)
- **MDN Web Docs** (CC-BY-SA, reusable with attribution). The web layer, meaning client and server
  and HTTP.
  [How the web works](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works)

## By chapter and lesson

### Chapter 1: Client & Server

- **Server.** MDN
  [Client-server overview](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Client-Server_overview),
  [What is a web server](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_web_server),
  and the [HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview).
- **Request journey.** MDN
  [How the web works](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works),
  with Cloudflare [What is DNS](https://www.cloudflare.com/learning/dns/what-is-dns/) for the name
  lookup step.
- **API.** MDN
  [Introduction to web APIs](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Client-side_APIs/Introduction),
  on a frontend asking a backend for data rather than a page, plus MDN
  [HTTP request methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods)
  and [Sending form data](https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_and_retrieving_form_data)
  for GET, POST, PUT, DELETE and the fact that HTML forms only speak GET and POST.
- **API styles (sub-section).** REST per Roy Fielding's
  [2000 dissertation](https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm);
  [GraphQL](https://en.wikipedia.org/wiki/GraphQL) (Facebook, internal 2012, open-sourced 2015);
  [gRPC](https://en.wikipedia.org/wiki/GRPC) (Google, successor to Stubby, HTTP/2 plus Protocol Buffers);
  MDN [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) for the open two-way
  line that replaced polling; and
  [webhooks](https://en.wikipedia.org/wiki/Webhook) for the server calling you on an event.
- **Port.** The IANA
  [Service Name and Transport Protocol Port Number Registry](https://www.iana.org/assignments/service-names-port-numbers),
  the canonical owner of 22, 80, 443, 3389, and the rest.
- **Virtual machine.** AWS
  [What is a virtual machine](https://aws.amazon.com/what-is/virtual-machine/), which covers the
  hypervisor slicing one host into many. Compare with the VM services on each provider (EC2,
  Compute Engine, Virtual Machines).
- **Laptop as a server** and **Tunneling.** ngrok
  [documentation](https://ngrok.com/docs/getting-started) for the borrowed public door. The rest
  (a home IP that changes, uptime, slow uploads) is general networking knowledge.
- **CLI vs GUI.** The vendor docs for the real tools, meaning the shells on Linux, macOS, and
  Windows. General computing literacy, no single canonical source.

### Chapter 2: The Cloud

- **Cloud.** NIST [definition](https://csrc.nist.gov/pubs/sp/800/145/final), compared with
  AWS [What is cloud computing](https://aws.amazon.com/what-is-cloud-computing/),
  Google [What is cloud computing](https://cloud.google.com/learn/what-is-cloud-computing), and
  Microsoft [Describe cloud computing](https://learn.microsoft.com/en-us/training/modules/describe-cloud-compute/).
- **Remote access.** AWS
  [Connect to a Linux instance over SSH](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect-linux-inst-ssh.html)
  and Microsoft
  [Understanding Remote Desktop Protocol](https://learn.microsoft.com/en-us/troubleshoot/windows-server/remote/understanding-remote-desktop-protocol).
- **Cloud services.** The provider product catalogs, for example
  [AWS products](https://aws.amazon.com/products/).
- **Cable.** TeleGeography [Submarine Cable Map](https://www.submarinecablemap.com/), already
  attributed in the lesson.
- **Region.** AWS
  [Global Infrastructure, Regions and Availability Zones](https://aws.amazon.com/about-aws/global-infrastructure/regions_az/)
  and Cloudflare
  [What is latency](https://www.cloudflare.com/learning/performance/glossary/what-is-latency/).

### Chapter 3: Resilience & Data

- **Availability Zone.** AWS
  [Availability Zones](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-availability-zones.html)
  and the
  [AWS fault isolation boundaries whitepaper](https://docs.aws.amazon.com/whitepapers/latest/aws-fault-isolation-boundaries/availability-zones.html).
- **Failover.** AWS Well-Architected
  [Reliability pillar](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html).
- **Storage types.** AWS
  [Block vs file vs object storage](https://aws.amazon.com/compare/the-difference-between-block-file-object-storage/)
  and [What is object storage](https://aws.amazon.com/what-is/object-storage/).
- **Databases (SQL vs NoSQL).** AWS
  [Relational vs non-relational](https://aws.amazon.com/compare/the-difference-between-relational-and-non-relational-databases/)
  and DynamoDB
  [From SQL to NoSQL](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SQLtoNoSQL.WhyDynamoDB.html).

### Chapter 4: Data Flow (Aliran Data)

- **Ingress and egress.** Cloudflare
  [What is AWS data transfer pricing](https://www.cloudflare.com/learning/cloud/what-is-aws-data-transfer-pricing/)
  and AWS
  [Understanding data transfer charges](https://docs.aws.amazon.com/cur/latest/userguide/cur-data-transfers-charges.html).
- **Bandwidth and throughput.** TechTarget
  [Network bandwidth vs throughput](https://www.techtarget.com/searchnetworking/feature/Network-bandwidth-vs-throughput-Whats-the-difference)
  (the same pipe and water idea the lesson uses), with Cloudflare
  [How CDNs reduce bandwidth cost](https://www.cloudflare.com/learning/cdn/how-cdns-reduce-bandwidth-cost/)
  on bandwidth as data transfer.
- **Bottleneck.** AWS Well-Architected
  [Performance Efficiency pillar](https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/welcome.html).

### Chapter 5: Traffic

- **Reverse proxy.** Cloudflare
  [What is a reverse proxy](https://www.cloudflare.com/learning/cdn/glossary/reverse-proxy/).
- **Load balancer.** Cloudflare
  [What is load balancing](https://www.cloudflare.com/learning/performance/what-is-load-balancing/),
  which also covers skipping a failed server.
- **Scaling** and **Auto scaling.** AWS Well-Architected
  [Performance Efficiency pillar](https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/welcome.html),
  compared with each provider's auto scaling docs.
- **Caching and CDN.** Cloudflare
  [What is a CDN](https://www.cloudflare.com/learning/cdn/what-is-a-cdn/).

### Chapter 6: Networking & Security

- **IP and DNS.** Cloudflare
  [What is the Internet Protocol](https://www.cloudflare.com/learning/network-layer/internet-protocol/)
  for IP, and [What is DNS](https://www.cloudflare.com/learning/dns/what-is-dns/) for the name to
  address lookup.
- **Layers and packets.** Cloudflare
  [What is the OSI model](https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/)
  for the layered stack,
  [What is TCP/IP](https://www.cloudflare.com/learning/ddos/glossary/tcp-ip/) for reliable delivery,
  and [What is UDP](https://www.cloudflare.com/learning/ddos/glossary/user-datagram-protocol-udp/)
  for the fast, lossy alternative.
- **Private networks and subnets.** AWS
  [What is Amazon VPC](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html),
  which defines subnets and public versus private.
- **Firewalls.** Cloudflare
  [What is a firewall](https://www.cloudflare.com/learning/security/what-is-a-firewall/).
- **Identity and Access.** AWS
  [What is IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html).
- **Encryption.** Cloudflare
  [What is SSL](https://www.cloudflare.com/learning/ssl/what-is-ssl/) and
  [Transport Layer Security (TLS)](https://www.cloudflare.com/learning/ssl/transport-layer-security-tls/).
- **Shared responsibility.** AWS
  [Shared Responsibility Model](https://aws.amazon.com/compliance/shared-responsibility-model/) and
  the Well-Architected
  [Security pillar version](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/shared-responsibility.html).

### Chapter 7: Compute & Operations

- **Containers.** Docker
  [What is a container](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/),
  Kubernetes [Concepts](https://kubernetes.io/docs/concepts/), and the
  [CNCF](https://www.cncf.io/).
- **Microservices.** AWS
  [Monolithic vs microservices architecture](https://aws.amazon.com/compare/the-difference-between-monolithic-and-microservices-architecture/),
  on splitting one app into small services that each do one job and talk over APIs.
- **Serverless.** AWS [What is Lambda](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
  and the [product page](https://aws.amazon.com/lambda/).
- **Monitoring.** AWS Well-Architected
  [Operational Excellence pillar](https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/welcome.html).
- **Cost.** AWS Well-Architected
  [six pillars](https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html)
  (Cost Optimization), compared with each provider's pricing and cost tools.
- **CI/CD.** GitLab
  [CI/CD concepts](https://docs.gitlab.com/ee/ci/introduction/), a vendor neutral explanation of
  building, testing, and deploying every change automatically.

## Licensing and responsible use

- **NIST** publications are public domain.
- **MDN Web Docs** is CC-BY-SA, so it can be reused with attribution.
- **Provider docs** (AWS, Google, Microsoft) and the **Cloudflare Learning Center** are copyrighted.
  Read them, then write the lesson in Nim's own words and cite the source. Do not copy text or
  images.
- **TeleGeography** cable data is shown with attribution in the Cable lesson.
- **Provider logos** are trademarks of their owners and appear only to identify each provider.
