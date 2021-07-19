module.exports = {
    createHeaders() {
        return {
            'x-api-token': process.env.API_TOKEN
        }
    }
}