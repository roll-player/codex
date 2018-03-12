const { makeExecutableSchema } = require('graphql-tools')
const {
    addGame,
    findGame,
    getGames,
    addSpell,
    findSpell,
    getSpells,
    removePlayerFromGame,
    addPlayerToGame,
    addCharacter,
    removeCharacter
} = require('../data')

const typeDefs = `
    enum ACTION_COST {
        REACTION,
        ACTION,
        BONUS_ACTION,
        MOVEMENT,
        NONE
    }
    
    interface Entity {
        id: ID!,
        name: String,
        description: String
    }

    type Resource {
        id: ID!,
        name: String!,
        url: String!,
        type: String!,
        tags: [String]
    }

    type Game implements Entity {
        id: ID!,
        name: String!,
        description: String!,
        owner: String!,
        players: [String]
    }
    
    type Damage {
        roll: String,
        damageType: String,
        modifier: Int
    }

    type Money {
        platinum: Int,
        gold: Int,
        electrum: Int,
        silver: Int,
        copper: Int
    }

    type CharacterStat implements Entity {
        id: ID!,
        name: String,
        description: String,
        value: Int
    }

    type CharacterDescriptor implements Entity {
        id: ID!,
        name: String,
        description: String,
        extra: String
    }

    type CharacterAction implements Entity {
        id: ID!,
        name: String,
        description: String,
        cost: ACTION_COST
    }

    type CharacterClass implements Entity {
        id: ID!,
        name: String,
        description: String,
        abilities: [String]
    }

    type Weapon implements Entity {
        id: ID!,
        name: String,
        description: String,
        damage: Damage
    }

    type Item implements Entity {
        id: ID!,
        name: String,
        description: String,
        weight: Int,
        value: Money,
        requiresAttunement: Boolean,
        requiresAttunementBy: [String],
        Charges: Int
    }

    input CharacterDetailsInput {
        name: String!
    }

    type Character {
        id: ID!,
        name: String!,
        stats: [CharacterStat],
        descriptors: [CharacterDescriptor],
        class: CharacterClass,
        actions: [CharacterAction],
        level: Int,
        Spells: [Spell],
        Weapon: [Weapon],
        Items: [Item]
    }

    type Spell implements Entity { 
        id: ID!,
        name: String,
        description: String,
        level: Int,
        damage: Damage
    }

    type Mutation {
        addSpell (
            name: String!,
            description: String!,
            level: Int!
        ): Spell

        updateSpell (
            id: ID!,
            name: String!,
            description: String!,
            level: Int!
        ): Spell

        deleteSpell (
            id: ID!
        ): Spell

        findSpell (
            search: String!
        ): [Spell]

        addGame (
            name: String!,
            description: String!
        ): Game

        addResource (
            name: String!,
            type: String!,
            url: String!,
            tags: [String]
        ): Resource

        updateResource (
            id: ID!,
            name: String!,
            type: String!,
            url: String!,
            tags: [String]
        ): Resource

        addPlayerToGame (
            gameId: ID!,
            playerId: ID!
        ): Game

        removePlayerFromGame (
            gameId: ID!,
            playerId: ID!
        ): Game

        addCharacterToPlayer (
            gameId: ID!,
            playerId: ID!,
            characterId: ID!
        ): Character

        removeCharacterFromPlayer(
            gameId: ID!,
            playerId: ID!,
            characterId: ID!
        ): Character

        addCharacter (
            details: CharacterDetailsInput!
        ): Character

        updateCharacter (
            id: ID!,
            details: CharacterDetailsInput!
        ): Character

        removeCharacter (
            id: ID!,
        ): Character

        # addUser (
        #     authBits: String!
        # ): User
    }

    type Query { 
        spells: [Spell]
        spell (id: Int!): Spell
        games: [Game],
        table (id: Int!): Game
    }
`


const resolvers = {
    Query: {
        spells: () => getSpells(),
        spell: (root, { id }, ctx) => findSpell(id),
        games: () => getGames(),
        table: (root, { id }, ctx) => findGame(id)
    },
    Mutation: {
        addSpell: (root, args, ctx) => addSpell(args),
        updateSpell: (root, args, ctx) => updateSpell(args),
        findSpell: (root, args, ctx) => findSpell(args),
        addGame: (root, args, ctx) => addGame(args, extractUser(ctx)),
        addPlayerToGame: (root, args, ctx) => addPlayerToGame(args, extractUser(ctx)),
        removePlayerFromGame: (root, args, ctx) => removePlayerFromGame(args, extractUser(ctx)),
        addCharacter: (root, args, ctx) => addCharacter(args, extractUser(ctx)),
        removeCharacter: (root, args, ctx) => removeCharacter(args, extractUser(ctx))
    }
}

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
})

module.exports = schema