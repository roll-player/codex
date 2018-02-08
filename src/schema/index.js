const { makeExecutableSchema } = require('graphql-tools')
const { find, filter } = require('lodash')

let spells = [
{
    id: 123,
    name: "fireball",
    description: "Cast fireball",
    level: 3
}
]

let users = [

]

let games = [
    { name: 'Endaria', description: 'Home Game', id: 1, owner: 'Michael', players: ['Claire, Lauren, Andy, Max']}
]

let characters = []

let users = []

const generateId = (Math.random() * 1000) | 0 
const extractUser = ctx => 'Michael'

const getSpells = () => spells 
const findSpell = id => find(getSpells(), { id })
const addSpell = ({name, description,level}) => {
    const newSpell = {
        id: generateId(),
        name,
        description,
        level,
    }
    spells.concat(newSpell)
    return newSpell
}
const getGames = () => games
const findGame = id => find(getGames(), { id })
const addGame = ({name, description}, owner) => {
    const newGame = {
        id: generateId(),
        name,
        description,
        owner
    }

    games.push(newGame)

    return newGame
}

const addPlayerToGame = ({gameId, playerId}) => {
    const game = findGame(gameId)
    game.players.push(playerId)
}

const removePlayerFromGame = ({gameId, playerId}) => {
    const game = findGame(gameId)
    game.players = filter(game.players, player => player.id !== playerId)
}

const typeDefs = `
    type Query { 
        spells: [Spell]
        spell (id: Int!): Spell
        games: [Game],
        table (id: Int!): Game
    }

    type Game {
        id: ID!,
        name: String!,
        description: String!,
        owner: String!,
        players: [String]
    }

    type CharacterStat {
        id: ID!,
        name: String!,
        value: Int
    }

    type CharacterDescriptor {
        id: ID!,
        name: String!,
        value: String
    }

    type CharacterAction {
        id: ID!,
        cost: 
    }
    type CharacterClass {
        id: ID!,
        name: string
    }

    type Character {
        id: ID!,
        name: String!,
        class: String!,
    }

    type Mutation {
        addSpell (
            name: String!
            description: String!
            level: Int!
        ): Spell

        createGame (
            name: String!,
            description: String!
        ): Game

        createCharacter (
            ownerId: ID!
            name: String!
        ): Character
    }

    type Spell { 
        id: ID,
        name: String, 
        description: String, 
        level: Int 
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
        createGame: (root, args, ctx) => addGame(args, extractUser(ctx))
    }
}

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
})

module.exports = schema