const setup = require('../Models/Database_Queries/setup_query')


exports.setupHMO = async function(req, res) {
    const result = await setup.setup_HMO()
    res.json(result)
}

exports.setup_Specialization = async function(req, res) {
    const result = await setup.setup_Specialization()
    res.json(result)
}