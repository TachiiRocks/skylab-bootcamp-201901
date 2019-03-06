const logic = require('../logic')

module.exports = (req, res) => {
    const { params: { userId }, headers: { authorization } } = req

    const token = authorization.substring(7)

    try {
        logic.retrieveUser(userId, token)
            .then(res.json.bind(res))
            .catch(({ message }) => {
                res.status(400).json({
                    error: message
                })
            })
    } catch ({ message }) {
        res.status(400).json({
            error: message
        })
    }
}