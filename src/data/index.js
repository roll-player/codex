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
    const user = findUser(user)

    if(user) {
        details.id = generateId()
        user.characters.push(details)
    }

    return details
}

const removeCharacter = ({characterId}, user) => {
    const user = findUser(user)

    if (user) {
        const removed = remove(user.character, {id: characterId})
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