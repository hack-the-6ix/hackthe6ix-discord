class PublicError extends Error {
    constructor(message, publicMessage){
        super(message);
        this.publicMessage = publicMessage;

        if(this.publicMessage === undefined){
            this.publicMessage = message;
        }
    }
}

module.exports = PublicError;