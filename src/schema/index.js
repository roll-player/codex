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

    type Query { 
        spells: [Spell]
        spell (id: Int!): Spell
        games: [Game],
        table (id: Int!): Game
    }

    type Game implements Entity {
        id: ID!,
        name: String!,
        description: String!,
        owner: String!,
        players: [String]
    }
    
    scalar RollMod

    type Damage {
        roll: String,
        damageType: String,
        modifier: RollMod
    }

    type CharacterStat implements Entity {
        value: Int
    }

    type CharacterDescriptor implements Entity {
    }

    type CharacterAction implements Entity {
        cost: ACTION_COST,
    }

    type CharacterClass implements Entity {
    }

    type Character implements Entity {
        class: String!,
    }

    type Weapon implements Entity {
        damage: Damage
    }

    type CharacterDetails {
        name: String!,
        stats: [CharacterStat],
        descriptors: [CharacterDescriptor],
        class: CharacterClass,
        actions: [CharacterAction],
        level: Int,
        Spells: [Spell],
        Weapon: [Weapon],
        Items: [Items]
    }

    type Mutation {
        addSpell (
            name: String!
            description: String!
            level: Int!
        ): Spell

        addGame (
            name: String!,
            description: String!
        ): Game

        addPlayerToGame (
            gameId: ID!,
            playerId: ID!
        ): Game

        removePlayerFromGame (
            gameId: ID!,
            playerId: ID!
        ): Game

        addCharacter (
            ownerId: ID!
            details: CharacterDetails!
        ): Character

        removeCharacter (
            ownerId: ID!,
            characterId: !ID
        ): Character
    }

    type Spell { 
        id: ID,
        name: String, 
        description: String, 
        level: Int,
        damage: Damage
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
        createGame: (root, args, ctx) => addGame(args, extractUser(ctx)),
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