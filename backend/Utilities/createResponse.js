const createResponse = async (success, result = null, error = null) =>
    {
        return {
            success,
            result,
            error: error?.message || error
        }
    }
module.exports = createResponse