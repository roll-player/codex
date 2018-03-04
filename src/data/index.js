const MongoClient = require('mongodb').MongoClient
const dbName = 'rollplayer'

const extractUser = ctx => 'Michael'

const dbClient = MongoClient.connect("mongodb://localhost:27017", {poolSize: 10})
    .then(client => client.db(dbName))
    .catch(err => console.error(err))

const addUser = userdata => {
    return new Promise((resolve, reject) => {
        dbClient.then(db => {
            db.collection('Users')
            
            collection.insertOne(userdata, (err, result) => {
                if (err) {
                    return reject(err)
                }

                return resolve(result)
            }) 
        }).catch(reject)
    })
}

const findUser = id => {
    return dbClient.then(db => {
        const collection = db.collection('Users')
        return collection.find({ id }).toArray()
    }).catch(reject)
}

const allSpells = () => {
    return dbClient.then(db => {
        const collection = db.collection('Spells')
        return collection.find({}).toArray()
    })
}

const addSpell = ({name, description,level}) => {
    return dbClient.then(db => {
        const collection = db.collection('spells')
        return collection.insertOne({name, description, level})
    })
}

const findSpell = name => {
    return dbClient.then(db => {
        const collection = db.collection('spells')
        collection.find({name}).toArray()
    })
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
    getSpells: allSpells,
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