## *Productivity* is a low level building block for human centric crypto systems

### WTF does that mean?

#### Think of it like an open database for all human work
#### If your a defi person think of it as a global liquidity pool for work

#### It is a smart contract, a flexible metadata standard, and 3 economic incentives

#### Incentives: 

1. For systems that generate NFT's of work to be done
2. For systems that find the best humans ( and systems ) to complete tasks
3. For humans ( and systems ) to complete work

Simply its a s stakeholders to have an economic reason to participate and new business models that promote freedom.

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

-------

Interested in helping build this protocol? 
Reach out to carllipppert.eth
https://twitter.com/carllippert

------

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


Demo Stack:

### NextJS

### TaliwindCSS

### DaisyUI

### Rainbowkit

### Foundry

forge init contracts --no-git --vscode
may need to fuck with remappings.txt

## How to start

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
