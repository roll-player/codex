const { find, filter } = require('lodash')

let spells = [
{
    id: 123,
    name: "fireball",
    description: "Cast fireball",
    level: 3
}
]

let games = [
]

let characters = []

let users = []

const generateId = (Math.random() * 1000) | 0 
const extractUser = ctx => 'Michael'

const createUser = (user) => users.push(user)

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
        ownerId: owner.id,
        name,
        description
    }

    games.push(newGame)

    return newGame
}

const addPlayerToGame = ({gameId, playerId}, user) => {
    const game = findGame(gameId)

    if(game.owner === user) {
        game.players.push(playerId)
    }
}

const removePlayerFromGame = ({gameId, playerId}, user) => {
    const game = findGame(gameId)

    if (game.owner === user) {
        game.players = filter(game.players, player => player.id !== playerId)
    }
}

const addCharacter = ({details}, user) => {
    const owner = findUser(user)

    if (owner) {
        details.id = generateId()
        owner.characters.push(details)
    }

    return details
}

const removeCharacter = ({characterId}, user) => {
    const owner = findUser(user)

    if (owner) {
        const removed = remove(owner.character, {id: characterId})
        return removed
    }

    return null
}

module.exports = {
    getSpells,
    findSpell,
    addSpell,
    getGames,
    findGame,
    addGame,
    removePlayerFromGame,
    addPlayerToGame,
    addCharacter,
    removeCharacter
}