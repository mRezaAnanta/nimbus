# References

The sources behind Nimbus lessons, so the material is accountable and easy to keep accurate. For
each concept we lean on one primary, vendor neutral source, then cross check it against the three
providers (AWS, Google Cloud, Azure). Nim always explains in his own words. We paraphrase and cite,
we never copy text or images.

Links verified June 2026.

## Primary sources (the backbone)

- **NIST SP 800-145, The NIST Definition of Cloud Computing** (public domain). The authoritative,
  vendor neutral definition: the five essential characteristics, the service models
  (IaaS, PaaS, SaaS), and the deployment models. [csrc.nist.gov](https://csrc.nist.gov/pubs/sp/800/145/final)
- **AWS Well-Architected Framework**. Best practices and shared vocabulary across six pillars.
  [Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html) ·
  [The six pillars](https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html)
- **Google Cloud Well-Architected Framework** and Architecture Center.
  [Framework](https://docs.cloud.google.com/architecture/framework) ·
  [Architecture Center](https://docs.cloud.google.com/architecture)
- **Microsoft Azure Well-Architected Framework**, plus the free Azure Fundamentals (AZ-900)
  training, whose beginner structure is a good model.
  [Framework](https://learn.microsoft.com/en-us/azure/well-architected/) ·
  [AZ-900 cloud concepts path](https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/)
- **Cloudflare Learning Center**. Plain language, vendor neutral explanations of networking, CDN,
  DNS, latency, and security. [cloudflare.com/learning](https://www.cloudflare.com/learning/)
- **MDN Web Docs** (CC-BY-SA, reusable with attribution). The web layer: client and server, HTTP.
  [How the web works](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works)

## By chapter and lesson

### Chapter 1: Client & Server

- **Server** → MDN [Client-server overview](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Client-Server_overview),
  [What is a web server](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_web_server),
  [HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview).
- **Request journey** → MDN [How the web works](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works);
  Cloudflare [What is DNS](https://www.cloudflare.com/learning/dns/what-is-dns/).
- **Port** → IANA [Service Name and Transport Protocol Port Number Registry](https://www.iana.org/assignments/service-names-port-numbers)
  (the canonical owner of 22, 80, 443, 3389, and the rest).
- **Virtual machine** → NIST 800-145 (resource pooling); cross-check provider compute docs
  (AWS EC2, Google Compute Engine, Azure Virtual Machines) via [AWS compute](https://aws.amazon.com/products/compute/).
- **Laptop as a server** and **Tunneling** → ngrok [documentation](https://ngrok.com/docs/getting-started)
  for the borrowed public door pattern.
- **CLI vs GUI** → vendor docs for the real tools (the shells on Linux, macOS, and Windows). General
  computing literacy, no single canonical source.

### Chapter 2: The Cloud

- **Cloud** → NIST [definition](https://csrc.nist.gov/pubs/sp/800/145/final); cross-check
  AWS [What is cloud computing](https://aws.amazon.com/what-is-cloud-computing/),
  Google [What is cloud computing](https://cloud.google.com/learn/what-is-cloud-computing),
  Microsoft [Describe cloud computing](https://learn.microsoft.com/en-us/training/modules/describe-cloud-compute/).
- **Remote access** → AWS [Connect to a Linux instance over SSH](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect-linux-inst-ssh.html);
  Microsoft [Understanding Remote Desktop Protocol](https://learn.microsoft.com/en-us/troubleshoot/windows-server/remote/understanding-remote-desktop-protocol).
- **Cloud services** → the provider product catalogs, for example [AWS products](https://aws.amazon.com/products/).
- **Cable** → TeleGeography [Submarine Cable Map](https://www.submarinecablemap.com/) (already
  attributed in the lesson).
- **Region** → AWS [Global Infrastructure, Regions and AZs](https://aws.amazon.com/about-aws/global-infrastructure/regions_az/);
  Cloudflare [What is latency](https://www.cloudflare.com/learning/performance/glossary/what-is-latency/).

### Chapter 3: Resilience & Data

- **Availability Zone** → AWS [Availability Zones](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-availability-zones.html)
  and the [AWS fault isolation boundaries whitepaper](https://docs.aws.amazon.com/whitepapers/latest/aws-fault-isolation-boundaries/availability-zones.html).
- **Failover** → AWS Well-Architected [Reliability pillar](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html).
- **Storage types** → AWS [Block vs file vs object storage](https://aws.amazon.com/compare/the-difference-between-block-file-object-storage/)
  and [What is object storage](https://aws.amazon.com/what-is/object-storage/).
- **Databases (SQL vs NoSQL)** → AWS [Relational vs non-relational](https://aws.amazon.com/compare/the-difference-between-relational-and-non-relational-databases/)
  and DynamoDB [From SQL to NoSQL](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SQLtoNoSQL.WhyDynamoDB.html).

### Chapter 4: Data Flow (Aliran Data)

- **Ingress and egress** → Cloudflare [What is AWS data transfer pricing](https://www.cloudflare.com/learning/cloud/what-is-aws-data-transfer-pricing/);
  AWS [Understanding data transfer charges](https://docs.aws.amazon.com/cur/latest/userguide/cur-data-transfers-charges.html).
- **Bandwidth and throughput** → Cloudflare [What is latency](https://www.cloudflare.com/learning/performance/glossary/what-is-latency/)
  and [How CDNs reduce bandwidth cost](https://www.cloudflare.com/learning/cdn/how-cdns-reduce-bandwidth-cost/)
  (bandwidth as data transfer).
- **Bottleneck** → AWS Well-Architected [Performance Efficiency pillar](https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/welcome.html).

### Chapter 5: Traffic

- **Reverse proxy** → Cloudflare [What is a reverse proxy](https://www.cloudflare.com/learning/cdn/glossary/reverse-proxy/).
- **Load balancer** → Cloudflare [What is DNS-based load balancing](https://www.cloudflare.com/learning/performance/what-is-dns-load-balancing/)
  and [CDN reliability and load balancing](https://www.cloudflare.com/learning/cdn/cdn-load-balance-reliability/).
- **Scaling** and **Auto scaling** → AWS Well-Architected [Performance Efficiency pillar](https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/welcome.html);
  cross-check provider auto scaling docs.
- **Caching and CDN** → Cloudflare [What is a CDN](https://www.cloudflare.com/learning/cdn/what-is-a-cdn/).

### Chapter 6: Networking & Security

- **IP and DNS** → Cloudflare [What is DNS](https://www.cloudflare.com/learning/dns/what-is-dns/).
- **Private networks and subnets** → AWS [What is Amazon VPC](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)
  (defines subnets and public vs private).
- **Firewalls** → Cloudflare [What is a firewall](https://www.cloudflare.com/learning/security/what-is-a-firewall/).
- **Identity and Access** → AWS [What is IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html).
- **Encryption** → Cloudflare [What is SSL](https://www.cloudflare.com/learning/ssl/what-is-ssl/)
  and [Transport Layer Security (TLS)](https://www.cloudflare.com/learning/ssl/transport-layer-security-tls/).
- **Shared responsibility** → AWS [Shared Responsibility Model](https://aws.amazon.com/compliance/shared-responsibility-model/)
  and the Well-Architected [Security pillar version](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/shared-responsibility.html).

### Chapter 7: Compute & Operations

- **Containers** → Docker [What is a container](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/),
  Kubernetes [Concepts](https://kubernetes.io/docs/concepts/), and the [CNCF](https://www.cncf.io/).
- **Serverless** → AWS [What is Lambda](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
  ([product page](https://aws.amazon.com/lambda/)).
- **Monitoring** → AWS Well-Architected [Operational Excellence pillar](https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/welcome.html).
- **Cost** → AWS Well-Architected [the six pillars](https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html)
  (Cost Optimization); cross-check provider pricing and cost tools.

## Licensing and responsible use

- **NIST** publications are public domain.
- **MDN Web Docs** is CC-BY-SA, so it can be reused with attribution.
- **Provider docs** (AWS, Google, Microsoft) and the **Cloudflare Learning Center** are copyrighted.
  Read them, then write the lesson in Nim's own words and cite the source. Do not copy text or
  images.
- **TeleGeography** cable data is shown with attribution in the Cable lesson.
- **Provider logos** are trademarks of their owners and appear only to identify each provider.
