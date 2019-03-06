const logic = require('../logic')

module.exports = (req, res) => {
    const { params:{commentId} } = req

    try {
        logic.deleteComment(commentId)
            .then(response => res.json(response))
            .catch(({ message }) => {
                res.status(402).json({
                    error: message
                })
            })
    } catch ({ message }) {
        res.status(403).json({
            error: message
        })
    }
}


