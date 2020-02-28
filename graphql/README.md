# GraphQL

The JavaScript reference implementation for GraphQL, a query language for APIs created by Facebook.

See more complete documentation at [https://graphql.org/](https://graphql.org/) and [https://graphql.org/graphql-js/](https://graphql.org/graphql-js/).

## Types

The most basic components of a GraphQL schema are object types, which just represent a kind of object you can fetch from your service, and what fields it has. In the GraphQL schema language, we might represent it like this:

```javascript
const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLID,
  GraphQLFloat
} = require("graphql");

const CashJournalType = new GraphQLObjectType({
  name: "CashJournal",
  fields: {
    uuid_journal_caisse: { type: GraphQLID },
    dateJournal: { type: GraphQLString },
    stat_nb_ticket: { type: GraphQLInt },
    stat_panier_moy: { type: GraphQLFloat },
    stat_nb_annul: { type: GraphQLInt },
    stat_nb_remise: { type: GraphQLInt },
    stat_nb_art_promo: { type: GraphQLInt },
    stat_nb_retour: { type: GraphQLInt },
    stat_temps_travail: { type: GraphQLInt },
    stat_pmarge: { type: GraphQLFloat },
    stat_mnt_marge: { type: GraphQLFloat },
    stat_nb_article: { type: GraphQLInt }
  }
});
```

Each types need a name provided and a subsequences of fields that declare our type.

## Resolvers

Each field on each type is backed by a function called the resolver which is provided by the GraphQL server developer. When a field is executed, the corresponding resolver is called to produce the next value.

```javascript
const cash_journals = {
  // Declare the type that the resolver need to return
  type: new GraphQLList(CashJournalType),

  // async resolver
  async resolve(root, args, context) {
    // Querying the database ans return the result
    // Make sure of what you return from here.
    // If you don't have the same structure as your type above,
    // It will throw an error or your field will be `null`
    const data = await DB.queryAsync("SELECT * from journal_caisse");
    return data;
  }
};
```
