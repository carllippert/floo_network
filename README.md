## _Productivity_ is a low level building block for human centric crypto systems

### WTF does that mean?

#### Think of it like an open database for all human work

#### If your a defi person think of it as a global liquidity pool for work

#### It is a smart contract, a flexible metadata standard, and 3 economic incentives

#### Incentives:

1. For systems that generate NFT's of work to be done
2. For systems that find the best humans ( and systems ) to complete tasks
3. For humans ( and systems ) to complete work

Simply speaking it creates an open, free, indexible database of all human work to create huge new opportunities for humanity to live more human lives.

## Examples: 👇

#### Salesforse <-> NFT <-> Airtable

-> interoperability interface between different project management tools

#### Decentralized Upwork

-> a global database for gig work that anyone can curate over to create ∞ vertical job marketplaces

#### Kleros 2.0 for X

-> Human in hte loop crypto systems should not have to one by one try to onboard humans.
-> You can rebuild things like kleros with this building block and start sourcing from a global pool of labor
-> incentive models built on top via "modules" similar to Lens Protocol & Decentralized ID + attestations

#### How can a smart contract call a human in 5 years without knowing who in advance?

-> Smart contracts being able to initiate tasks for humans opens a lot of doors for decentralized applications

---

Interested in helping build this protocol?
Reach out to carllipppert.eth
https://twitter.com/carllippert

---

#### Related Reading:

https://latecheckout.substack.com/p/a-day-in-the-life-of-a-crypto-fueled?s=r

https://otherinter.net/research/positive-sum-worlds/

https://station.mirror.xyz/NDGEJB_SUCUVr9ixDwby4D0p_hhwVK3IF0jlixI9B1w

https://gov.gitcoin.co/t/the-internet-of-jobs-is-here/9340

https://newsletter.banklesshq.com/p/the-internet-of-jobs-is-coming?s=r

https://mirror.xyz/reneedaos.eth/0N5qpv-lUFHpcddgTF9N0rKu0DSZ27kJq7MFC_u1RiQ

https://jacob.energy/hyperstructures.html

https://shift.beehiiv.com/p/layer3-future-work-web3

https://medium.com/1kxnetwork/unbundling-the-unit-economics-of-venture-capital-via-daos-9fbda3e8113b

https://future.a16z.com/reputation-based-systems

## Expected Roadmap Goals

1. Implement privacy for metadata via Litprotocol or other
   - Much of work is not meant to be public, and has negative value being so
   - Think of each job being a sealed envelope
2. Zero Knowledge Claims
   - Whitelisting via merkle trees is insufficient for determinging who is allowed or disallowed to do, or see, work to be done.
   - Aggregate identites via NFT's and other attestations need to be able to be proved off chain and in the future without requireing updating and generating what could become ultra large Merkle Trees of millions of addresses
3. Hooks implementation for the creation for main contract functions for composability of higher orders sytems
   - Allow creation of systems for determining that work was done, and the yik-yak of back and forth that exists in this realm
   - Allow creation of Dutch Auction etc type incentives for payment for time sensitive work like uber for x, customer support, emergency services, etc
4. ERC20 Support
   - Need to allow payment in any coin, and meta transactions interfaces to allow, scholorship, subsidy etc by higher order systems
5. Shopify for labor marketplace
   - a mock, live implementation of what building a crypto native vertical labor marketplace would look like by indexing, and filtering, specific work types over the graph

## Initial Onboarding Targets

DAO's where work transparency is a value creator not destroyer.

Service DAO's and inter DAO workflows to test if this idea is batshit or what narrative / technology improvements are needed for success.

---

Demo Stack:

### NextJS

### TaliwindCSS

### DaisyUI

### Rainbowkit

### Foundry

forge init contracts --no-git --vscode
may need to fuck with remappings.txt

## How to start ( Actually this is currently blocked by some bugs between foundry and local graph )

1. Start Local Blockchain @ /contracts
   anvil --host 0.0.0.0
2. Deploy contracts @ /contracts
   make all
3. Start Local Graph Node @/local_graph_node/docker
   docker-compose up
   mas detalle: https://thegraph.academy/developers/local-development/
4. Deploy Local Subgraph
   yarn && yarn codegen && yarn create-local && yarn deploy-local
5. Start Next
   yarn dev

   graphiql?
   echo NEXT_APP_GRAPHQL=http://localhost:8000/subgraphs/name/<GITHUB_USERNAME>/<SUBGRAPH_NAME>' > .env
