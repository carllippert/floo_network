#### Humanities escape from bullshit jobs

This is just a demo.

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
