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
        const collection = db.collection('users')
        return collection.find({ id }).toArray()
    }).catch(reject)
}

const allSpells = () => {
    return dbClient.then(db => {
        const collection = db.collection('spells')
        return collection.find({}).toArray()
    })
}

const updateSpell = ({ id, name, description, level }) => {
    return dbClient.then(db => {
        const collection = db.collection('spells')
        return collection.updateOne({ id }, { $set : { name, description, level } })
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

const addGame = ({name, description}, owner) => {
    return dbClient.then(db => {
        const collection = db.collection('games')
        return collection.inertOne({name, description, ownerId: owner.id, players: [ owner.id ]})
    })
}

const getGames = () => {
    return dbClient.then(db => {
        const collection = db.collection('games')
        return collection.find({}).toArray()
    })
}

const findGame = params => {
    return dbClient.then(db => {
        const collection = db.collection('games')
        return collection.find({ ...params }).toArray()
    })
}

const addPlayerToGame = ({gameId, playerId}, user) => {
    return dbClient.then(db => {
        const collection = db.collection('games')
        return collection.update(
            {
                gameId,
                ownerId: user.id
            },
            {
                $push: { users: playerId }
            }
        )
    })
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