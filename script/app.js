var _ = require("lodash");
let {Youtube} = require('./youtube-control');


let youtube = new Youtube('AIzaSyAtQRlS7nPy56Fr6bFLwUz6Zp5GtHG7-rk');
window.onload = function() {
    youtube.init();
};
youtube.setListeners();



module.exports = {
}

