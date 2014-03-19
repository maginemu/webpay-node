/*global module: true */

var WebPayError = function WebPayError(message, status, errorResponse) {
	Error.apply(this, [message]);
	Error.captureStackTrace(this, this.constructor);
	this.name = this.constructor.name;
	this.message = message;
    this.status = status;
    this.errorResponse = errorResponse;
};

WebPayError.prototype = new Error();
WebPayError.prototype.constructor = WebPayError;


var ApiConnectionError = function ApiConnectionError(message, cause) {
    if (typeof message === 'undefined' || message === null) {
        message = cause.message;
    }
    WebPayError.apply(this, [message]);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.cause = cause;
};

ApiConnectionError.prototype = new WebPayError();
ApiConnectionError.prototype.constructor = ApiConnectionError;


var ApiError = function ApiError(status, errorResponse) {
    if (typeof errorResponse === 'undefined') {
        errorResponse = {};
    }
    WebPayError.apply(this, [errorResponse.message, status, errorResponse]);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.type = errorResponse.type;
};

ApiError.prototype = new WebPayError();
ApiError.prototype.constructor = ApiError;


var AuthenticationError = function AuthenticationError(status, errorResponse) {
    if (typeof errorResponse === 'undefined') {
        errorResponse = {};
    }
    WebPayError.apply(this, [errorResponse.message, status, errorResponse]);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
};

AuthenticationError.prototype = new WebPayError();
AuthenticationError.prototype.constructor = AuthenticationError;


var CardError = function CardError(status, errorResponse) {
    if (typeof errorResponse === 'undefined') {
        errorResponse = {};
    }
    WebPayError.apply(this, arguments);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.type = errorResponse.type;
    this.code = errorResponse.code;
    this.param = errorResponse.param;
};

CardError.prototype = new WebPayError();
CardError.prototype.constructor = CardError;


var InvalidRequestError = function InvalidRequestError(status, errorResponse) {
    WebPayError.apply(this, arguments);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.type = errorResponse.type;
    this.param = errorResponse.param;
};

InvalidRequestError.prototype = new WebPayError();
InvalidRequestError.prototype.constructor = InvalidRequestError;


function errorFromJsonResponse(status, data) {
    if (typeof data === "object" && data.error) {
        var errorResponse = data.error;
        switch (status) {
            case 400:
            case 404:
                return new InvalidRequestError(status, errorResponse);
            case 401:
                return new AuthenticationError(status, errorResponse);
            case 402:
                return new CardError(status, errorResponse);
            default:
                return new ApiError(status, errorResponse);
        }
    } else {
        return new ApiConnectionError("Unexpected response: data does not an object containing 'error' field");
    }
}


module.exports = {
    fromJsonResponse: errorFromJsonResponse,
    ApiConnectionError: ApiConnectionError
};
