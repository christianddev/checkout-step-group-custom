declare module '*.gql' {
  import { DocumentNode } from 'graphql'

  const query: DocumentNode

  export default query
}

declare module '*.graphql' {
  import { DocumentNode } from 'graphql'

  const value: DocumentNode
  export default value
}

