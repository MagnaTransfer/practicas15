var crypto = require('crypto');
exports.encrypt = function(text){
    var crypto = require("crypto");
    var sha256 = crypto.createHash("sha256");
    sha256.update(text, "utf8");//utf8 here
    var result = sha256.digest("base64");
    return result;
}



